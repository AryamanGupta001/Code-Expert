// src/utils/chunk_utils.ts
import { get_encoding, Tiktoken } from "@dqbd/tiktoken";
import fs from "fs-extra"; // For chunkFile

const ENCODING_NAME = "cl100k_base";  // matches many code LLMs
const MAX_TOKENS = 1024;
const OVERLAP_TOKENS = 256;

export function chunkCodeText(codeText: string): string[] {
  /**
   * Splits codeText into overlapping windows of MAX_TOKENS tokens,
   * each window overlaps by OVERLAP_TOKENS.
   */
  const enc: Tiktoken = get_encoding(ENCODING_NAME);
  const tokens = enc.encode(codeText);
  const total = tokens.length;
  const chunks: string[] = [];
  let start = 0;
  while (start < total) {
    const end = Math.min(start + MAX_TOKENS, total);
    const windowTokens = tokens.slice(start, end);
    // Ensure chunks are not empty before decoding
    if (windowTokens.length > 0) {
      const chunkStr = new TextDecoder().decode(enc.decode(windowTokens));
      chunks.push(chunkStr);
    }
    
    if (end === total) { // Reached the end
        break;
    }
    start += MAX_TOKENS - OVERLAP_TOKENS;
    // Ensure start doesn't create an empty or too small final overlap if total is small
    if (start >= total - OVERLAP_TOKENS && start < total && total > MAX_TOKENS - OVERLAP_TOKENS) {
        start = total - (MAX_TOKENS - OVERLAP_TOKENS);
        if (start < 0) start = 0; // handle very small texts
    }
     // Prevent infinite loop if MAX_TOKENS - OVERLAP_TOKENS is 0 or negative, or if start doesn't advance
    if (MAX_TOKENS - OVERLAP_TOKENS <= 0 && start === (start - (MAX_TOKENS - OVERLAP_TOKENS))) {
        break; 
    }
  }
  // Free the encoding
  enc.free();
  return chunks;
}

export async function chunkFile(filePath: string): Promise<string[]> {
  /**
   * Reads a file from disk, returns an array of chunk strings.
   */
  const text = await fs.promises.readFile(filePath, "utf-8");
  return chunkCodeText(text);
}

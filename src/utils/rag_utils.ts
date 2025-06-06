// src/utils/rag_utils.ts
import axios from "axios";
import { ChunkRow } from "./supabase_utils";
import { get_encoding as getEncoding } from "@dqbd/tiktoken";

// For Netlify functions, process.env.GEMINI_API_KEY is the way.
const GEMINI_API_KEY: string | undefined = process.env.GEMINI_API_KEY;
// If you also need to support client-side Vite dev with a fallback:
// const GEMINI_API_KEY: string | undefined = process.env.GEMINI_API_KEY || (typeof import.meta !== 'undefined' ? import.meta.env.VITE_GEMINI_API_KEY : undefined);

export interface RAGResult {
  answer: string;
  metrics: {
    context_relevance: number;
    groundedness: number;
    num_chunks_retrieved: number;
  };
  sources: { file_path: string; distance: number }[];
}

export async function callGeminiApi(prompt: string, systemInstruction?: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured. Set GEMINI_API_KEY environment variable.");
  }

  const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;

  const systemContent = systemInstruction || "You are a code assistant. Use only the following code snippets to answer the question. Cite file paths when referring to specific code. If the answer is not in these snippets, say \"I don't know.\"";
  
  const requestBody = {
    contents: [
      {
        role: "user", // For Gemini, system instructions are often prepended to the first user message
        parts: [{ text: `${systemContent}\n\n${prompt}` }] 
      }
    ],
    generationConfig: {
      temperature: 0.3, 
      maxOutputTokens: 4096, // Increased for potentially longer code explanations
      // topP: 0.9,
      // topK: 40, // Consider safetySettings if needed
    }
  };

  try {
    const response = await axios.post(API_ENDPOINT, requestBody, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.data && response.data.candidates && response.data.candidates.length > 0 &&
        response.data.candidates[0].content && response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts.length > 0 && response.data.candidates[0].content.parts[0].text) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected Gemini API response structure:", response.data);
      throw new Error("Invalid response structure from Gemini API or empty response.");
    }
  } catch (error: any) {
    if (error.response) {
      console.error("Error calling Gemini API:", error.response.status, error.response.data);
      throw new Error(`Gemini API Error: ${error.response.status} ${JSON.stringify(error.response.data)}`);
    } else {
      console.error("Error calling Gemini API (no response):", error.message);
      throw new Error(`Gemini API Error: ${error.message}`);
    }
  }
}

export function buildPrompt(question: string, chunks: ChunkRow[]): string {
  // This function now primarily formats the context and question for the `callGeminiApi`
  // The system instruction is handled within `callGeminiApi` or can be passed to it.
  let context = "";
  chunks.forEach((c, i) => {
    context += `### Source ${i + 1}: ${c.file_path}\n\`\`\`\n${c.chunk_text}\n\`\`\`\n\n`;
  });
  // The actual prompt sent to Gemini will be constructed by callGeminiApi using this context + question
  return `Context:\n${context}Question: ${question}\nAnswer:`; // This is the "prompt" part for callGeminiApi's `prompt` parameter
}

export function computeMetrics(answer: string, chunks: ChunkRow[]): {
  context_relevance: number;
  groundedness: number;
  num_chunks_retrieved: number;
} {
  const tokenizer = getEncoding("cl100k_base"); 

  const sims = chunks.length > 0 ? chunks.map((c) => 1 / (1 + Math.max(0, c.distance))) : [0];
  const context_relevance = chunks.length > 0 ? sims.reduce((a, b) => a + b, 0) / sims.length : 0;

  const answerTokens = new Set(Array.from(tokenizer.encode(answer)).map((t: number) => t.toString()));
  const snippetTokens = new Set<string>();
  chunks.forEach((c) => {
    tokenizer.encode(c.chunk_text).forEach((t: number) => snippetTokens.add(t.toString()));
  });
  
  let overlapCount = 0;
  if (answerTokens.size > 0) { 
    answerTokens.forEach((tok) => {
      if (snippetTokens.has(tok)) overlapCount++;
    });
  }
  
  const groundedness = answerTokens.size > 0 ? overlapCount / answerTokens.size : 0;

  tokenizer.free(); 

  return {
    context_relevance: parseFloat(context_relevance.toFixed(4)), 
    groundedness: parseFloat(groundedness.toFixed(4)),     
    num_chunks_retrieved: chunks.length
  };
}

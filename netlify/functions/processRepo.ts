// netlify/functions/processRepo.ts
import { Handler, HandlerEvent, HandlerContext, HandlerResponse } from "@netlify/functions"; // Added HandlerResponse
import crypto from "crypto";
import path from "path";
import fs from "fs-extra";

import * as githubUtils from "../../src/utils/github_utils";
import * as chunkUtils from "../../src/utils/chunk_utils";
// The supabase client is initialized in supabase_utils and insertChunk uses it.
// No need to import supabase directly here if only using insertChunk from that module.
import { insertChunk } from "../../src/utils/supabase_utils"; 
import { pipeline, Pipeline, FeatureExtractionPipeline } from "@xenova/transformers";

let embeddingPipelineInstance: FeatureExtractionPipeline | null = null;
const MODEL_NAME = 'Xenova/microsoft-codebert-base';

async function getEmbeddingPipeline(): Promise<FeatureExtractionPipeline> {
  if (!embeddingPipelineInstance) {
    console.log(`Initializing embedding pipeline (${MODEL_NAME})...`);
    try {
      embeddingPipelineInstance = await pipeline('feature-extraction', MODEL_NAME, {
        quantized: true, 
      }) as FeatureExtractionPipeline;
      console.log("Embedding pipeline initialized successfully.");
    } catch (error) {
      console.error("Failed to initialize embedding pipeline:", error);
      throw error; 
    }
  }
  return embeddingPipelineInstance;
}

// Removed local insertChunk function.
// The call to insertChunk later in this file will now use the imported version
// from ../../src/utils/supabase_utils.ts

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }
    
    const body = JSON.parse(event.body || "{}");
    const githubUrl = body.githubUrl;

    if (!githubUrl) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing githubUrl in body" }) };
    }

    const embedder = await getEmbeddingPipeline();

    const hash = crypto.createHash("sha256");
    hash.update(githubUrl);
    const repoId = hash.digest("hex");

    const token = process.env.GITHUB_TOKEN || ""; 
    const localPath = await githubUtils.cloneRepo(githubUrl, token);
    console.log(`Cloned ${githubUrl} to ${localPath}`);

    let totalChunksProcessed = 0;

    try {
      const codeFiles = await githubUtils.listCodeFiles(localPath);
      console.log(`Found ${codeFiles.length} code files to process.`);
      if (codeFiles.length === 0) {
        // Ensure cleanup before returning early
        await githubUtils.cleanupRepo(localPath);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "No supported code files found in the repository." })
        };
      }

      for (const filePath of codeFiles) {
        const relPath = path.relative(localPath, filePath).replace(/\\/g, "/");
        console.log(`Processing file: ${relPath}`);
        const chunks = await chunkUtils.chunkFile(filePath);
        
        for (let idx = 0; idx < chunks.length; idx++) {
          const chunkText = chunks[idx];
          if (!chunkText || chunkText.trim() === "") {
            console.log(`Skipping empty chunk ${idx} for file ${relPath}`);
            continue;
          }
          const chunkId = `${repoId}__${relPath}__${idx}`;
          
          const output = await embedder(chunkText, { pooling: 'mean', normalize: true });
          const embeddingArray = Array.from(output.data as Float32Array);
          
          // Ensure embedding dimension matches Supabase schema (e.g., 768 for CodeBERT base)
          if (embeddingArray.length !== 768) {
             console.warn(`Embedding for chunk ${chunkId} has unexpected length: ${embeddingArray.length}. Expected 768. Using zeros instead.`);
             const zeroEmbedding = Array(768).fill(0);
             await insertChunk(repoId, relPath, chunkId, chunkText, zeroEmbedding);
          } else {
            await insertChunk(repoId, relPath, chunkId, chunkText, embeddingArray);
          }
          totalChunksProcessed++;
        }
      }
    } finally {
      console.log(`Cleaning up temporary directory: ${localPath}`);
      await githubUtils.cleanupRepo(localPath);
    }

    console.log(`Successfully processed ${totalChunksProcessed} chunks for repo ${repoId}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success", repo_id: repoId, total_chunks: totalChunksProcessed })
    };
  } catch (error: any) {
    console.error("processRepo error:", error.message, error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal Server Error" })
    };
  }
};

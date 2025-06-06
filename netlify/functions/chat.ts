// netlify/functions/chat.ts
import { Handler, HandlerEvent, HandlerContext, HandlerResponse } from "@netlify/functions"; // Added HandlerResponse
import { queryChunks, ChunkRow } from "../../src/utils/supabase_utils";
import { callGeminiApi, buildPrompt, computeMetrics, RAGResult } from "../../src/utils/rag_utils";
import { pipeline, Pipeline, FeatureExtractionPipeline } from "@xenova/transformers";

// Singleton instance for the embedding pipeline for questions
let questionEmbeddingPipeline: FeatureExtractionPipeline | null = null;
const MODEL_NAME = 'Xenova/microsoft-codebert-base'; // Should be the same model as used in processRepo

async function getQuestionEmbeddingPipeline(): Promise<FeatureExtractionPipeline> {
  if (!questionEmbeddingPipeline) {
    console.log(`Initializing question embedding pipeline (${MODEL_NAME})...`);
    try {
      questionEmbeddingPipeline = await pipeline('feature-extraction', MODEL_NAME, {
        quantized: true,
      }) as FeatureExtractionPipeline;
      console.log("Question embedding pipeline initialized successfully.");
    } catch (error) {
      console.error("Failed to initialize question embedding pipeline:", error);
      throw error;
    }
  }
  return questionEmbeddingPipeline;
}

// Removed local queryChunks function.
// The call to queryChunks later in this file will now use the imported version
// from ../../src/utils/supabase_utils.ts
// Note: The local queryChunks function was missing the supabase client import/initialization,
// so removing it and relying on the properly defined one in supabase_utils.ts is correct.

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }
    const body = JSON.parse(event.body || "{}");
    const { repo_id, question, variant } = body;

    if (!repo_id || !question || !variant) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing repo_id, question, or variant" }) };
    }

    const embedder = await getQuestionEmbeddingPipeline();

    // Embed question
    console.log(`Embedding question: "${question}"`);
    const output = await embedder(question, { pooling: 'mean', normalize: true });
    const qEmbedArray = Array.from(output.data as Float32Array);
    
    if (qEmbedArray.length !== 768) {
        console.error(`Question embedding has unexpected length: ${qEmbedArray.length}. Expected 768.`);
        // Handle this error, perhaps by returning an error response or using a fallback
        return { statusCode: 500, body: JSON.stringify({ error: "Failed to generate valid question embedding."}) };
    }
    console.log(`Question embedding generated successfully.`);

    const candidates = await queryChunks(qEmbedArray, repo_id, 50);

    let topCandidates: ChunkRow[];
    if (variant === "filtered") {
      const questionWords = new Set(
        question
          .toLowerCase()
          .split(/\s+/)
          .filter((w: string) => w.length > 3) 
      );
      
      const filtered = candidates.filter((c) => {
        const snippetWords = c.chunk_text.toLowerCase().split(/\s+/);
        return snippetWords.some((w) => questionWords.has(w));
      });

      if (filtered.length > 0) {
        filtered.sort((a, b) => a.distance - b.distance);
        topCandidates = filtered.slice(0, 10);
      } else {
        topCandidates = candidates.slice(0, 10);
      }
    } else {
      topCandidates = candidates.slice(0, 10);
    }

    if (topCandidates.length === 0) {
        return {
            statusCode: 200, // Or 404 if no relevant chunks means "not found"
            body: JSON.stringify({
                answer: "I couldn't find any relevant code snippets in the repository to answer your question. Please try rephrasing or asking about a different topic.",
                metrics: { context_relevance: 0, groundedness: 0, num_chunks_retrieved: 0 },
                sources: []
            })
        };
    }

    const prompt = buildPrompt(question, topCandidates);
    let answer: string;
    try {
      const systemInstruction = "You are a code expert assistant. Use only the provided code snippets to answer the question. Cite file paths when appropriate.";
      answer = await callGeminiApi(prompt, systemInstruction); 
    } catch (err: any) {
      console.error("LLM API error:", err.message, err.stack);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "LLM API error: " + err.message })
      };
    }

    const metrics = computeMetrics(answer, topCandidates);
    const result: RAGResult = {
      answer,
      metrics,
      sources: topCandidates.map((c) => ({ file_path: c.file_path, distance: c.distance }))
    };

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error: any) {
    console.error("chat function error:", error.message, error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal Server Error" })
    };
  }
};
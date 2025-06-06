// src/utils/supabase_utils.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// These will be injected via environment variables under Netlify functions
// For local development, you might need to use a .env file and a library like dotenv
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL) {
  throw new Error("Supabase URL is not defined. Ensure SUPABASE_URL or VITE_SUPABASE_URL is set.");
}
if (!SUPABASE_KEY) {
  throw new Error("Supabase Key is not defined. Ensure SUPABASE_KEY, SUPABASE_SERVICE_KEY or VITE_SUPABASE_ANON_KEY is set.");
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface CodeChunkRecord { // This interface was already in the old file, keeping for consistency if used by frontend
  id: string;
  repo_id: string;
  file_path: string;
  content: string;
  embedding: number[];
  metadata: {
    startLine: number;
    endLine: number;
    imports?: string[];
    functions?: string[];
  };
  created_at: string;
}

export async function insertChunk(
  repo_id: string,
  file_path: string,
  chunk_id: string, // Changed from the old version which took a complex object
  chunk_text: string,
  embedding: number[]
): Promise<void> {
  /**
   * Upserts a row into `code_chunks` with columns:
   * chunk_id (primary key), repo_id, file_path, chunk_text, embedding (vector).
   */
  const { error } = await supabase
    .from("code_chunks")
    .upsert({
      chunk_id,
      repo_id,
      file_path,
      chunk_text: chunk_text, // ensure field name matches table
      embedding  // pgvector accepts a JS array if the column type is vector(768)
    });
    // .throwOnError(); // .throwOnError() is not a standard Supabase client method. Error is returned in the object.
  
  if (error) {
    console.error("Error inserting chunk:", error);
    throw error;
  }
}

export interface ChunkRow { // As per new plan
  chunk_id: string;
  file_path: string;
  chunk_text: string;
  distance: number;
}

export async function queryChunks(
  question_embedding: number[],
  repo_id: string,
  topK = 10
): Promise<ChunkRow[]> {
  /**
   * Calls a Supabase RPC or SQL function to do a nearest‐neighbor search.
   * We assume you created a SQL function `match_chunks_by_embedding(...)` in Supabase.
   */
  const { data, error } = await supabase
    .rpc("match_chunks_by_embedding", { // Name from new plan
      query_embedding: question_embedding,
      repo_filter: repo_id,
      k: topK // Parameter name 'k' as per new plan
    });
  
  if (error) {
    console.error("Error querying chunks:", error);
    throw error;
  }
  return data as ChunkRow[] || []; // Ensure it returns an array even if data is null
}

// The old getRepoChunks function might still be useful for other purposes or debugging
// but is not directly in the new plan's core flow for Netlify functions.
// I'll keep it commented out for now unless you need it.
/*
export async function getRepoChunks(repoId: string) {
  const { data, error } = await supabase
    .from('code_chunks')
    .select('*')
    .eq('repo_id', repoId);
    
  if (error) throw error;
  return data as CodeChunkRecord[];
}
*/

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CodeChunkRecord {
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

export async function insertChunk(chunk: Omit<CodeChunkRecord, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('code_chunks')
    .insert([chunk])
    .select();
    
  if (error) throw error;
  return data[0];
}

export async function searchSimilarChunks(
  embedding: number[],
  repoId: string,
  limit: number = 5
) {
  const { data, error } = await supabase.rpc('match_chunks', {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: limit,
    repo_filter: repoId
  });
  
  if (error) throw error;
  return data as CodeChunkRecord[];
}

export async function getRepoChunks(repoId: string) {
  const { data, error } = await supabase
    .from('code_chunks')
    .select('*')
    .eq('repo_id', repoId);
    
  if (error) throw error;
  return data as CodeChunkRecord[];
}
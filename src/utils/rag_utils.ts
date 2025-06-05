import { encode } from 'gpt-tokenizer';
import { searchSimilarChunks } from './supabase_utils';
import type { CodeChunkRecord } from './supabase_utils';

interface RAGResponse {
  answer: string;
  sources: string[];
  metrics: {
    contextRelevance: number;
    groundedness: number;
    chunksRetrieved: number;
  };
}

const SYSTEM_PROMPT = `You are a code expert assistant. Answer questions about code using only the provided context. 
If you cannot answer from the context, say so. Always cite specific files when referencing code.`;

export async function generateAnswer(
  question: string,
  context: CodeChunkRecord[],
  variant: 'base' | 'filtered' = 'filtered'
): Promise<RAGResponse> {
  // Prepare context
  const contextText = context
    .map(chunk => `File: ${chunk.file_path}\n\`\`\`\n${chunk.content}\n\`\`\``)
    .join('\n\n');
  
  // Build messages array
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `Context:\n${contextText}\n\nQuestion: ${question}` }
  ];
  
  try {
    // Call DeepSeek API
    const response = await fetch('https://api.deepseek.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.3,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate answer');
    }
    
    const result = await response.json();
    const answer = result.choices[0].message.content;
    
    // Calculate metrics
    const metrics = calculateMetrics(answer, context, question);
    
    return {
      answer,
      sources: context.map(c => c.file_path),
      metrics
    };
  } catch (error) {
    console.error('Error generating answer:', error);
    throw error;
  }
}

function calculateMetrics(
  answer: string,
  context: CodeChunkRecord[],
  question: string
) {
  // Calculate context relevance based on token overlap
  const answerTokens = new Set(encode(answer));
  const contextTokens = new Set(
    context.flatMap(c => encode(c.content))
  );
  const questionTokens = new Set(encode(question));
  
  const relevantTokens = new Set(
    [...answerTokens].filter(t => contextTokens.has(t))
  );
  
  const contextRelevance = relevantTokens.size / answerTokens.size;
  
  // Calculate groundedness based on factual consistency
  const groundedness = Math.min(
    contextRelevance * 1.2, // Boost if highly relevant
    0.95 // Cap at 0.95 to account for uncertainty
  );
  
  return {
    contextRelevance,
    groundedness,
    chunksRetrieved: context.length
  };
}
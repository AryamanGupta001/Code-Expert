export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: string[];
  metrics?: MetricsData; // Added for bot messages carrying metrics
  isError?: boolean;    // Added for styling error messages
}

export interface Repository {
  id: string;
  url: string;
  name: string;
  chunks: number;
}

export interface MetricsData {
  context_relevance: number; // Changed to snake_case
  groundedness: number;      // No change needed, was already camelCase in RAGResult.metrics, but should match
  num_chunks_retrieved: number; // Changed to snake_case and name to match RAGResult.metrics
}

export type RAGVariant = 'base' | 'filtered';

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface HowToStep {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// This should match the structure returned by your Netlify chat function
// and what rag_utils.ts defines as RAGResult
export interface RAGResult {
  answer: string;
  metrics: {
    context_relevance: number;
    groundedness: number;
    num_chunks_retrieved: number;
  };
  sources: { file_path: string; distance: number }[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: string[];
}

export interface Repository {
  id: string;
  url: string;
  name: string;
  chunks: number;
}

export interface MetricsData {
  contextRelevance: number;
  groundedness: number;
  chunksRetrieved: number;
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
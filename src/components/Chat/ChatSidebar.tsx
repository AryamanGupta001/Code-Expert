import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, BookOpen, Github, HelpCircle, Database } from 'lucide-react';
import { Repository, FAQItem } from '../../types';

interface ChatSidebarProps {
  className?: string;
  currentRepository: Repository | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ className, currentRepository }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const faqs: FAQItem[] = [
    {
      question: "What kinds of repos work best?",
      answer: "Code Expert works best with well-structured repositories that have clear organization. Repositories with good documentation and consistent coding patterns tend to yield the best results."
    },
    {
      question: "Why does it take time to index?",
      answer: "During indexing, Code Expert parses all files, breaks them into logical chunks, computes embeddings for each chunk, and creates a vector index. Larger repositories with more files will naturally take longer to process."
    },
    {
      question: "How does Filtered RAG differ from Base RAG?",
      answer: "Base RAG retrieves chunks based purely on semantic similarity, while Filtered RAG applies additional constraints to prioritize more specific, relevant chunks before processing. Filtered RAG typically produces more precise answers for specific questions."
    },
    {
      question: "Is my code data private?",
      answer: "Yes, Code Expert processes all data locally in your browser session. No repository data is stored on servers, and all processing is done on-device using client-side models."
    }
  ];

  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  return (
    <div className={`${className || ''}`}>
      <div className="bg-white rounded-lg shadow-card border border-gray-200 p-4 sticky top-24">
        {/* Indexed Repositories */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Database className="text-teal mr-2" size={18} />
            Indexed Repositories
          </h3>
          
          {currentRepository ? (
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="font-medium truncate">{currentRepository.name}</div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Chunks:</span>
                <span className="font-mono">{currentRepository.chunks}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded border border-gray-200">
              No repositories indexed yet. Process a repository to get started.
            </div>
          )}
        </div>
        
        {/* Search in Chat (disabled in demo) */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search in chat history..."
              className="w-full pl-10 pr-4 py-2 border rounded-md text-sm bg-gray-50 cursor-not-allowed"
              disabled
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Chat history search is available after your first conversation
          </p>
        </div>
        
        {/* Quick Tips / FAQ */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <HelpCircle className="text-teal mr-2" size={18} />
            FAQ
          </h3>
          
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex justify-between items-center w-full p-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                  aria-expanded={expandedFaq === index}
                >
                  <span className="font-medium">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                
                {expandedFaq === index && (
                  <div className="p-3 border-t border-gray-200 text-sm text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Contribute / Feedback */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <BookOpen className="text-teal mr-2" size={18} />
            Resources
          </h3>
          
          <div className="space-y-2">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded transition-colors"
            >
              <Github size={16} className="mr-2 text-teal" />
              <span>Report an issue on GitHub</span>
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded transition-colors"
            >
              <BookOpen size={16} className="mr-2 text-teal" />
              <span>View documentation</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
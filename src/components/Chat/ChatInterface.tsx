import React, { useState, useRef, useEffect } from 'react';
import { Database, Loader, FilterX } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatMetrics from './ChatMetrics';
import ChatSidebar from './ChatSidebar';
import { ChatMessage as ChatMessageType, RAGVariant, MetricsData, Repository } from '../../types';

interface ChatInterfaceProps {
  currentRepository: Repository | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentRepository }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ragVariant, setRagVariant] = useState<RAGVariant>('filtered');
  const [metrics, setMetrics] = useState<MetricsData>({
    contextRelevance: 0.85,
    groundedness: 0.92,
    chunksRetrieved: 12
  });
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!currentRepository) return;
    
    // Add user message
    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add bot response
      const botMessage: ChatMessageType = {
        id: `bot-${Date.now()}`,
        content: generateDemoResponse(content),
        sender: 'bot',
        timestamp: new Date(),
        sources: [
          'src/auth/AuthProvider.tsx',
          'src/utils/api.ts',
          'src/components/Login.tsx'
        ]
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Update metrics
      setMetrics({
        contextRelevance: Math.min(0.95, 0.75 + Math.random() * 0.2),
        groundedness: Math.min(0.98, 0.8 + Math.random() * 0.15),
        chunksRetrieved: Math.floor(5 + Math.random() * 10)
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateDemoResponse = (question: string) => {
    if (question.toLowerCase().includes('authentication')) {
      return "The authentication system in this repository uses JWT (JSON Web Tokens) for session management. The main components are:\n\n1. `AuthProvider.tsx` - React context that manages auth state\n2. `api.ts` - Contains login/logout API calls\n3. `Login.tsx` - UI component for login form\n\nThe flow works like this: User credentials are sent to the backend, which validates them and returns a JWT. This token is stored in localStorage and included in subsequent API requests as an Authorization header.";
    }
    
    return "Based on my analysis of the repository, I found relevant code patterns related to your question. The codebase follows modern architecture principles with clear separation of concerns.\n\nThe specific functionality you're asking about is implemented in several files across the project. Would you like me to explain the high-level architecture or dive deeper into specific implementation details?";
  };

  return (
    <section id="chat-interface" className="section bg-white">
      <div className="container-custom">
        <h2 className="text-center mb-12">Chat with Your Codebase</h2>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Chat Panel */}
          <div className="w-full lg:w-2/3 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-card border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
                <div className="font-medium text-gray-700 flex items-center">
                  <Database className="text-teal mr-2" size={18} />
                  {currentRepository ? (
                    <span>Chatting with: <span className="font-semibold">{currentRepository.name}</span></span>
                  ) : (
                    <span>No repository indexed yet</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex text-sm">
                    <button
                      className={`px-3 py-1 rounded-l-md ${
                        ragVariant === 'base'
                          ? 'bg-teal text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                      onClick={() => setRagVariant('base')}
                    >
                      Base RAG
                    </button>
                    <button
                      className={`px-3 py-1 rounded-r-md flex items-center ${
                        ragVariant === 'filtered'
                          ? 'bg-teal text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                      onClick={() => setRagVariant('filtered')}
                    >
                      <FilterX className="mr-1" size={14} />
                      Filtered RAG
                    </button>
                  </div>
                </div>
              </div>
              
              <div 
                ref={chatContainerRef}
                className="p-4 h-[400px] overflow-y-auto"
                aria-live="polite"
              >
                {messages.length === 0 && !isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <MessageSquareWithCode className="mb-4 text-gray-400" />
                    <p className="font-medium">No messages yet</p>
                    <p className="text-sm mt-2">
                      {currentRepository 
                        ? "Ask a question about the code repository to get started"
                        : "Process a GitHub repository first to start chatting"
                      }
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {isLoading && (
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Loader className="animate-spin\" size={16} />
                        <span>Code Expert is thinking...</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <ChatInput 
                  onSendMessage={handleSendMessage} 
                  disabled={!currentRepository || isLoading}
                />
                
                {messages.length > 0 && (
                  <ChatMetrics metrics={metrics} />
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <ChatSidebar 
            className="w-full lg:w-1/3 order-1 lg:order-2"
            currentRepository={currentRepository}
          />
        </div>
      </div>
    </section>
  );
};

// Custom icon component for empty state
const MessageSquareWithCode: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`w-16 h-16 ${className || ''}`}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 10L6 12L8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 10L18 12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 8L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
};

export default ChatInterface;
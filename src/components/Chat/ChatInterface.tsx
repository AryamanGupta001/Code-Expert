import React, { useState, useRef, useEffect } from 'react';
import { Database, Loader, FilterX, MessageSquareText } from 'lucide-react'; // Added MessageSquareText
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatMetrics from './ChatMetrics'; // Will be used if a message contains metrics
import ChatSidebar from './ChatSidebar';
import { 
  ChatMessage as ChatMessageType, 
  RAGVariant, 
  MetricsData, 
  Repository, 
  RAGResult as BackendRAGResult // Renamed to avoid conflict if RAGResult is used locally
} from '../../types';

interface ChatInterfaceProps {
  repoId: string | null;
  currentRepositoryName?: string;
  currentRepositoryChunks?: number; 
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ repoId, currentRepositoryName, currentRepositoryChunks }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ragVariant, setRagVariant] = useState<RAGVariant>('filtered');
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!repoId) {
      console.error("No repoId available to send message.");
      return;
    }
    
    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_id: repoId,
          question: content,
          variant: ragVariant
        })
      });

      const result = await response.json() as BackendRAGResult;

      if (!response.ok) {
        throw new Error(result.answer || `Error fetching chat response (status: ${response.status})`);
      }
      
      const botMessage: ChatMessageType = {
        id: `bot-${Date.now()}`,
        content: result.answer,
        sender: 'bot',
        timestamp: new Date(),
        sources: result.sources ? result.sources.map((s: { file_path: string; distance: number }) => s.file_path) : [], // Added type for s
        metrics: result.metrics // Add metrics from backend
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (err: any) {
      console.error("Error sending message or fetching response:", err);
      const errorMessage: ChatMessageType = {
        id: `error-${Date.now()}`,
        content: `Error: ${err.message || "Could not get a response."}`,
        sender: 'bot', // Display error as a bot message
        timestamp: new Date(),
        isError: true // Custom property to style error messages if needed
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // generateDemoResponse is no longer needed as we call the backend.

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
                  {repoId && currentRepositoryName ? (
                    <span>Chatting with: <span className="font-semibold">{currentRepositoryName}</span></span>
                  ) : repoId ? (
                    <span>Chatting with: <span className="font-semibold text-xs">{repoId}</span></span>
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                    <MessageSquareText size={48} className="mb-4 text-gray-400" />
                    <p className="font-medium">No messages yet</p>
                    <p className="text-sm mt-2">
                      {repoId 
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
                      <div className="flex items-center space-x-2 text-gray-500 p-2 ml-2">
                        <Loader className="animate-spin" size={16} />
                        <span>Code Expert is thinking...</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <ChatInput 
                  onSendMessage={handleSendMessage} 
                  disabled={!repoId || isLoading}
                />
                {/* Display metrics from the latest bot message if available */}
                {messages.slice().reverse().find(msg => msg.sender === 'bot' && msg.metrics)?.metrics && (
                  <ChatMetrics metrics={messages.slice().reverse().find(msg => msg.sender === 'bot' && msg.metrics)!.metrics!} />
                )}
              </div>
            </div>
          </div>
          
          <ChatSidebar 
            className="w-full lg:w-1/3 order-1 lg:order-2"
            currentRepository={repoId ? { 
              id: repoId, 
              name: currentRepositoryName || repoId.substring(0,12)+'...', // Use name or part of ID
              url: '', // URL not directly available here, might need to fetch or pass differently
              chunks: currentRepositoryChunks || 0 
            } : null}
          />
        </div>
      </div>
    </section>
  );
};

export default ChatInterface;

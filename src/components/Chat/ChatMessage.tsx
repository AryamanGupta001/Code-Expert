import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code, FileText } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [showSources, setShowSources] = useState(false);
  
  const toggleSources = () => {
    setShowSources(!showSources);
  };

  if (message.sender === 'user') {
    return (
      <div className="mb-4 flex justify-end">
        <div className="chat-bubble-user">
          <p>{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="chat-bubble-bot">
        <p className="whitespace-pre-line">{message.content}</p>
        
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2">
            <button
              onClick={toggleSources}
              className="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors mt-1"
              aria-expanded={showSources}
            >
              <FileText size={12} className="mr-1" />
              Sources {showSources ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            
            {showSources && (
              <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-200">
                <p className="font-medium mb-1">Reference Files:</p>
                <ul className="pl-2">
                  {message.sources.map((source, index) => (
                    <li key={index} className="flex items-center">
                      <Code size={10} className="inline mr-1 text-gray-500" />
                      <span className="font-mono">{source}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
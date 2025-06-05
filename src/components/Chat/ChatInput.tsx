import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the code..."
          className={`w-full px-4 py-3 pr-12 border rounded-lg resize-none overflow-hidden min-h-[60px] max-h-[120px] ${
            disabled 
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
              : 'focus:ring-2 focus:ring-teal-200 focus:border-teal focus:outline-none'
          }`}
          disabled={disabled}
          maxLength={500}
          rows={1}
          aria-label="Chat message input"
        />
        <button
          type="submit"
          className={`absolute right-3 bottom-3 p-1 rounded-full ${
            !message.trim() || disabled
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-teal text-white hover:bg-teal-dark'
          }`}
          disabled={!message.trim() || disabled}
        >
          <Send size={18} />
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-1 flex justify-between">
        <span>{message.length}/500 characters</span>
        {!disabled && (
          <span>Press Enter to send, Shift+Enter for new line</span>
        )}
      </div>
    </form>
  );
};

export default ChatInput;
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MetricsData } from '../../types';

interface ChatMetricsProps {
  metrics: MetricsData;
}

const ChatMetrics: React.FC<ChatMetricsProps> = ({ metrics }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="mt-4 border-t border-gray-200 pt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-sm text-gray-500 hover:text-gray-700 py-1 transition-colors"
        aria-expanded={isExpanded}
      >
        <span className="font-medium">Metrics & Analysis</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isExpanded && (
        <div className="bg-gray-50 p-3 rounded-md mt-2 text-sm">
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span>Context Relevance:</span>
              <span className="font-semibold">{metrics.contextRelevance.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-teal h-1.5 rounded-full" 
                style={{ width: `${metrics.contextRelevance * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span>Groundedness:</span>
              <span className="font-semibold">{metrics.groundedness.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-teal h-1.5 rounded-full" 
                style={{ width: `${metrics.groundedness * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Chunks Retrieved:</span>
            <span className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">
              {metrics.chunksRetrieved}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMetrics;
import React, { useState } from 'react';
import { ArrowRight, Loader } from 'lucide-react';

interface LiveDemoProps {
  onProcessRepo: (url: string) => Promise<void>;
}

const LiveDemo: React.FC<LiveDemoProps> = ({ onProcessRepo }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const isValidGithubUrl = (url: string) => {
    return /^https:\/\/github\.com\/[^\/]+\/[^\/]+/.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidGithubUrl(repoUrl)) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    
    try {
      await onProcessRepo(repoUrl);
      setIsSuccess(true);
      setTimeout(() => {
        const chatSection = document.getElementById('chat-interface');
        if (chatSection) {
          chatSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Reset success after scrolling
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      }, 1000);
    } catch (err) {
      setError('Failed to process repository. Please check the URL and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="live-demo" className="section bg-gradient-to-b from-gray-100 to-white">
      <div className="container-custom">
        <h2 className="text-center mb-4">Try Live Demo</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          No sign-up required. Just enter a GitHub repo and start chatting.
        </p>
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-card p-6">
            <div className="mb-4">
              <label 
                htmlFor="repo-url-input" 
                className="block text-gray-700 font-medium mb-2"
              >
                GitHub Repository URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="repo-url-input"
                  placeholder="https://github.com/username/repo/"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                    error ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-teal-200 focus:border-teal'
                  }`}
                  required
                  aria-label="GitHub repository URL"
                  aria-invalid={!!error}
                  aria-describedby={error ? "url-error" : undefined}
                />
              </div>
              {error && (
                <p id="url-error" className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="btn btn-primary py-3 px-8 text-lg flex items-center"
                disabled={isProcessing || !repoUrl}
              >
                {isProcessing ? (
                  <>
                    <Loader className="animate-spin mr-2\" size={20} />
                    Processing Repository...
                  </>
                ) : (
                  <>
                    Process Repo
                    <ArrowRight className="ml-2" size={20} />
                  </>
                )}
              </button>
            </div>
            
            {isProcessing && (
              <div className="mt-4 text-center text-gray-600 flex flex-col items-center">
                <div className="w-full max-w-md bg-gray-100 rounded-full h-2.5 mb-2">
                  <div className="bg-teal h-2.5 rounded-full animate-pulse w-3/4"></div>
                </div>
                <p>Indexing code... This may take up to 60 seconds.</p>
              </div>
            )}
            
            {isSuccess && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Success! </strong>
                <span className="block sm:inline">Repository indexed! You can now ask questions below.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
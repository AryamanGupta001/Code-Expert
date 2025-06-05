import React from 'react';
import { Github, Database, Search, MessageSquare } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="section bg-white">
      <div className="container-custom">
        <h2 className="text-center mb-12 animate-fade-up">About Code Expert</h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-in">
            <p className="text-lg">
              Code Expert is a free, open-source AI assistant that enables developers to interactively ask questions about any public GitHub repository.
            </p>
            <p>
              Powered by open-source Large Language Models (LLMs) like Code Llama and StarCoder2, Code Expert breaks code into context-aware chunks and delivers precise answers in seconds.
            </p>
            <p>
              Whether you're exploring a new library, understanding legacy code, or onboarding to a new project, Code Expert helps you navigate complex codebases with ease.
            </p>
            <div className="mt-8">
              <a 
                href="https://github.com/AryamanGupta001/Code-Expert" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary flex items-center w-fit animate-bounce-in"
              >
                <Github size={18} className="mr-2" />
                View on GitHub
              </a>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="bg-gray-50 p-6 rounded-xl shadow-card">
              <div className="flex flex-col space-y-8">
                <div className="flex items-start animate-fade-up" style={{ animationDelay: '0.2s' }}>
                  <div className="bg-teal rounded-full p-3 mr-4 animate-pulse-soft">
                    <Github className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Repository Input</h3>
                    <p className="text-gray-600">Paste any GitHub URL and let Code Expert handle the rest</p>
                  </div>
                </div>
                
                <div className="w-full flex justify-center">
                  <div className="h-10 border-l-2 border-dashed border-teal animate-draw"></div>
                </div>
                
                <div className="flex items-start animate-fade-up" style={{ animationDelay: '0.4s' }}>
                  <div className="bg-teal rounded-full p-3 mr-4 animate-pulse-soft">
                    <Database className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Code Chunking & Indexing</h3>
                    <p className="text-gray-600">Smart parsing and vector embedding of code</p>
                  </div>
                </div>
                
                <div className="w-full flex justify-center">
                  <div className="h-10 border-l-2 border-dashed border-teal animate-draw"></div>
                </div>
                
                <div className="flex items-start animate-fade-up" style={{ animationDelay: '0.6s' }}>
                  <div className="bg-teal rounded-full p-3 mr-4 animate-pulse-soft">
                    <Search className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Semantic Search</h3>
                    <p className="text-gray-600">Retrieve the most relevant code chunks</p>
                  </div>
                </div>
                
                <div className="w-full flex justify-center">
                  <div className="h-10 border-l-2 border-dashed border-teal animate-draw"></div>
                </div>
                
                <div className="flex items-start animate-fade-up" style={{ animationDelay: '0.8s' }}>
                  <div className="bg-teal rounded-full p-3 mr-4 animate-pulse-soft">
                    <MessageSquare className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Contextual Answers</h3>
                    <p className="text-gray-600">Accurate responses grounded in your codebase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
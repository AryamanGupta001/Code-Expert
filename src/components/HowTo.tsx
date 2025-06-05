import React from 'react';
import { Github, FileCode, MessageSquare, Gauge } from 'lucide-react';
import { HowToStep } from '../types';

const HowTo: React.FC = () => {
  const steps: HowToStep[] = [
    {
      step: 1,
      title: "Enter GitHub URL",
      description: "Paste any public repository URL into the input field and click 'Process Repo.'",
      icon: <Github className="text-white" size={24} />
    },
    {
      step: 2,
      title: "Code Chunking & Indexing",
      description: "Code Expert automatically breaks the repository into meaningful code chunks and builds a vector index.",
      icon: <FileCode className="text-white\" size={24} />
    },
    {
      step: 3,
      title: "Ask Questions",
      description: "Use the interactive chat interface to ask anything about architecture, dependencies, or specific functions.",
      icon: <MessageSquare className="text-white" size={24} />
    },
    {
      step: 4,
      title: "Get Instant Answers",
      description: "Receive detailed, context-grounded answers in seconds, powered by RAG.",
      icon: <Gauge className="text-white\" size={24} />
    }
  ];

  return (
    <section id="how-it-works" className="section bg-gray-100">
      <div className="container-custom">
        <h2 className="text-center mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div 
              key={step.step}
              className="card group hover:border-teal transition-all duration-300 transform hover:-translate-y-1"
              tabIndex={0}
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-teal rounded-full p-4 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {step.step}. {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Visual process flow for larger screens */}
        <div className="hidden lg:flex justify-between items-center mt-8 px-16">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="w-full h-0.5 bg-teal-light relative">
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-teal rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowTo;
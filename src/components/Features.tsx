import React from 'react';
import { MessageSquare as MessageSquareBolt, Unlock, LayoutPanelLeft, Globe, Search, Users } from 'lucide-react';
import { Feature } from '../types';

const Features: React.FC = () => {
  const features: Feature[] = [
    {
      title: "Real-Time Chat",
      description: "Interact directly with your indexed code; get answers in seconds.",
      icon: <MessageSquareBolt className="text-teal" size={36} />
    },
    {
      title: "100% Free & Open Source",
      description: "No subscription or API keys required—just paste and ask.",
      icon: <Unlock className="text-teal\" size={36} />
    },
    {
      title: "Dual RAG Engines",
      description: "Compare high-level vs. filtered retrieval for optimal answers.",
      icon: <LayoutPanelLeft className="text-teal" size={36} />
    },
    {
      title: "Supports Multiple Languages",
      description: "Automatically chunks Python, JavaScript, Java, C++, Markdown, and more.",
      icon: <Globe className="text-teal\" size={36} />
    },
    {
      title: "SEO & AI-Optimized",
      description: "Built with semantic HTML and accessible design for maximum discovery.",
      icon: <Search className="text-teal" size={36} />
    },
    {
      title: "Community-Driven",
      description: "Contribute on GitHub and help improve features.",
      icon: <Users className="text-teal\" size={36} />
    }
  ];

  return (
    <section id="features" className="section bg-white">
      <div className="container-custom">
        <h2 className="text-center mb-12">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card group cursor-pointer hover:border-teal-light border border-transparent transition-all duration-300"
              tabIndex={0}
              aria-describedby={`feature-${index}-description`}
            >
              <div className="flex">
                <div className="mr-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p id={`feature-${index}-description`} className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
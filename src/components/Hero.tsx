import React from 'react';
import { Code, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center py-20 md:py-0">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-light to-gray-100 z-0"></div>
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-white mb-6 font-bold leading-tight">
              <span className="inline-block">📖 Code Expert:</span> <br className="md:hidden" />
              <span className="text-teal">Explore Any GitHub Repo</span> in Seconds
            </h1>
            <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-xl mx-auto md:mx-0">
              Ask questions, understand dependencies, and navigate large codebases—instantly, for free.
            </p>
            <button 
              onClick={() => scrollToSection('chat-interface')}
              className="btn btn-primary text-lg px-8 py-3 flex items-center mx-auto md:mx-0"
              aria-label="Try live demo"
            >
              <Sparkles size={18} className="mr-2" />
              Try Live Demo
            </button>
          </div>
          
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="bg-navy-light border border-gray-700 rounded-lg shadow-xl overflow-hidden w-full max-w-md transform transition-all hover:-rotate-1 hover:scale-[1.02]">
              <div className="flex items-center bg-gray-800 p-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-gray-400 text-sm mx-auto">code-expert.js</div>
              </div>
              <div className="p-4 text-left">
                <pre className="text-xs md:text-sm text-gray-300 overflow-x-auto">
                  <code>
{`// Code Expert Demo
import { CodeExpert } from './code-expert';

// Initialize with GitHub repo URL
const expert = new CodeExpert({
  repoUrl: 'https://github.com/user/repo',
  model: 'Deepseek V3'
});

// Process the repository
await expert.processRepo();

// Ask questions about the code
const answer = await expert.ask(
  'How does the authentication system work?'
);

console.log(answer);
// → "The authentication system uses JWT tokens..."
`}
                  </code>
                </pre>
              </div>
              <div className="p-3 bg-gray-800 text-white border-t border-gray-700 flex items-center">
                <Code className="text-teal mr-2" size={14} />
                <span className="text-xs">Powered by RAG technology</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
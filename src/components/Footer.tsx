import React from 'react';
import { Code, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Column 1 - Documentation */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Documentation</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="footer-link">Getting Started</a>
              </li>
              <li>
                <a href="#" className="footer-link">API Reference</a>
              </li>
              <li>
                <a href="#" className="footer-link">Examples</a>
              </li>
              <li>
                <a href="#" className="footer-link">Tutorials</a>
              </li>
            </ul>
          </div>
          
          {/* Column 2 - Community */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/AryamanGupta001/Code-Expert/"
                  className="footer-link flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={16} className="mr-2" />
                  GitHub Repo
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">Discussion Forum</a>
              </li>
              <li>
                <a href="#" className="footer-link">Contribute</a>
              </li>
              <li>
                <a href="#" className="footer-link">Roadmap</a>
              </li>
            </ul>
          </div>
          
          {/* Column 3 - Legal */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="footer-link">License (MIT)</a>
              </li>
              <li>
                <a href="#" className="footer-link">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="footer-link">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 mt-6 border-t border-gray-700 text-center">
          <div className="flex items-center justify-center mb-4">
            <Code className="text-teal mr-2" size={24} />
            <span className="text-xl font-bold">Code Expert</span>
          </div>
          
          <p className="text-gray-400 mb-4">
            © 2025 Code Expert • Built with ❤️ by Aryaman Gupta
          </p>
          
          <div className="flex justify-center space-x-4">
            <a 
              href="https://github.com/AryamanGupta001/Code-Expert/"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a 
              href="https://www.linkedin.com/in/gupta-aryaman/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
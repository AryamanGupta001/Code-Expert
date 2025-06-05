import React, { useState, useEffect } from 'react';
import { Menu, X, Code, Github } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-navy shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center">
          <Code className="text-teal mr-2" size={28} />
          <span className="text-white font-bold text-xl">Code Expert</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('about')}
            aria-label="About section"
          >
            About
          </button>
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('how-it-works')}
            aria-label="How it works section"
          >
            How It Works
          </button>
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('features')}
            aria-label="Features section"
          >
            Features
          </button>
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('live-demo')}
            aria-label="Live demo section"
          >
            Live Demo
          </button>
          <a 
            href="https://github.com/AryamanGupta001/Code-Expert/"
            className="nav-link flex items-center" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Documentation"
          >
            <Github size={16} className="mr-1" />
            Docs
          </a>
          <button 
            className="btn btn-primary ml-4" 
            onClick={() => scrollToSection('chat-interface')}
            aria-label="Try demo"
          >
            Try Demo
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-navy-light absolute top-full left-0 right-0 shadow-md">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <button 
              className="nav-link text-left py-2" 
              onClick={() => scrollToSection('about')}
            >
              About
            </button>
            <button 
              className="nav-link text-left py-2" 
              onClick={() => scrollToSection('how-it-works')}
            >
              How It Works
            </button>
            <button 
              className="nav-link text-left py-2" 
              onClick={() => scrollToSection('features')}
            >
              Features
            </button>
            <button 
              className="nav-link text-left py-2" 
              onClick={() => scrollToSection('live-demo')}
            >
              Live Demo
            </button>
            <a 
              href="https://github.com" 
              className="nav-link flex items-center py-2" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Github size={16} className="mr-2" />
              Documentation
            </a>
            <button 
              className="btn btn-primary" 
              onClick={() => scrollToSection('chat-interface')}
            >
              Try Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
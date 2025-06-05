import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import HowTo from './components/HowTo';
import Features from './components/Features';
import LiveDemo from './components/LiveDemo';
import ChatInterface from './components/Chat/ChatInterface';
import Footer from './components/Footer';
import { Repository } from './types';

function App() {
  const [currentRepository, setCurrentRepository] = useState<Repository | null>(null);

  const handleProcessRepo = async (url: string) => {
    // In a real app, this would make an API call to process the repository
    // For demo purposes, we'll simulate processing with a timeout
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Extract repo name from URL
    const urlParts = url.split('/');
    const repoName = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
    
    setCurrentRepository({
      id: `repo-${Date.now()}`,
      url,
      name: repoName,
      chunks: Math.floor(50 + Math.random() * 150)
    });
    
    return true;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main>
        <Hero />
        <About />
        <HowTo />
        <Features />
        <LiveDemo onProcessRepo={handleProcessRepo} />
        <ChatInterface currentRepository={currentRepository} />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
import React, { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import HowTo from './components/HowTo';
import Features from './components/Features';
import LiveDemo from './components/LiveDemo';
import ChatInterface from './components/Chat/ChatInterface';
import Footer from './components/Footer';
// Repository type might not be directly used here anymore if repoId is the primary state
// import { Repository } from './types'; 

function App() {
  const [repoId, setRepoId] = useState<string | null>(null);
  // For simplicity based on LiveDemo's current onRepoProcessed, 
  // repoName and repoTotalChunks are not managed here directly.
  // ChatInterface will use repoId and has fallbacks if name/chunks are not passed.
  // If processRepo Netlify function returns more data, LiveDemo can pass it,
  // and App.tsx can store it in state.

  const chatRef = useRef<HTMLDivElement>(null);

  // This function will be called by LiveDemo after the Netlify function successfully processes the repo
  // LiveDemo currently calls onRepoProcessed(data.repo_id)
  const handleRepoProcessed = (processedRepoId: string) => {
    setRepoId(processedRepoId);
    // If you want to extract repo name from URL, LiveDemo would need to pass the original URL too
    // For example: handleRepoProcessed = (id, url, chunks) => { setRepoId(id); setUrl(url); ... }
  };
  
  // Scroll to chat interface when repoId is set
  useEffect(() => {
    if (repoId && chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [repoId]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow"> {/* Added flex-grow */}
        <Hero />
        <About />
        <HowTo />
        <Features />
        
        <section id="live-demo" className="section bg-gray-50"> 
          <LiveDemo onRepoProcessed={handleRepoProcessed} />
        </section>
        
        {/* Conditionally render ChatInterface */}
        {repoId && (
          <section id="chat-interface" ref={chatRef} className="section bg-white">
            <ChatInterface 
              repoId={repoId} 
              // currentRepositoryName and currentRepositoryChunks can be added if fetched/passed
            />
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;

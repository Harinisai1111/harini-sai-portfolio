
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Journey from './pages/Journey';
import Credentials from './pages/Credentials';
import Resume from './pages/Resume';
import Freelance from './pages/Freelance';
import ProjectsIndex from './pages/ProjectsIndex';
import ProjectDetail from './pages/ProjectDetail';
import BrandingIntro from './components/BrandingIntro';
import { Project } from './types';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Check if intro has played this session
    const hasPlayedIntro = sessionStorage.getItem('harini_intro_played');
    if (!hasPlayedIntro) {
      setShowIntro(true);
    }

    const handlePopState = () => {
      setCurrentPath(window.location.hash.replace('#', '') || '/');
    };
    window.addEventListener('popstate', handlePopState);
    handlePopState();
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('harini_intro_played', 'true');
  };

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <Home onProjectSelect={setSelectedProject} onNavigate={navigate} />;
      case '/projects':
        return <ProjectsIndex onProjectSelect={setSelectedProject} />;
      case '/journey':
        return <Journey />;
      case '/credentials':
        return <Credentials />;
      case '/resume':
        return <Resume />;
      case '/freelance':
        return <Freelance />;
      default:
        return <Home onProjectSelect={setSelectedProject} onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 selection:bg-red-600 selection:text-white">
      <AnimatePresence>
        {showIntro && (
          <BrandingIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <Navbar currentPath={currentPath} onNavigate={navigate} />

      <main className="relative">
        <AnimatePresence mode="wait">
          {!showIntro && renderPage()}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <footer className="bg-neutral-950 pt-32 pb-16 border-t border-neutral-900/50 no-print">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-5xl font-black text-neutral-800 tracking-tighter uppercase italic opacity-50">Harini Sai</h2>

          <div className="flex flex-wrap justify-center gap-10 text-neutral-500 font-black uppercase italic text-sm tracking-[0.2em]">
            <a href="https://www.instagram.com/_harinisai_?igsh=MXR0bWEzZWxrbnY4eA==" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">Instagram</a>
            <a href="https://github.com/Harinisai1111" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/harini-sai-848b3a33a/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">LinkedIn</a>
          </div>

          <div className="space-y-2">
            <p className="text-neutral-700 text-[10px] font-bold uppercase tracking-[0.3em] max-w-xl mx-auto leading-relaxed">
              Designed for professional evaluators. Automated synchronization with GitHub Core. Engineered with React and motion primitives.
            </p>
            <p className="text-neutral-800 text-[10px] font-bold">© 2024 HARINI SAI PRODUCTIONS. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

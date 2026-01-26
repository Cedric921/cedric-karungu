import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar, Hero, AboutMe, Skills, Portfolio, Experience, Contact, Footer, AnimatedBackground, CursorGlow } from './components';
import { Icons } from './constants';


const App: React.FC = () => {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  const [showScrollUp, setShowScrollUp] = useState<boolean>(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollUp(true);
      } else {
        setShowScrollUp(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300 selection:bg-accent-500/30 selection:text-accent-900 dark:selection:text-white overflow-x-hidden">
      <AnimatedBackground />
      <CursorGlow />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <AboutMe />
        <Skills />
        <Portfolio />
        <Experience />
        <Contact />
      </main>
      <Footer />

      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-accent-600 text-white shadow-lg hover:bg-accent-500 transition-colors duration-300 z-40`}
        animate={{
          y: showScrollUp ? 0 : 100,
          opacity: showScrollUp ? 1 : 0,
          pointerEvents: showScrollUp ? 'auto' : 'none',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        aria-label="Scroll to top"
      >
        <Icons.ArrowUp />
      </motion.button>
    </div>
  );
};

export default App;

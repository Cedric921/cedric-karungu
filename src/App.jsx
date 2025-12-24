import React, { useState, useEffect } from 'react';
import { Navbar, Hero, AboutMe, Skills, Portfolio, Experience, Contact, Footer } from './components';
import { Icons } from './constants';


const App = () => {
  /**theme state manager dark/light mode***/
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  /**scroll-up button visibility state***/
  const [showScrollUp, setShowScrollUp] = useState(false);

  /***Theme Effect: Applies theme class to HTML element and saves preference***/
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  /***Scroll Effect: Monitors scroll position to show/hide scroll-up button***/
  useEffect(() => {
    const handleScroll = () => {
      // Show button if scrolled more than 100px from top
      if (window.scrollY > 100) {
        setShowScrollUp(true);
      } else {
        setShowScrollUp(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /***Toggle Theme Handler***/
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  /***Scroll to Top Handler***/
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300 selection:bg-accent-500/30 selection:text-accent-900 dark:selection:text-white">
      {/***Navigation bar component - passed theme state and toggle handler***/}
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

      {/***Scroll Up Button - Fixed position at bottom-right***/}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-accent-600 text-white shadow-lg hover:bg-accent-500 transition-all duration-300 z-40 transform ${
          showScrollUp ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <Icons.ArrowUp />
      </button>
    </div>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';

/***Navbar Component***/
const Navbar = ({ theme, toggleTheme }) => {
 
  //mobile menu open state
  const [isOpen, setIsOpen] = useState(false);

 //scrolled state for background effect
  const [scrolled, setScrolled] = useState(false);

 //effect to monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 //handle link click for smooth scrolling and closing mobile menu
  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  //Navigation Links Array
  const navLinks = [
    { name: 'Home', href: '#about' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#portfolio' },
    { name: 'Experience', href: '#experience' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 dark:bg-[#050505]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/5 py-4' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/**CK Branding**/}
        <a 
          href="#" 
          onClick={(e) => handleLinkClick(e, '#about')} 
          className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
        >
          CK<span className="text-accent-500">.</span>
        </a>

        {/***Desktop Navigation Menu - Hidden on mobile (md: breakpoint)***/}
        <div className="hidden md:flex items-center space-x-8">
          {/**Navigation Links**/}
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-accent-600 dark:hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          {/***Theme Toggle Button***/}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-300"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
          </button>

          {/**Contact Button**/}
          <a 
            href="#contact" 
            onClick={(e) => handleLinkClick(e, '#contact')}
            className="px-5 py-2.5 rounded-full bg-accent-600 hover:bg-accent-500 text-white text-sm font-semibold transition-all shadow-lg shadow-accent-600/20"
          >
            Get In Touch
          </a>
        </div>

        {/**Mobile Menu Button and Theme Switcher - Visible only on mobile**/}
        <div className="md:hidden flex items-center gap-4">
          {/***Mobile Theme Toggle***/}
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
          </button>
          
          {/***Mobile Menu Toggle Button***/}
          <button 
            className="text-gray-900 dark:text-white hover:text-accent-500 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <Icons.X /> : <Icons.Menu />}
          </button>
        </div>
      </div>

      {/***Mobile Navigation Menu - Only shown when isOpen is true***/}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-white/5">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            {/**Mobile Contact Button**/}
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, '#contact')}
              className="block mt-4 w-full px-5 py-2.5 rounded-full bg-accent-600 hover:bg-accent-500 text-white text-sm font-semibold transition-all text-center"
            >
              Get In Touch
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
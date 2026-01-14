
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '../constants';
import LanguageSwitcher from './LanguageSwitcher';

type NavbarProps = {
  theme: string;
  toggleTheme: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.skills'), href: '#skills' },
    { name: t('nav.projects'), href: '#portfolio' },
    { name: t('nav.experience'), href: '#experience' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'mt-4 px-4'
        : 'mt-0 px-0'
    }`}>
      <div className={`transition-all duration-300 flex justify-between items-center mx-auto ${
        scrolled
          ? 'max-w-[calc(100%-64px)] px-6 py-4 rounded-3xl bg-white/50 dark:bg-[#050505]/60 backdrop-blur-md border border-gray-200/50 dark:border-white/5 shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'max-w-7xl px-6 py-6'
      }`}>
        <a href="#" onClick={(e) => handleLinkClick(e, '#about')} className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white hover:text-accent-600 dark:hover:text-accent-400 transition-colors">
          CK<span className="text-accent-500">.</span>
        </a>

        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="
                relative text-sm font-medium text-gray-600 dark:text-gray-300
                transition-colors duration-300
                hover:text-accent-600 dark:hover:text-white
                after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0
                after:bg-accent-600 dark:after:bg-white
                after:transition-all after:duration-300
                hover:after:w-full
              "
            >
              {link.name}
            </a>
          ))}

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-300" aria-label="Toggle theme">
              {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
            </button>

            <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')} className="px-5 py-2.5 rounded-full bg-accent-600 hover:bg-accent-500 text-white text-sm font-semibold transition-all shadow-lg shadow-accent-600/20">
              {t('nav.getInTouch')}
            </a>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-400 transition-colors" aria-label="Toggle theme">
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
          </button>

          <button className="text-gray-900 dark:text-white hover:text-accent-500 transition-colors" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <Icons.X /> : <Icons.Menu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className={`md:hidden bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 transition-all duration-300 ${
          scrolled ? 'rounded-3xl mt-2 mx-4' : 'border-b'
        }`}>
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-400 transition-colors">
                {link.name}
              </a>
            ))}

            <div className="my-3 border-t border-gray-200 dark:border-white/10 pt-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Language</p>
              <LanguageSwitcher />
            </div>

            <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')} className="block mt-4 w-full px-5 py-2.5 rounded-full bg-accent-600 hover:bg-accent-500 text-white text-sm font-semibold transition-all text-center">
              {t('nav.getInTouch')}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

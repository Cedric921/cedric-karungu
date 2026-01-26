
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const navVariants = {
    scrolled: {
      marginTop: 16,
      paddingLeft: 16,
      paddingRight: 16,
    },
    notScrolled: {
      marginTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
  };

  const navContainerVariants = {
    scrolled: {
      maxWidth: 'calc(100% - 64px)',
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 16,
      paddingBottom: 16,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    notScrolled: {
      maxWidth: '100%',
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 24,
      paddingBottom: 24,
      borderRadius: 0,
      backgroundColor: 'transparent',
    },
  };

  const linkVariants = {
    rest: { y: 0 },
    hover: { y: -2 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      animate={scrolled ? 'scrolled' : 'notScrolled'}
      variants={navVariants}
      initial="notScrolled"
    >
      <motion.div
        className="flex justify-between items-center mx-auto transition-all duration-300"
        animate={scrolled ? 'scrolled' : 'notScrolled'}
        variants={navContainerVariants}
        initial="notScrolled"
      >
        {/* Logo */}
        <motion.a
          href="#"
          onClick={(e) => handleLinkClick(e, '#about')}
          className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white"
          whileHover={{ scale: 1.05, color: 'rgb(124, 58, 237)' }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          CK<span className="text-accent-500">.</span>
        </motion.a>

        {/* Desktop Navigation */}
        <motion.div
          className="hidden md:flex items-center space-x-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {navLinks.map((link, index) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="relative text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300"
              variants={linkVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              custom={index}
            >
              {link.name}
              <motion.span
                className="absolute -bottom-1 left-0 h-[2px] bg-accent-600 dark:bg-white"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <LanguageSwitcher />

            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(124, 58, 237, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
            </motion.button>

            <motion.a
              href="#contact"
              onClick={(e) => handleLinkClick(e, '#contact')}
              className="px-5 py-2.5 rounded-full bg-accent-600 text-white text-sm font-semibold shadow-lg shadow-accent-600/20"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 20px 30px rgba(124, 58, 237, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {t('nav.getInTouch')}
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Mobile Navigation Toggle */}
        <motion.div
          className="md:hidden flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
          </motion.button>

          <motion.button
            className="text-gray-900 dark:text-white"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icons.X />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icons.Menu />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`md:hidden bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 transition-all duration-300 ${
              scrolled ? 'rounded-3xl mt-2 mx-4' : 'border-b'
            }`}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  variants={menuItemVariants}
                  whileHover={{ x: 4, color: 'rgb(124, 58, 237)' }}
                  transition={{ duration: 0.2 }}
                >
                  {link.name}
                </motion.a>
              ))}

              <motion.div className="my-3 border-t border-gray-200 dark:border-white/10 pt-3" variants={menuItemVariants}>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Language</p>
                <LanguageSwitcher />
              </motion.div>

              <motion.a
                href="#contact"
                onClick={(e) => handleLinkClick(e, '#contact')}
                className="block mt-4 w-full px-5 py-2.5 rounded-full bg-accent-600 text-white text-sm font-semibold transition-all text-center"
                variants={menuItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {t('nav.getInTouch')}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '../constants';
import { useScrollAnimation } from '../hooks';

const resumePdf = '/document/Ced CV.pdf';

const Hero: React.FC = () => {
  const t = useTranslations();
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [currentTitle, setCurrentTitle] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const titles = [
    t('hero.titles.0'),
    t('hero.titles.1'),
    t('hero.titles.2'),
  ];

  useEffect(() => {
    const handleTyping = () => {
      const current = titles[titleIndex];
      const updatedTitle = isDeleting ? current.substring(0, currentTitle.length - 1) : current.substring(0, currentTitle.length + 1);
      setCurrentTitle(updatedTitle);
      if (isDeleting) setTypingSpeed(50);
      if (!isDeleting && updatedTitle === current) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && updatedTitle === '') {
        setIsDeleting(false);
        setTitleIndex((prev) => (prev + 1) % titles.length);
        setTypingSpeed(100);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentTitle, isDeleting, titleIndex, typingSpeed, titles]);

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center dark:bg-[#100B17] pt-20 overflow-hidden scroll-mt-28" ref={ref}>
      <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.05] dark:opacity-[0.1] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-[#050505] dark:via-transparent dark:to-[#050505] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-accent-600/20 dark:bg-accent-600/30 rounded-full blur-[80px] md:blur-[120px] -z-10" />

      <div className="mt-[40px] relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className={`mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block py-1 px-3 rounded-full bg-accent-50/50 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-700/50 text-accent-600 dark:text-accent-300 text-sm font-semibold tracking-wide">{t('hero.available')}</span>
        </div>

        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight mb-2 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400">{t('hero.name')}</span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-600 via-accent-500 to-accent-400">{t('hero.nickname')}</span>
        </h1>

        <h2 className={`text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-8 mt-10 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span>{currentTitle}</span>
          <span className="animate-pulse">|</span>
        </h2>

        <p className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>{t('hero.description')}</p>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a href={resumePdf} download="Ced-CV.pdf" className="w-full sm:w-auto px-8 py-4 rounded-full bg-accent-600 hover:bg-accent-500 text-white font-bold transition-all shadow-lg shadow-accent-600/25 flex items-center justify-center gap-2">{t('hero.downloadResume')} <Icons.Download /></a>
          <a href="#portfolio" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold transition-all flex items-center justify-center gap-2">{t('hero.viewWork')} <Icons.Layout /></a>
        </div>

        <div className={`flex items-center justify-center gap-8 text-gray-500 dark:text-gray-400 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a href="https://github.com/Cedric921" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-500 hover:text-accent-600 dark:hover:text-accent-400 transition-all duration-200 hover:scale-110 hover:-rotate-6" aria-label="GitHub Profile"><Icons.Github /></a>
           <a href="https://linkedin.com/in/cedric-karungu" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-500 hover:text-accent-600 dark:hover:text-accent-400 transition-all duration-200 hover:scale-110 hover:rotate-6" aria-label="LinkedIn Profile"><Icons.Linkedin /></a>
           <a href="mailto:ckarungu921@gmail.com" className="text-gray-500 dark:text-gray-500 hover:text-accent-600 dark:hover:text-accent-400 transition-all duration-200 hover:scale-110 hover:-translate-y-1" aria-label="Email Contact"><Icons.Mail /></a>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const socialIconVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.2, rotate: 12 },
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden scroll-mt-28" ref={ref}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.05] dark:opacity-[0.1] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-[#050505] dark:via-transparent dark:to-[#050505] pointer-events-none" />

      {/* Animated gradient circles */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-accent-600/20 dark:bg-accent-600/30 rounded-full blur-[80px] md:blur-[120px] -z-10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          
        }}
      />

      <motion.div
        className="mt-[40px] relative z-10 max-w-5xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.span
            className="inline-block py-1 px-3 rounded-full bg-accent-50/50 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-700/50 text-accent-600 dark:text-accent-300 text-sm font-semibold tracking-wide"
            whileHover={{ scale: 1.05, borderColor: 'rgb(124, 58, 237)' }}
            transition={{ duration: 0.2 }}
          >
            {t('hero.available')}
          </motion.span>
        </motion.div>

        {/* Main heading */}
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400">
            {t('hero.name')}
          </span>
          <br />
          <motion.span
            className="bg-clip-text text-transparent bg-gradient-to-r from-accent-600 via-accent-500 to-accent-400"
            animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {t('hero.nickname')}
          </motion.span>
        </motion.h1>

        {/* Typing animation */}
        <motion.h2
          variants={itemVariants}
          className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-8 mt-10"
        >
          <span>{currentTitle}</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="ml-1"
          >
            |
          </motion.span>
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t('hero.description')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.a
            href={resumePdf}
            download="Ced-CV.pdf"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-accent-600 text-white font-bold shadow-lg shadow-accent-600/25 flex items-center justify-center gap-2"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 20px 30px rgba(124, 58, 237, 0.4)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {t('hero.downloadResume')} <Icons.Download />
          </motion.a>
          <motion.a
            href="#portfolio"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold flex items-center justify-center gap-2"
            whileHover={{
              scale: 1.05,
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              borderColor: 'rgb(124, 58, 237)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {t('hero.viewWork')} <Icons.Layout />
          </motion.a>
        </motion.div>

        {/* Social icons */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-8 text-gray-500 dark:text-gray-400"
        >
          <motion.a
            href="https://github.com/Cedric921"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 dark:text-gray-500"
            whileHover={{ color: 'rgb(124, 58, 237)', scale: 1.2, rotate: -12 }}
            transition={{ duration: 0.2 }}
            aria-label="GitHub Profile"
          >
            <Icons.Github />
          </motion.a>
          <motion.a
            href="https://linkedin.com/in/cedric-karungu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 dark:text-gray-500"
            whileHover={{ color: 'rgb(124, 58, 237)', scale: 1.2, rotate: 12 }}
            transition={{ duration: 0.2 }}
            aria-label="LinkedIn Profile"
          >
            <Icons.Linkedin />
          </motion.a>
          <motion.a
            href="mailto:ckarungu921@gmail.com"
            className="text-gray-500 dark:text-gray-500"
            whileHover={{ color: 'rgb(124, 58, 237)', scale: 1.2, y: -4 }}
            transition={{ duration: 0.2 }}
            aria-label="Email Contact"
          >
            <Icons.Mail />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
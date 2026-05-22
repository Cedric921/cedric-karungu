import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Icons } from "../constants";
import { useScrollAnimation, useSiteContent } from "../hooks";

const resumePdf = "/document/Ced CV.pdf";

const Hero: React.FC = () => {
  const t = useTranslations();
  const content = useSiteContent();
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [currentTitle, setCurrentTitle] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const titles = [
    content.get("hero.titles.0") ?? t("hero.titles.0"),
    content.get("hero.titles.1") ?? t("hero.titles.1"),
    content.get("hero.titles.2") ?? t("hero.titles.2"),
  ];

  useEffect(() => {
    const handleTyping = () => {
      const current = titles[titleIndex];
      const updatedTitle = isDeleting
        ? current.substring(0, currentTitle.length - 1)
        : current.substring(0, currentTitle.length + 1);
      setCurrentTitle(updatedTitle);
      if (isDeleting) setTypingSpeed(50);
      if (!isDeleting && updatedTitle === current) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && updatedTitle === "") {
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

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden scroll-mt-28 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-[#050505] dark:via-slate-900/40 dark:to-[#050505]"
      ref={ref}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.02] dark:opacity-[0.08] pointer-events-none" />

      {/* Animated gradient circles */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-gradient-to-r from-accent-600/15 to-blue-600/15 dark:from-accent-600/25 dark:to-blue-600/25 rounded-full blur-[80px] md:blur-[120px] -z-10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="mt-[40px] relative z-10 max-w-5xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Editorial index + availability pill */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex flex-col items-center gap-4"
        >
          <div className="eyebrow">
            <span className="eyebrow-index">00</span>
            <span aria-hidden="true" className="eyebrow-rule" />
            <span>Introduction</span>
          </div>
          <motion.span
            className="glass inline-flex items-center gap-2 py-1.5 pl-2.5 pr-3.5 rounded-full font-mono text-xs uppercase tracking-[0.18em] text-gray-700 dark:text-gray-200"
            whileHover={{ y: -1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {content.get("hero.available") ?? t("hero.available")}
          </motion.span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight mb-2"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400">
            {content.get("hero.name") ?? t("hero.name")}
          </span>
          <br />
          <motion.span
            className="bg-clip-text text-transparent bg-gradient-to-r from-accent-600 via-accent-500 to-accent-400"
            animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {content.get("hero.nickname") ?? t("hero.nickname")}
          </motion.span>
        </motion.h1>

        {/* Typing animation */}
        <motion.h2
          variants={itemVariants}
          className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-500 dark:from-accent-400 dark:to-accent-300 mb-8 mt-10 h-8 md:h-10"
        >
          <span>{currentTitle}</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="ml-1 text-accent-600 dark:text-accent-400"
          >
            |
          </motion.span>
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          {content.get("hero.description") ?? t("hero.description")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.a
            href={resumePdf}
            download="Ced-CV.pdf"
            className="group relative w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-accent-600 to-accent-500 text-white font-bold shadow-lg shadow-accent-600/30 flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-accent-600/50 transition-all duration-300 ring-accent-focus overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <span className="relative">
              {content.get("hero.downloadResume") ?? t("hero.downloadResume")}
            </span>
            <motion.span
              className="relative"
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Icons.Download />
            </motion.span>
          </motion.a>
          <motion.a
            href="#portfolio"
            className="group w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-50 dark:from-white/10 dark:to-white/5 border-2 border-gray-400 dark:border-accent-600/40 text-gray-900 dark:text-white font-bold flex items-center justify-center gap-2 hover:border-accent-600 dark:hover:border-accent-500 transition-all duration-300 ring-accent-focus"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(124, 58, 237, 0.15)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {content.get("hero.viewWork") ?? t("hero.viewWork")}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              <Icons.Layout />
            </span>
          </motion.a>
        </motion.div>

        {/* Social row — editorial mono labels */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-6"
        >
          <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">
            Find me on
          </span>
          <div className="flex items-center gap-3">
            <motion.a
              href="https://github.com/Cedric921"
              target="_blank"
              rel="noopener noreferrer"
              className="glass glass-hover p-3 rounded-full text-gray-700 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-400 ring-accent-focus"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.2 }}
              aria-label="GitHub Profile"
            >
              <Icons.Github />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/cedric-karungu"
              target="_blank"
              rel="noopener noreferrer"
              className="glass glass-hover p-3 rounded-full text-gray-700 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-400 ring-accent-focus"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.2 }}
              aria-label="LinkedIn Profile"
            >
              <Icons.Linkedin />
            </motion.a>
            <motion.a
              href="mailto:ckarungu921@gmail.com"
              className="glass glass-hover p-3 rounded-full text-gray-700 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-400 ring-accent-focus"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.2 }}
              aria-label="Email Contact"
            >
              <Icons.Mail />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

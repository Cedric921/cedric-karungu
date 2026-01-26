import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { SKILLS } from '../constants';
import { useScrollAnimation } from '../hooks';

const Skills: React.FC = () => {
  const t = useTranslations();
  const [activeFilter, setActiveFilter] = useState(t('skills.frontEnd'));
  const { ref, isVisible } = useScrollAnimation(0.1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -8,
      scale: 1.05,
      boxShadow: '0 20px 40px rgba(124, 58, 237, 0.15)',
      transition: { duration: 0.3 },
    },
  };

  return (
    <section id="skills" className="py-24 bg-white dark:bg-black scroll-mt-28 transition-colors duration-300 relative overflow-hidden" ref={ref}>
      {/* Background animation */}
      <motion.div
        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
        }}
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300"
            variants={itemVariants}
          >
            {t('skills.title')}
          </motion.h2>
          <motion.p
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg"
            variants={itemVariants}
          >
            {t('skills.description')}
          </motion.p>
        </motion.div>

        {/* Filter buttons */}
        <motion.div
          className="flex justify-center mb-12"
          variants={itemVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <div className="flex gap-2 bg-white dark:bg-black p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-sm">
            {[t('skills.frontEnd'), t('skills.backEnd'), t('skills.ai')].map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-accent-600 text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={activeFilter === filter ? { scale: 1.05 } : { scale: 1 }}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {SKILLS.filter(skill => skill.category === activeFilter).map((skill, idx) => (
            <motion.div
              key={idx}
              className="bg-white dark:bg-[#100B17] border border-gray-200 dark:border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center gap-6 text-center cursor-default shadow-lg dark:shadow-none"
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              custom={cardVariants}
            >
              {/* Card hover effect with glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent-600/0 via-accent-600/5 to-accent-600/0 opacity-0 group-hover:opacity-100"
                whileHover={{ opacity: 0.1 }}
              />

              {/* Image with animation */}
              <motion.div
                className="text-5xl mb-4 relative z-10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <img src={skill.logoUrl} alt={skill.name} className="w-12 h-12 dark:hidden" />
                <img src={skill.logoUrl} alt={skill.name} className="w-12 h-12 hidden dark:block" style={{ filter: 'brightness(0) invert(1)' }} />
              </motion.div>

              {/* Name */}
              <motion.h3
                className="font-bold text-gray-900 dark:text-white text-xl mb-3 relative z-10"
                whileHover={{ color: 'rgb(124, 58, 237)' }}
                transition={{ duration: 0.2 }}
              >
                {skill.name}
              </motion.h3>

              {/* Level indicator */}
              <motion.div
                className="flex items-center gap-2 relative z-10"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className={`w-3 h-3 rounded-full ${
                    skill.level === 'Expert'
                      ? 'bg-green-500'
                      : skill.level === 'Advanced'
                      ? 'bg-blue-500'
                      : 'bg-yellow-500'
                  }`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-gray-600 dark:text-gray-400 text-sm">{skill.level}</span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
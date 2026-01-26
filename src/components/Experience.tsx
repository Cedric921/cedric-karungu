import React from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCES, Icons } from '../constants';
import { useScrollAnimation } from '../hooks';

const Experience: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

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
      transition: {
        duration: 0.6,
        
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
    hover: {
      y: -8,
      boxShadow: '0 20px 40px rgba(124, 58, 237, 0.15)',
      transition: { duration: 0.3 },
    },
  };

  return (
    <section id="experience" className="py-24 bg-white dark:bg-[#050505] scroll-mt-28 transition-colors duration-300 relative overflow-hidden" ref={ref}>
      {/* Animated background elements */}
      <motion.div
        className="absolute -top-20 -right-32 w-80 h-80 rounded-full blur-3xl opacity-5"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
        }}
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white bg-clip-text bg-gradient-to-r from-accent-600 to-accent-400 dark:from-accent-400 dark:to-accent-300"
            variants={itemVariants}
          >
            Professional Experience
          </motion.h2>
          <motion.p
            className="text-gray-600 dark:text-gray-400 text-lg"
            variants={itemVariants}
          >
            My journey through the tech industry.
          </motion.p>
        </motion.div>

        <motion.div
          className="relative space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-600 via-gray-200 dark:via-white/10 to-transparent md:-translate-x-1/2" />

          {EXPERIENCES.map((exp, index) => (
            <motion.div
              key={exp.id}
              className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              variants={itemVariants}
            >
              <motion.div
                className="absolute left-4 md:left-1/2 w-4 h-4 bg-white dark:bg-[#050505] border-2 border-accent-500 rounded-full translate-y-1.5 md:-translate-x-1/2 z-10 shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <motion.div
                className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 text-left md:text-right'}`}
                variants={itemVariants}
              >
                <motion.div
                  className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-white/5 group shadow-sm dark:shadow-none cursor-pointer"
                  variants={cardVariants}
                  whileHover="hover"
                  initial="hidden"
                  animate="visible"
                >
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent-600/0 via-accent-600/10 to-accent-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  <div className={`flex flex-col gap-1 mb-4 relative z-10 ${index % 2 === 0 ? 'items-start' : 'items-start md:items-end'}`}>
                    <motion.span
                      className="px-3 py-1 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 text-xs font-semibold border border-accent-200 dark:border-accent-500/20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {exp.period}
                    </motion.span>
                    <motion.h3
                      className="text-xl font-bold text-gray-900 dark:text-white mt-2 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors relative z-10"
                      whileHover={{ x: index % 2 === 0 ? 4 : -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {exp.role}
                    </motion.h3>
                    <motion.p
                      className="text-gray-600 dark:text-gray-400 font-medium relative z-10"
                      whileHover={{ color: 'rgb(124, 58, 237)' }}
                      transition={{ duration: 0.2 }}
                    >
                      {exp.company}
                    </motion.p>
                    <motion.div
                      className="flex items-center gap-1 text-xs text-gray-500 relative z-10"
                      whileHover={{ x: index % 2 === 0 ? 4 : -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {exp.location}
                    </motion.div>
                  </div>
                  <motion.p
                    className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed relative z-10"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, color: 'rgb(229, 231, 235)' }}
                    transition={{ duration: 0.2 }}
                  >
                    {exp.description}
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
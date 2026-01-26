import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { PROJECTS, Icons } from '../constants';
import { useScrollAnimation } from '../hooks';

const Portfolio: React.FC = () => {
  const t = useTranslations();
  const [activeFilter, setActiveFilter] = useState(t('portfolio.filterAll'));
  const { ref, isVisible } = useScrollAnimation(0.1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const projectVariants = {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -12,
      scale: 1.02,
      boxShadow: '0 20px 40px rgba(124, 58, 237, 0.2)',
      transition: { duration: 0.3 },
    },
  };

  return (
    <section id="portfolio" className="py-24 scroll-mt-28 bg-gray-50 dark:bg-[#100B17] transition-colors duration-300 relative overflow-hidden" ref={ref}>
      {/* Background animations */}
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-5"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
        }}
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-5"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
        }}
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants}>
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300"
              variants={itemVariants}
            >
              {t('portfolio.title')}
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-400 max-w-xl text-lg"
              variants={itemVariants}
            >
              {t('portfolio.description')}
            </motion.p>
          </motion.div>

          {/* Filter buttons */}
          <motion.div
            className="flex gap-2 bg-white dark:bg-black p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-sm"
            variants={itemVariants}
          >
            {[t('portfolio.filterAll'), t('portfolio.filterWeb'), t('portfolio.filterApp')].map((filter) => (
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
          </motion.div>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {PROJECTS.filter(project => activeFilter === t('portfolio.filterAll') || project.category === activeFilter).map((project, idx) => (
            <motion.div
              key={idx}
              className="group relative bg-white dark:bg-black rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-md dark:shadow-none"
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              custom={projectVariants}
            >
              {/* Image container */}
              <motion.div className="relative h-64 overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-black/0 z-10"
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                  transition={{ duration: 0.3 }}
                />
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.7 }}
                />
              </motion.div>

              {/* Content */}
              <div className="p-8">
                <motion.div className="flex justify-between items-start mb-4" variants={itemVariants}>
                  <motion.div>
                    <motion.span
                      className="text-accent-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider mb-2 block"
                      whileHover={{ letterSpacing: '0.15em' }}
                      transition={{ duration: 0.2 }}
                    >
                      {project.category}
                    </motion.span>
                    <motion.h3
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                      whileHover={{ color: 'rgb(124, 58, 237)' }}
                      transition={{ duration: 0.2 }}
                    >
                      {project.title}
                    </motion.h3>
                  </motion.div>

                  {/* Action buttons */}
                  <motion.div className="flex items-center gap-3" variants={containerVariants}>
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 dark:bg-white/5 rounded-full text-gray-500 dark:text-gray-400 shadow-sm"
                      whileHover={{
                        backgroundColor: 'rgb(124, 58, 237)',
                        color: 'white',
                        y: -4,
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      aria-label="Open project website"
                    >
                      <Icons.ExternalLink />
                    </motion.a>
                    <motion.a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 dark:bg-white/5 rounded-full text-gray-500 dark:text-gray-400 shadow-sm"
                      whileHover={{
                        backgroundColor: 'rgb(124, 58, 237)',
                        color: 'white',
                        y: -4,
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      aria-label="Open project GitHub"
                    >
                      <Icons.Github />
                    </motion.a>
                  </motion.div>
                </motion.div>

                {/* Description */}
                <motion.p
                  className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed"
                  whileHover={{ color: 'rgb(209, 213, 219)' }}
                  transition={{ duration: 0.2 }}
                >
                  {project.description}
                </motion.p>

                {/* More details link */}
                <motion.div className="mt-4" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 text-sm font-medium cursor-pointer transition-colors">
                    more details →
                  </a>
                </motion.div>

                {/* Tags */}
                <motion.div
                  className="flex flex-wrap gap-2 mt-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {project.tags.map(tag => (
                    <motion.span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5"
                      whileHover={{
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                        borderColor: 'rgb(124, 58, 237)',
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* See more button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.a
            href="https://github.com/Cedric921"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent-600 text-white rounded-full font-medium cursor-pointer shadow-md"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 20px 30px rgba(124, 58, 237, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            See more projects
            <Icons.ExternalLink />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
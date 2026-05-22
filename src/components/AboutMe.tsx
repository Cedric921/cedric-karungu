import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useScrollAnimation, useSiteContent } from "../hooks";

const About: React.FC = () => {
  const t = useTranslations();
  const content = useSiteContent();
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [isImageHovered, setIsImageHovered] = useState<boolean>(false);
  const tr = (key: string) => content.get(key) ?? t(key);

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 as const },
    },
  };

  const badgeVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, x: 4 },
  };

  return (
    <section
      id="about"
      className="mt-[40px] py-24 scroll-mt-28 bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-[#0a0a0a] dark:via-slate-900/50 dark:to-[#100B17] transition-colors duration-300 min-h-screen relative overflow-hidden"
      ref={ref}
    >
      {/* Background animations */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-5"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
        }}
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-5"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
        }}
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Mobile title */}
        <motion.div
          className="text-center mb-16 lg:hidden"
          variants={itemVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {tr("about.title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-400 dark:from-accent-500 dark:to-white">
              {tr("about.titleHighlight")}
            </span>
          </h2>
        </motion.div>

        <motion.div
          className="flex flex-col lg:flex-row items-center gap-16"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Image */}
          <motion.div
            className="lg:w-2/5 w-full flex justify-center"
            variants={itemVariants}
          >
            <motion.div
              className="relative w-80 h-96 lg:w-[450px] lg:h-[550px] rounded-2xl overflow-hidden shadow-2xl"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src="/images/VB/cedric.jpeg"
                alt="Cedric Karungu"
                className="w-full h-full object-cover"
                animate={{ scale: isImageHovered ? 1.1 : 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex flex-col items-end justify-end p-8"
                animate={{ opacity: isImageHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.p
                  className="text-white text-3xl font-bold pb-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={
                    isImageHovered
                      ? { y: 0, opacity: 1 }
                      : { y: 10, opacity: 0 }
                  }
                  transition={{ duration: 0.3 }}
                >
                  {tr("about.name")}
                </motion.p>
                <motion.p
                  className="text-lg font-medium"
                  initial={{ y: 10, opacity: 0 }}
                  animate={
                    isImageHovered
                      ? { y: 0, opacity: 1 }
                      : { y: 10, opacity: 0 }
                  }
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-400 dark:from-accent-500 dark:to-white">
                    {tr("about.role")}
                  </span>
                  <span className="text-white mx-2">
                    {tr("about.separator")}
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-400 dark:from-accent-500 dark:to-white">
                    {tr("about.projectManager")}
                  </span>
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="lg:w-3/5 w-full space-y-6"
            variants={containerVariants}
          >
            {/* Desktop title */}
            <motion.div className="hidden lg:block" variants={itemVariants}>
              <motion.h2
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300"
                variants={itemVariants}
              >
                {tr("about.title")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-400 dark:from-accent-500 dark:to-white">
                  {tr("about.titleHighlight")}
                </span>
              </motion.h2>
            </motion.div>

            {/* Main title */}
            <motion.div variants={itemVariants}>
              <motion.h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-accent-600 to-gray-900 dark:from-white dark:via-accent-400 dark:to-gray-300 mb-4">
                {tr("about.mainTitle")}
              </motion.h3>

              {/* Badges */}
              <motion.div
                className="flex flex-wrap gap-3 mb-6"
                variants={containerVariants}
              >
                {[
                  tr("about.experience"),
                  tr("about.freelance"),
                  tr("about.location"),
                ].map((badge, idx) => (
                  <motion.span
                    key={idx}
                    className="px-4 py-2 bg-gradient-to-r from-accent-50 to-white dark:from-accent-900/20 dark:to-white/5 text-gray-700 dark:text-gray-200 rounded-full text-sm border-2 border-accent-200 dark:border-accent-600/30 font-medium hover:border-accent-500 dark:hover:border-accent-500 transition-all duration-300"
                    whileHover={{
                      borderColor: "rgb(124, 58, 237)",
                      boxShadow: "0 4px 12px rgba(124, 58, 237, 0.1)",
                      x: 4,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {badge}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Bio text */}
            <motion.div className="space-y-4" variants={containerVariants}>
              {[tr("about.bio1"), tr("about.bio2"), tr("about.bio3")].map(
                (bio, idx) => (
                  <motion.p
                    key={idx}
                    className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg"
                    variants={itemVariants}
                    whileHover={{ color: "rgb(209, 213, 219)" }}
                    transition={{ duration: 0.2 }}
                  >
                    {bio}
                  </motion.p>
                ),
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

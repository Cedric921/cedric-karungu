import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useScrollAnimation, useSiteContent } from "../hooks";
import SectionHeader from "./SectionHeader";

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
        {/* Mobile section header */}
        <div className="lg:hidden">
          <SectionHeader
            index={2}
            eyebrow={t("nav.about")}
            title={
              <>
                {tr("about.title")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-400 dark:from-accent-500 dark:to-white">
                  {tr("about.titleHighlight")}
                </span>
              </>
            }
            visible={isVisible}
          />
        </div>

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
            {/* Desktop section header */}
            <motion.div
              className="hidden lg:block mb-2"
              variants={itemVariants}
            >
              <div className="eyebrow mb-4">
                <span className="eyebrow-index">02</span>
                <span aria-hidden="true" className="eyebrow-rule" />
                <span>{t("nav.about")}</span>
              </div>
              <motion.h2
                className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300"
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
              <motion.h3 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-accent-600 to-gray-900 dark:from-white dark:via-accent-400 dark:to-gray-300 mb-5">
                {tr("about.mainTitle")}
              </motion.h3>

              {/* Editorial meta strip */}
              <motion.div
                className="glass flex flex-wrap items-stretch divide-x divide-gray-200/70 dark:divide-white/10 rounded-2xl mb-6 overflow-hidden"
                variants={containerVariants}
              >
                {[
                  { label: "Experience", value: tr("about.experience") },
                  { label: "Status", value: tr("about.freelance") },
                  { label: "Based in", value: tr("about.location") },
                ].map((m, idx) => (
                  <motion.div
                    key={idx}
                    className="flex-1 min-w-[8rem] px-4 py-3"
                    variants={itemVariants}
                    whileHover={{ y: -1 }}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-1">
                      {String(idx + 1).padStart(2, "0")} · {m.label}
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {m.value}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Bio text with editorial drop-rule */}
            <motion.div
              className="relative pl-5 border-l border-gray-200 dark:border-white/10 space-y-4"
              variants={containerVariants}
            >
              <span
                aria-hidden="true"
                className="absolute -left-px top-2 h-12 w-px bg-gradient-to-b from-accent-500 to-transparent"
              />
              {[tr("about.bio1"), tr("about.bio2"), tr("about.bio3")].map(
                (bio, idx) => (
                  <motion.p
                    key={idx}
                    className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg"
                    variants={itemVariants}
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

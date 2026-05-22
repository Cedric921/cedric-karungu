import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { EXPERIENCES } from "../constants";
import { useScrollAnimation, usePublicData } from "../hooks";
import { experienceToView, type ExperienceItem } from "../lib/public-data";
import type { Locale } from "../lib/models/shared";
import SectionHeader from "./SectionHeader";

const Experience: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { ref, isVisible } = useScrollAnimation(0.1);

  const { data: experiences } = usePublicData<ExperienceItem[]>(
    "/api/public/experiences",
    EXPERIENCES as unknown as ExperienceItem[],
  );

  const items = useMemo(
    () => experiences.map((e) => experienceToView(e, locale)),
    [experiences, locale],
  );

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

  return (
    <section
      id="experience"
      className="py-24 bg-white dark:bg-[#050505] scroll-mt-28 transition-colors duration-300 relative overflow-hidden"
      ref={ref}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute -top-20 -right-32 w-80 h-80 rounded-full blur-3xl opacity-5"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
        }}
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionHeader
          index={5}
          eyebrow={t("nav.experience")}
          title={t("experience.title")}
          description={t("experience.description")}
          visible={isVisible}
        />

        <motion.ol
          className="relative pl-10 md:pl-14 space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Vertical rail */}
          <div className="absolute left-3 md:left-5 top-2 bottom-2 w-px bg-gradient-to-b from-accent-500 via-gray-200 dark:via-white/10 to-transparent" />

          {items.map((exp, index) => (
            <motion.li
              key={exp.key}
              className="relative group"
              variants={itemVariants}
            >
              {/* Timeline node */}
              <span
                aria-hidden="true"
                className="absolute -left-[1.85rem] md:-left-[2.25rem] top-3 flex items-center justify-center"
              >
                <motion.span
                  className="block w-3.5 h-3.5 rounded-full bg-white dark:bg-[#050505] border-2 border-accent-500 shadow-[0_0_12px_rgba(124,58,237,0.5)]"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                />
              </span>

              {/* Period + index */}
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-[11px] tabular-nums uppercase tracking-[0.18em] text-accent-600 dark:text-accent-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
                  {exp.period}
                </span>
                {exp.location && (
                  <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    · {exp.location}
                  </span>
                )}
              </div>

              {/* Card */}
              <motion.div
                className="glass glass-hover relative p-6 rounded-2xl"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                  {exp.role}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-0.5">
                  {exp.company}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-3">
                  {exp.description}
                </p>
              </motion.div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
};

export default Experience;

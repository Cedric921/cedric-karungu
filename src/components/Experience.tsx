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
      className="py-24 bg-surface-100/60 dark:bg-surface-950 scroll-mt-28 transition-colors duration-300 relative overflow-hidden noise"
      ref={ref}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute -top-20 -right-32 w-80 h-80 rounded-full blur-3xl opacity-5"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(245,158,11,0.12) 50%, transparent 75%)",
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
          {/* Vertical aurora rail */}
          <div className="absolute left-3 md:left-5 top-2 bottom-2 w-px bg-gradient-to-b from-accent-500 via-highlight-400/40 to-transparent" />

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
                  className="relative block w-3.5 h-3.5 rounded-full bg-surface-50 dark:bg-surface-950 border-2 border-accent-500 shadow-[0_0_14px_rgba(139,92,246,0.7)]"
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                >
                  <span className="absolute inset-0 rounded-full bg-accent-500/40 blur-md group-hover:bg-highlight-500/50 transition-colors duration-500" />
                </motion.span>
              </span>

              {/* Period + index */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.22em] text-accent-600 dark:text-accent-400 bg-accent-500/10 border border-accent-500/30 rounded-md px-2 py-0.5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                  {exp.period}
                </span>
                {exp.location && (
                  <>
                    <span className="text-zinc-300 dark:text-zinc-700">·</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                      {exp.location}
                    </span>
                  </>
                )}
              </div>

              {/* Card */}
              <motion.div
                className="card-lume corner-ticks relative p-6 rounded-xl"
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
              >
                <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-lume transition-colors">
                  {exp.role}
                </h3>
                <p className="text-sm text-accent-700 dark:text-accent-300 font-medium mt-1 font-mono tracking-wide">
                  @ {exp.company}
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mt-3">
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

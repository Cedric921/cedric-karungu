import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SKILLS } from "../constants";
import { useScrollAnimation, usePublicData } from "../hooks";
import type { SkillItem } from "../lib/public-data";
import SectionHeader from "./SectionHeader";

type Category = "Front End" | "Back End" | "A.I";

const Skills: React.FC = () => {
  const t = useTranslations();
  const [activeFilter, setActiveFilter] = useState<Category>("Front End");
  const { ref, isVisible } = useScrollAnimation(0.1);

  const { data: skills } = usePublicData<SkillItem[]>(
    "/api/public/skills",
    SKILLS as unknown as SkillItem[],
  );

  const filters: { key: Category; label: string }[] = [
    { key: "Front End", label: t("skills.frontEnd") },
    { key: "Back End", label: t("skills.backEnd") },
    { key: "A.I", label: t("skills.ai") },
  ];

  const visible = useMemo(
    () => skills.filter((s) => s.category === activeFilter),
    [skills, activeFilter],
  );

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

  return (
    <section
      id="skills"
      className="py-24 bg-surface-50 dark:bg-surface-950 scroll-mt-28 transition-colors duration-300 relative overflow-hidden noise"
      ref={ref}
    >
      {/* Background animation */}
      <motion.div
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.28) 0%, transparent 70%)",
        }}
        animate={{ y: [0, 20, 0], x: [0, 20, 0] }}
        transition={{ duration: 11, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.32) 0%, transparent 70%)",
        }}
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader
          index={3}
          eyebrow={t("nav.skills")}
          title={t("skills.title")}
          description={t("skills.description")}
          visible={isVisible}
        />

        {/* Filter buttons */}
        <motion.div
          className="flex justify-center mb-12"
          variants={itemVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <div className="flex gap-2 glass p-1 rounded-full">
            {filters.map((f) => (
              <motion.button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider ring-accent-focus transition-colors ${
                  activeFilter === f.key
                    ? "bg-accent-600 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {f.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          key={activeFilter}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {visible.map((skill, idx) => {
            const levelPercent =
              skill.level === "Expert"
                ? 100
                : skill.level === "Advanced"
                  ? 75
                  : 50;
            const levelBar =
              skill.level === "Expert"
                ? "from-accent-500 to-highlight-500"
                : skill.level === "Advanced"
                  ? "from-accent-500 to-accent-400"
                  : "from-highlight-500 to-highlight-400";

            return (
              <motion.div
                key={`${skill.category}-${skill.name}`}
                className="relative group h-full"
                variants={itemVariants}
              >
                <motion.div
                  className="card-lume corner-ticks relative p-5 rounded-xl flex items-center gap-5 cursor-default h-full"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  {/* Logo block */}
                  <motion.div
                    className="relative shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-white/[0.06] dark:to-white/[0.02] border border-zinc-200/70 dark:border-white/[0.06] flex items-center justify-center"
                    whileHover={{ rotate: -6, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 380, damping: 18 }}
                  >
                    <img
                      src={skill.logoUrl}
                      alt={skill.name}
                      className="w-8 h-8 dark:hidden"
                    />
                    <img
                      src={skill.logoUrl}
                      alt={skill.name}
                      className="w-8 h-8 hidden dark:block"
                      style={{ filter: "brightness(0) invert(1)" }}
                    />
                  </motion.div>

                  {/* Right column: name + bar + level */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-zinc-900 dark:text-white text-sm md:text-base truncate group-hover:text-lume transition-colors">
                        {skill.name}
                      </h3>
                      <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Level bar */}
                    <div className="relative h-1 w-full rounded-full bg-zinc-200/70 dark:bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${levelBar}`}
                        initial={{ width: 0 }}
                        animate={
                          isVisible
                            ? { width: `${levelPercent}%` }
                            : { width: 0 }
                        }
                        transition={{
                          duration: 1.1,
                          delay: 0.2 + idx * 0.05,
                          ease: [0.22, 0.61, 0.36, 1],
                        }}
                      />
                    </div>

                    <span className="mt-2 inline-block font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                      {skill.level}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;

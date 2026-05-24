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
      className="py-24 bg-white dark:bg-black scroll-mt-28 transition-colors duration-300 relative overflow-hidden"
      ref={ref}
    >
      {/* Background animation */}
      <motion.div
        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(245,158,11,0.1) 50%, transparent 75%)",
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
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {visible.map((skill, idx) => (
            <motion.div
              key={(skill._id as string | undefined) ?? `${skill.name}-${idx}`}
              className="relative group h-full"
              variants={itemVariants}
            >
              {/* Soft glow on hover */}
              <motion.div className="absolute -inset-0.5 bg-gradient-to-r from-accent-500/30 via-accent-600/30 to-accent-500/30 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 pointer-events-none" />

              {/* Card */}
              <motion.div
                className="glass glass-hover relative p-7 rounded-2xl flex flex-col items-center justify-center gap-5 text-center cursor-default h-full"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="relative z-10"
                  whileHover={{ scale: 1.1, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <img
                    src={skill.logoUrl}
                    alt={skill.name}
                    className="w-12 h-12 dark:hidden"
                  />
                  <img
                    src={skill.logoUrl}
                    alt={skill.name}
                    className="w-12 h-12 hidden dark:block"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </motion.div>

                <h3 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300">
                  {skill.name}
                </h3>

                <div className="flex items-center gap-2">
                  <motion.span
                    className={`w-2 h-2 rounded-full ${
                      skill.level === "Expert"
                        ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                        : skill.level === "Advanced"
                          ? "bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.6)]"
                          : "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                    }`}
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                  />
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gray-600 dark:text-gray-400">
                    {skill.level}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { PROJECTS, Icons } from "../constants";
import { useScrollAnimation, usePublicData } from "../hooks";
import { projectToView, pick, type ProjectItem } from "../lib/public-data";
import type { Locale } from "../lib/models/shared";
import SectionHeader from "./SectionHeader";

type FilterKey = "all" | "web" | "app";

const Portfolio: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const { ref, isVisible } = useScrollAnimation(0.1);

  const { data: projects } = usePublicData<ProjectItem[]>(
    "/api/public/projects",
    PROJECTS as unknown as ProjectItem[],
  );

  const visible = useMemo(() => {
    const views = projects.map((p) => ({
      raw: p,
      view: projectToView(p, locale),
    }));
    return views.filter(({ raw }) => {
      if (activeFilter === "all") return true;
      const catEn = pick(raw.category, "en").toLowerCase();
      return catEn === activeFilter;
    });
  }, [projects, activeFilter, locale]);

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t("portfolio.filterAll") },
    { key: "web", label: t("portfolio.filterWeb") },
    { key: "app", label: t("portfolio.filterApp") },
  ];

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

  return (
    <section
      id="portfolio"
      className="py-24 scroll-mt-28 bg-gray-50 dark:bg-[#100B17] transition-colors duration-300 relative overflow-hidden"
      ref={ref}
    >
      {/* Background animations */}
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-5"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(245,158,11,0.1) 50%, transparent 75%)",
        }}
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-5"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
        }}
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader
          index={4}
          eyebrow={t("nav.projects")}
          title={t("portfolio.title")}
          description={t("portfolio.description")}
          align="left"
          visible={isVisible}
          trailing={
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
          }
        />

        {/* Projects grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {visible.slice(0, 6).map(({ view: project }, idx) => (
            <motion.div
              key={project.key}
              className="group relative h-full"
              variants={itemVariants}
            >
              {/* Soft glow on hover */}
              <motion.div className="absolute -inset-0.5 bg-gradient-to-r from-accent-500/40 via-accent-600/40 to-accent-500/40 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 pointer-events-none" />

              {/* Main card container */}
              <motion.div
                className="glass glass-hover relative h-full rounded-2xl overflow-hidden"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Image container with overlay */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-[#111] dark:to-[#0a0a0a]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.6, type: "spring" }}
                  />
                  <span className="absolute top-3 left-3 z-20 font-mono text-[10px] tabular-nums uppercase tracking-[0.18em] text-white/80 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1">
                    {String(idx + 1).padStart(2, "0")} / {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-7 flex flex-col">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300 leading-snug">
                      {project.title}
                    </h3>

                    <div className="flex items-center gap-2 shrink-0">
                      {project.link && project.link !== "#" && (
                        <motion.a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-white/60 dark:bg-white/5 border border-gray-200/70 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-accent-600 hover:text-white hover:border-accent-600 transition-colors ring-accent-focus"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Open project website"
                        >
                          <Icons.ExternalLink />
                        </motion.a>
                      )}
                      {project.githubLink && (
                        <motion.a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-white/60 dark:bg-white/5 border border-gray-200/70 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-accent-600 hover:text-white hover:border-accent-600 transition-colors ring-accent-focus"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Open project GitHub"
                        >
                          <Icons.Github />
                        </motion.a>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-5 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md font-mono text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-300 bg-white/40 dark:bg-white/[0.04] border border-gray-200/70 dark:border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
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
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-lume text-zinc-950 rounded-full font-medium cursor-pointer shadow-md"
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 20px 35px rgba(16, 185, 129, 0.35), 0 8px 18px rgba(245, 158, 11, 0.25)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {t("portfolio.seeMoreProjects")}
            <Icons.ExternalLink />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;

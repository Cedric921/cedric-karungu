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
      className="py-24 scroll-mt-28 bg-surface-100/60 dark:bg-surface-950 transition-colors duration-300 relative overflow-hidden noise"
      ref={ref}
    >
      {/* Background animations */}
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.32) 0%, transparent 70%)",
        }}
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.28) 0%, transparent 70%)",
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

        {/* Projects grid — magazine bento with zigzag offset */}
        <motion.div
          key={activeFilter}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-x-8 lg:gap-y-16"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {visible.slice(0, 6).map(({ view: project }, idx) => {
            const primary =
              project.link && project.link !== "#"
                ? project.link
                : project.githubLink;
            const offset = idx % 3 === 1 ? "lg:translate-y-10" : "";
            return (
              <motion.article
                key={project.key}
                className={`group relative h-full ${offset}`}
                variants={itemVariants}
              >
                {/* Outline shadow plate — offset behind card, draws on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl border border-accent-500/0 group-hover:border-accent-500/35 transition-all duration-500 translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 pointer-events-none"
                />

                <motion.div
                  className="card-lume relative h-full rounded-2xl overflow-hidden flex flex-col"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                >
                  {/* Image area */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-surface-950">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.22, 0.61, 0.36, 1],
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Category pill — top-left */}
                    <span className="absolute top-4 left-4 inline-flex items-center font-mono text-[10px] uppercase tracking-[0.18em] text-white/90 bg-black/45 backdrop-blur-md border border-white/15 rounded-md px-2 py-1">
                      <span className="w-1 h-1 rounded-full bg-accent-400 mr-2 animate-pulse" />
                      {project.category}
                    </span>

                    {/* Tags slide-up overlay on hover */}
                    <div className="absolute inset-x-0 bottom-0 p-4 flex flex-wrap gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-gradient-to-t from-black/85 via-black/40 to-transparent">
                      {project.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.12em] text-white bg-white/10 backdrop-blur-sm border border-white/15 rounded-md px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-6 flex flex-col gap-3 flex-1">
                    {/* Huge ghost index — editorial signature */}
                    <span
                      aria-hidden="true"
                      className="absolute -top-4 right-4 font-mono text-7xl md:text-8xl font-bold leading-none tabular-nums text-zinc-900/[0.06] dark:text-white/[0.05] select-none pointer-events-none"
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    <div className="relative z-10">
                      <div className="eyebrow text-[10px] mb-2">
                        <span className="eyebrow-rule" />
                        <span>case · {project.category}</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-lume transition-colors duration-300">
                        {project.title}
                      </h3>
                    </div>

                    <p className="relative z-10 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    {/* CTA row */}
                    <div className="relative z-10 mt-auto pt-4 flex items-center justify-between border-t border-dashed border-zinc-200/70 dark:border-white/[0.07]">
                      {primary ? (
                        <a
                          href={primary}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/cta inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-700 dark:text-zinc-300 hover:text-accent-600 dark:hover:text-accent-400 transition-colors ring-accent-focus rounded-sm"
                        >
                          View case
                          <span className="inline-block transition-transform duration-300 group-hover/cta:translate-x-1 group-hover:translate-x-1">
                            →
                          </span>
                        </a>
                      ) : (
                        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-600">
                          Private
                        </span>
                      )}

                      <div className="flex items-center gap-1">
                        {project.link && project.link !== "#" && (
                          <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors ring-accent-focus"
                            whileHover={{ y: -2, rotate: -8 }}
                            whileTap={{ scale: 0.9 }}
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
                            className="p-1.5 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors ring-accent-focus"
                            whileHover={{ y: -2, rotate: -8 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Open project GitHub"
                          >
                            <Icons.Github />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.article>
            );
          })}
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
                "0 20px 35px rgba(139, 92, 246, 0.4), 0 8px 18px rgba(245, 158, 11, 0.25)",
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

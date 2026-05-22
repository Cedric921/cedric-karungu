import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { PROJECTS, Icons } from "../constants";
import { useScrollAnimation, usePublicData } from "../hooks";
import { projectToView, pick, type ProjectItem } from "../lib/public-data";
import type { Locale } from "../lib/models/shared";

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

  const projectVariants = {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -12,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(124, 58, 237, 0.2)",
      transition: { duration: 0.3 },
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
            "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
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
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants}>
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300"
              variants={itemVariants}
            >
              {t("portfolio.title")}
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-400 max-w-xl text-lg"
              variants={itemVariants}
            >
              {t("portfolio.description")}
            </motion.p>
          </motion.div>

          {/* Filter buttons */}
          <motion.div
            className="flex gap-2 bg-white dark:bg-black p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-sm"
            variants={itemVariants}
          >
            {filters.map((f) => (
              <motion.button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === f.key
                    ? "bg-accent-600 text-white"
                    : "text-gray-600 dark:text-gray-400"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  activeFilter === f.key ? { scale: 1.05 } : { scale: 1 }
                }
              >
                {f.label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {visible.slice(0, 6).map(({ view: project }) => (
            <motion.div
              key={project.key}
              className="group relative h-full"
              variants={itemVariants}
            >
              {/* Glow background effect */}
              <motion.div className="absolute -inset-0.5 bg-gradient-to-r from-accent-500 via-accent-600 to-accent-500 rounded-2xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-300" />

              {/* Main card container */}
              <motion.div
                className="relative h-full bg-white dark:bg-[#0a0a0a] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Image container with overlay */}
                <motion.div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-[#111] dark:to-[#0a0a0a]">
                  <motion.div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  />
                </motion.div>

                {/* Content */}
                <div className="p-8 flex flex-col h-[calc(100%-16rem)]">
                  <motion.div className="flex justify-between items-start mb-6 flex-1">
                    <motion.div>
                      <motion.span className="text-accent-600 dark:text-accent-400 text-xs font-bold uppercase tracking-wider mb-3 block">
                        {project.category}
                      </motion.span>
                      <motion.h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300">
                        {project.title}
                      </motion.h3>
                    </motion.div>

                    {/* Action buttons */}
                    <motion.div
                      className="flex items-center gap-2 ml-4"
                      variants={containerVariants}
                    >
                      {project.link && project.link !== "#" && (
                        <motion.a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 dark:bg-white/5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-accent-600 dark:hover:bg-accent-600 hover:text-white transition-all duration-300"
                          whileHover={{ scale: 1.1, y: -2 }}
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
                          className="p-2 bg-gray-100 dark:bg-white/5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-accent-600 dark:hover:bg-accent-600 hover:text-white transition-all duration-300"
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Open project GitHub"
                        >
                          <Icons.Github />
                        </motion.a>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Description */}
                  <motion.p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed flex-1">
                    {project.description}
                  </motion.p>

                  {/* Tags */}
                  <motion.div
                    className="flex flex-wrap gap-2"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {project.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5 hover:border-accent-600 dark:hover:border-accent-400 transition-colors duration-300"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
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
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent-600 text-white rounded-full font-medium cursor-pointer shadow-md"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 30px rgba(124, 58, 237, 0.3)",
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

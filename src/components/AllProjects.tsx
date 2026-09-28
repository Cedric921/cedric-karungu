import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PROJECTS } from "../constants";
import { useScrollAnimation, usePublicData } from "../hooks";
import { projectToView, pick, type ProjectItem } from "../lib/public-data";
import type { Locale } from "../lib/models/shared";
import ProjectCard from "./ProjectCard";
import { RevealLines } from "./motion/Reveal";

type FilterKey = "all" | "web" | "app";

const AllProjects: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const activeFilter = (["web", "app"].includes(params.get("type") || "") ? params.get("type") : "all") as FilterKey;
  const activeTag = params.get("tag") || "";
  const { ref, isVisible } = useScrollAnimation(0.05);

  const { data: projects } = usePublicData<ProjectItem[]>(
    "/api/public/projects",
    PROJECTS as unknown as ProjectItem[],
  );

  const views = useMemo(
    () => projects.map((p) => ({ raw: p, view: projectToView(p, locale) })),
    [projects, locale],
  );

  // Most used tags first — these become the secondary filter row.
  const topTags = useMemo(() => {
    const counts = new Map<string, { tag: string; n: number }>();
    for (const { view } of views)
      for (const tag of view.tags) {
        const k = tag.toLowerCase();
        counts.set(k, { tag: counts.get(k)?.tag ?? tag, n: (counts.get(k)?.n ?? 0) + 1 });
      }
    return [...counts.values()].sort((a, b) => b.n - a.n || a.tag.localeCompare(b.tag)).slice(0, 14);
  }, [views]);

  const visible = useMemo(
    () =>
      views.filter(({ raw, view }) => {
        if (activeFilter !== "all" && pick(raw.category, "en").toLowerCase() !== activeFilter) return false;
        if (activeTag && !view.tags.some((tg) => tg.toLowerCase() === activeTag.toLowerCase())) return false;
        return true;
      }),
    [views, activeFilter, activeTag],
  );

  const setParam = (key: "type" | "tag", value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t("portfolio.filterAll") },
    { key: "web", label: t("portfolio.filterWeb") },
    { key: "app", label: t("portfolio.filterApp") },
  ];

  return (
    <section className="pt-36 pb-24 min-h-screen bg-surface-100/60 dark:bg-surface-950 transition-colors duration-300 relative overflow-clip noise">
      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={ref as React.Ref<HTMLDivElement>}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 gap-8">
          <div>
            <div className="eyebrow mb-4">
              <span className="eyebrow-index">04</span>
              <span className="eyebrow-rule" />
              <span>{t("nav.projects")}</span>
            </div>
            <RevealLines
              as="h1"
              className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white"
              lines={[t("portfolio.title")]}
            />
            <motion.p
              className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-xl text-base md:text-lg"
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {t("portfolio.description")}
            </motion.p>
          </div>

          <div className="flex gap-2 glass p-1 rounded-full self-start md:self-auto">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setParam("type", f.key)}
                className={`relative px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider ring-accent-focus transition-colors ${
                  activeFilter === f.key
                    ? "text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {activeFilter === f.key && (
                  <motion.span
                    layoutId="type-pill"
                    className="absolute inset-0 rounded-full bg-accent-600"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tag filter */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            {String(visible.length).padStart(2, "0")} · {t("portfolio.projects")}
          </span>
          {topTags.map(({ tag }) => {
            const on = tag.toLowerCase() === activeTag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => setParam("tag", on ? "" : tag)}
                aria-pressed={on}
                className={`chip-mono !px-3 !py-1.5 ring-accent-focus transition-colors ${
                  on ? "!bg-accent-600 !text-white !border-accent-600" : "hover:border-accent-500/50"
                }`}
              >
                {tag}
              </button>
            );
          })}
          {activeTag && !topTags.some((x) => x.tag.toLowerCase() === activeTag.toLowerCase()) && (
            <button onClick={() => setParam("tag", "")} className="chip-mono !px-3 !py-1.5 !bg-accent-600 !text-white" aria-pressed>
              {activeTag} ×
            </button>
          )}
        </div>

        {/* Projects grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {visible.map(({ view: project }, idx) => (
              <motion.div
                key={project.key}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : undefined}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: Math.min(idx, 8) * 0.06 }}
              >
                <ProjectCard project={project} index={idx} highlight={activeTag ? [activeTag] : undefined} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && (
          <p className="py-24 text-center text-zinc-500">
            No project matches this filter.{" "}
            <button className="text-accent-600 hover:underline" onClick={() => router.replace(pathname, { scroll: false })}>
              Reset
            </button>
          </p>
        )}
      </div>
    </section>
  );
};

export default AllProjects;

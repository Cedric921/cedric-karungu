"use client";

import React, { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PROJECTS } from "../constants";
import { usePublicData } from "../hooks";
import { projectToView, pick, type ProjectItem } from "../lib/public-data";
import type { Locale } from "../lib/models/shared";
import ProjectCard from "./ProjectCard";
import Reveal from "./ui/Reveal";

type FilterKey = "all" | "web" | "app";

/** /projects — every project, filterable by type and by tag (?type=web&tag=React). */
const AllProjects: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const type = params.get("type");
  const activeFilter: FilterKey = type === "web" || type === "app" ? type : "all";
  const activeTag = params.get("tag") || "";

  const { data: projects } = usePublicData<ProjectItem[]>("/api/public/projects", PROJECTS as unknown as ProjectItem[]);

  const views = useMemo(() => projects.map((p) => ({ raw: p, view: projectToView(p, locale) })), [projects, locale]);

  // Most used tags first — the tag filter row.
  const topTags = useMemo(() => {
    const counts = new Map<string, { tag: string; n: number }>();
    for (const { view } of views)
      for (const tag of view.tags) {
        const k = tag.toLowerCase();
        counts.set(k, { tag: counts.get(k)?.tag ?? tag, n: (counts.get(k)?.n ?? 0) + 1 });
      }
    return [...counts.values()].sort((a, b) => b.n - a.n || a.tag.localeCompare(b.tag)).slice(0, 16);
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
  const tagIsListed = topTags.some((x) => x.tag.toLowerCase() === activeTag.toLowerCase());

  return (
    <div className="wrap pt-32 pb-24 md:pt-40">
      <header className="grid gap-8 md:grid-cols-[200px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
        <p className="label flex items-center gap-2 md:pt-4">
          <span className="inline-block h-1.5 w-1.5 bg-accent-500" aria-hidden="true" />
          {t("nav.projects")} · {String(projects.length).padStart(2, "0")}
        </p>
        <div>
          <h1 className="h-display text-5xl leading-[0.95] md:text-7xl">{t("portfolio.title")}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{t("portfolio.description")}</p>
        </div>
      </header>

      {/* Filters */}
      <div className="mt-14 grid gap-6 border-y hairline py-6 md:grid-cols-[200px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="flex gap-5" role="tablist">
          {filters.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={activeFilter === f.key}
              onClick={() => setParam("type", f.key)}
              className={`text-sm transition-colors ${
                activeFilter === f.key ? "text-ink underline decoration-accent-500 decoration-2 underline-offset-8" : "text-muted hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {topTags.map(({ tag }) => {
            const on = tag.toLowerCase() === activeTag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => setParam("tag", on ? "" : tag)}
                aria-pressed={on}
                className={`chip ${on ? "!border-accent-500 !bg-accent-500 !text-white" : ""}`}
              >
                {tag}
              </button>
            );
          })}
          {activeTag && !tagIsListed && (
            <button onClick={() => setParam("tag", "")} aria-pressed className="chip !border-accent-500 !bg-accent-500 !text-white">
              {activeTag} ×
            </button>
          )}
        </div>
      </div>

      <p className="label mt-8">
        {String(visible.length).padStart(2, "0")} {t("portfolio.projects")}
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(({ view }, i) => (
          <Reveal as="li" key={view.key} delay={Math.min(i % 3, 2) * 0.05}>
            <ProjectCard project={view} index={i} highlight={activeTag ? [activeTag] : undefined} />
          </Reveal>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="py-24 text-center text-muted">
          —{" "}
          <button className="link-quiet" onClick={() => router.replace(pathname, { scroll: false })}>
            {t("portfolio.filterAll")}
          </button>
        </p>
      )}
    </div>
  );
};

export default AllProjects;

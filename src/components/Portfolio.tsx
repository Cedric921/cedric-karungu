"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PROJECTS } from "../constants";
import { usePublicData } from "../hooks";
import { projectToView, type ProjectItem, type ProjectView } from "../lib/public-data";
import type { Locale } from "../lib/models/shared";
import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { SECTION_TOTAL } from "./AboutMe";
import AutoGallery from "./fx/AutoGallery";
import { useScramble } from "./fx/Scramble";
import { spotlightMove } from "./fx/useSpotlight";

const SHOWCASE_COUNT = 6;

/** Landing: a readable list of selected projects, each row linking to its page. */
const Portfolio: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { data: projects } = usePublicData<ProjectItem[]>("/api/public/projects", PROJECTS as unknown as ProjectItem[]);

  const showcase = useMemo(() => {
    const featured = projects.filter((p) => p.featured);
    const rest = projects.filter((p) => !p.featured);
    return [...featured, ...rest].slice(0, SHOWCASE_COUNT).map((p) => projectToView(p, locale));
  }, [projects, locale]);

  return (
    <Section
      id="portfolio"
      index={3}
      total={SECTION_TOTAL}
      label={t("nav.projects")}
      intro={t("portfolio.description")}
      title={t("portfolio.title")}
    >
      <ol className="divide-y divide-line/10 border-y hairline">
        {showcase.map((p, i) => (
          <Reveal as="li" key={p.key} delay={Math.min(i, 3) * 0.04}>
            <ProjectRow project={p} index={i} />
          </Reveal>
        ))}
      </ol>
      <div className="mt-10 flex items-center justify-between gap-4">
        <span className="label">
          {String(showcase.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} {t("portfolio.projects")}
        </span>
        <Link href={`/${locale}/projects`} className="btn-ghost">
          {t("ui.allProjects")} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </Section>
  );
};

function ProjectRow({ project, index }: { project: ProjectView; index: number }) {
  const locale = useLocale();
  const t = useTranslations();
  const { display, run } = useScramble(project.title, 500);
  const images = project.gallery.length ? project.gallery : project.image ? [project.image] : [];

  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      onMouseEnter={() => run(project.title)}
      onFocus={() => run(project.title)}
      onPointerMove={spotlightMove}
      className="spotlight group -mx-4 grid gap-6 rounded-2xl px-4 py-8 sm:grid-cols-[minmax(0,1fr)_220px] md:grid-cols-[minmax(0,1fr)_300px] md:gap-10"
    >
      <div className="min-w-0">
        <p className="label">
          {String(index + 1).padStart(2, "0")} · {project.category}
          {images.length > 1 && <span className="ml-2 text-faint">· {images.length} shots</span>}
        </p>
        <h3 className="mt-3 flex items-start gap-2 font-display text-2xl font-bold tracking-tight text-ink transition-colors group-hover:text-accent-500 md:text-3xl">
          <span aria-label={project.title}>
            <span aria-hidden="true">{display}</span>
          </span>
          <span aria-hidden="true" className="mt-1 text-lg text-faint transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent-500">
            ↗
          </span>
        </h3>
        <p className="mt-3 line-clamp-2 max-w-xl text-[15px] leading-relaxed text-muted">{project.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.slice(0, 5).map((tag, i) => (
            <li
              key={tag}
              className="chip transition-transform duration-300 group-hover:-translate-y-0.5"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {tag}
            </li>
          ))}
        </ul>
        <span className="sr-only">{t("ui.viewCase")}</span>
      </div>
      {images.length > 0 && (
        <div data-inspect="<Gallery autoplay />" className="order-first sm:order-none">
          <AutoGallery
            images={images}
            offset={index * 700}
            className="aspect-[16/10] rounded-xl border hairline bg-raised transition-transform duration-500 group-hover:-rotate-1 group-hover:scale-[1.02]"
          />
        </div>
      )}
    </Link>
  );
}

export default Portfolio;

"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { ProjectView } from "../lib/public-data";
import AutoGallery from "./fx/AutoGallery";
import { useScramble } from "./fx/Scramble";

/** Simple project card for grids: image, title, two lines, tags. */
export default function ProjectCard({
  project,
  index,
  highlight,
}: {
  project: ProjectView;
  index?: number;
  /** Tags to emphasise (e.g. shared with the current project / active filter). */
  highlight?: string[];
}) {
  const locale = useLocale();
  const { display, run } = useScramble(project.title, 450);
  const images = project.gallery.length ? project.gallery : project.image ? [project.image] : [];
  const hl = new Set((highlight ?? []).map((t) => t.toLowerCase()));
  const tags = [...project.tags].sort((a, b) => Number(hl.has(b.toLowerCase())) - Number(hl.has(a.toLowerCase())));

  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      onMouseEnter={() => run(project.title)}
      className="group flex h-full flex-col"
    >
      <div data-inspect="<Gallery autoplay />">
        <AutoGallery
          images={images}
          offset={(index ?? 0) * 500}
          className="aspect-[16/10] rounded-xl border hairline bg-raised transition-transform duration-500 group-hover:-translate-y-1"
        />
      </div>
      <p className="label mt-5">{project.category}</p>
      <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-accent-500">
        <span aria-label={project.title}>
          <span aria-hidden="true">{display}</span>
        </span>{" "}
        <span aria-hidden="true" className="inline-block text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{project.description}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {tags.slice(0, 4).map((tag) => (
          <li key={tag} className={`chip ${hl.has(tag.toLowerCase()) ? "!border-accent-500/60 !text-accent-500" : ""}`}>
            {tag}
          </li>
        ))}
      </ul>
    </Link>
  );
}

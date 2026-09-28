"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Icons } from "../constants";
import type { ProjectView } from "../lib/public-data";

type Props = {
  project: ProjectView;
  index: number;
  /** Tags to highlight (e.g. the ones shared with the current project). */
  highlight?: string[];
  className?: string;
  imageClassName?: string;
};

/**
 * Editorial project card. The whole card links to the project page via a
 * stretched link; the external/GitHub icons sit above it so they stay clickable.
 */
export default function ProjectCard({ project, index, highlight, className, imageClassName }: Props) {
  const locale = useLocale();
  const href = `/${locale}/projects/${project.slug}`;
  const hl = new Set((highlight ?? []).map((t) => t.toLowerCase()));
  const tags = highlight?.length
    ? [...project.tags].sort((a, b) => Number(hl.has(b.toLowerCase())) - Number(hl.has(a.toLowerCase())))
    : project.tags;
  const imageCount = project.gallery.length;

  return (
    <article className={`group relative h-full ${className ?? ""}`} data-cursor="View">
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl border border-accent-500/0 group-hover:border-accent-500/35 transition-all duration-500 translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 pointer-events-none"
      />
      <motion.div
        className="card-lume relative h-full rounded-2xl overflow-hidden flex flex-col"
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-surface-950 ${
            imageClassName ?? "h-56"
          }`}
        >
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <span className="absolute top-4 left-4 inline-flex items-center font-mono text-[10px] uppercase tracking-[0.18em] text-white/90 bg-black/45 backdrop-blur-md border border-white/15 rounded-md px-2 py-1">
            <span className="w-1 h-1 rounded-full bg-accent-400 mr-2 animate-pulse" />
            {project.category}
          </span>
          {imageCount > 1 && (
            <span className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/90 bg-black/45 backdrop-blur-md border border-white/15 rounded-md px-2 py-1">
              {imageCount} shots
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 p-4 flex flex-wrap gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-gradient-to-t from-black/85 via-black/40 to-transparent">
            {tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center font-mono text-[10px] uppercase tracking-[0.12em] backdrop-blur-sm border rounded-md px-2 py-0.5 ${
                  hl.has(tag.toLowerCase())
                    ? "text-zinc-950 bg-highlight-300 border-highlight-200"
                    : "text-white bg-white/10 border-white/15"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="relative p-6 flex flex-col gap-3 flex-1">
          <span
            aria-hidden="true"
            className="absolute -top-4 right-4 font-mono text-7xl md:text-8xl font-bold leading-none tabular-nums text-zinc-900/[0.06] dark:text-white/[0.05] select-none pointer-events-none"
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="relative">
            <div className="eyebrow text-[10px] mb-2">
              <span className="eyebrow-rule" />
              <span>case · {project.category}</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-lume transition-colors duration-300">
              {project.title}
            </h3>
          </div>

          <p className="relative text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>

          <div className="relative mt-auto pt-4 flex items-center justify-between border-t border-dashed border-zinc-200/70 dark:border-white/[0.07]">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-700 dark:text-zinc-300 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
              View case
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>

            <div className="relative z-10 flex items-center gap-1">
              {project.link && project.link !== "#" && (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Live"
                  className="p-1.5 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors ring-accent-focus"
                  whileHover={{ y: -2, rotate: -8 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Open ${project.title} website`}
                >
                  <Icons.ExternalLink />
                </motion.a>
              )}
              {project.githubLink && (
                <motion.a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Code"
                  className="p-1.5 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors ring-accent-focus"
                  whileHover={{ y: -2, rotate: -8 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Open ${project.title} on GitHub`}
                >
                  <Icons.Github />
                </motion.a>
              )}
            </div>
          </div>
        </div>

        {/* Stretched link: the whole card opens the project page. */}
        <Link
          href={href}
          aria-label={`${project.title} — view case study`}
          className="absolute inset-0 z-[1] rounded-2xl ring-accent-focus"
        />
      </motion.div>
    </article>
  );
}

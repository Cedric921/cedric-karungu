"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { ProjectView } from "../lib/public-data";
import SiteShell from "./SiteShell";
import ProjectCard from "./ProjectCard";
import Reveal from "./ui/Reveal";
import MagneticLetters from "./fx/MagneticLetters";
import RollText from "./fx/RollText";

type Props = {
  project: ProjectView;
  index: number;
  total: number;
  related: { project: ProjectView; shared: string[] }[];
  prev: ProjectView | null;
  next: ProjectView | null;
};

const pad = (n: number) => String(n).padStart(2, "0");
const GRID = "grid gap-8 md:grid-cols-[200px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[240px_minmax(0,1fr)]";

export default function ProjectDetail(props: Props) {
  return (
    <SiteShell>
      <ProjectDetailBody {...props} />
    </SiteShell>
  );
}

function ProjectDetailBody({ project, index, total, related, next }: Props) {
  const t = useTranslations("projectPage");
  const locale = useLocale();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const images = project.gallery.length ? project.gallery : project.image ? [project.image] : [];
  const paragraphs = project.description.split(/\n+/).filter((p) => p.trim());
  const hasLive = project.link && project.link !== "#";

  return (
    <article className="pt-28 md:pt-36">
      {/* Header */}
      <header className={`wrap ${GRID}`}>
        <div className="space-y-3 md:pt-4">
          <Link href={`/${locale}/projects`} className="link-quiet text-sm text-muted">
            ← {t("back")}
          </Link>
          <p className="label flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 bg-accent-500" aria-hidden="true" />
            {pad(index + 1)} / {pad(total)}
          </p>
        </div>
        <div>
          <p className="label">{project.category}</p>
          <h1 className="h-display mt-3 w-fit text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95]">
            <MagneticLetters text={project.title} />
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            {hasLive && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-primary group">
                <RollText accent={false}>{t("visit")}</RollText> <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn-ghost group">
                <RollText>{t("source")}</RollText> <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Cover */}
      {images[0] && (
        <div className="wrap mt-14 md:mt-20">
          <button
            type="button"
            onClick={() => setLightbox(0)}
            aria-label={t("openImage", { n: 1 })}
           
            className="group block w-full overflow-hidden rounded-2xl border hairline bg-raised"
          >
            <img
              src={images[0]}
              alt={project.title}
              className="aspect-[16/9] w-full animate-[kenburns_14s_ease-in-out_infinite_alternate] object-cover object-top motion-reduce:animate-none"
            />
          </button>
        </div>
      )}

      {/* Overview + facts */}
      <section className={`wrap mt-16 border-t hairline pt-12 md:mt-24 ${GRID}`}>
        <aside className="md:sticky md:top-28 md:self-start">
          <dl className="space-y-6 text-sm">
            <div>
              <dt className="label">{t("category")}</dt>
              <dd className="mt-1 text-ink">{project.category || "—"}</dd>
            </div>
            <div>
              <dt className="label">{t("links")}</dt>
              <dd className="mt-1 flex flex-col items-start gap-1">
                {hasLive && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="link">
                    {t("live")} ↗
                  </a>
                )}
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="link">
                    {t("source")} ↗
                  </a>
                )}
                {!hasLive && !project.githubLink && <span className="text-muted">{t("private")}</span>}
              </dd>
            </div>
            <div>
              <dt className="label">{t("images")}</dt>
              <dd className="mt-1 font-mono tabular-nums text-ink">{pad(images.length)}</dd>
            </div>
          </dl>
        </aside>
        <div>
          <p className="label">{t("overview")}</p>
          <div className="mt-4 space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "text-xl leading-relaxed text-ink md:text-2xl" : "text-base leading-relaxed text-muted md:text-lg"}>
                {p}
              </p>
            ))}
          </div>
          {project.tags.length > 0 && (
            <div className="mt-10">
              <p className="label">{t("stack")}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li key={tag}>
                    <Link href={`/${locale}/projects?tag=${encodeURIComponent(tag)}`} className="chip">
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      {images.length > 1 && (
        <section className={`wrap mt-20 border-t hairline pt-12 ${GRID}`}>
          <p className="label">
            {t("gallery")} · {pad(images.length)}
          </p>
          <ul className="grid gap-6 sm:grid-cols-2">
            {images.slice(1).map((src, i) => (
              <Reveal as="li" key={src} className={i % 3 === 0 ? "sm:col-span-2" : ""}>
                <button
                  type="button"
                  onClick={() => setLightbox(i + 1)}
                  aria-label={t("openImage", { n: i + 2 })}
                 
                  className="group block w-full overflow-hidden rounded-xl border hairline bg-raised"
                >
                  <img
                    src={src}
                    alt={`${project.title} — ${i + 2}`}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </button>
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      {/* Next project */}
      {next && (
        <section className="mt-24 border-t hairline">
          <Link href={`/${locale}/projects/${next.slug}`} className={`group wrap py-14 md:py-20 ${GRID}`}>
            <p className="label md:pt-3">{t("next")} →</p>
            <p className="h-display text-4xl transition-colors group-hover:text-accent-500 md:text-6xl">
              <MagneticLetters text={next.title} />{" "}
              <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-2">→</span>
            </p>
          </Link>
        </section>
      )}

      {/* Related by shared tags */}
      {related.length > 0 && (
        <section className={`wrap border-t hairline py-16 md:py-24 ${GRID}`}>
          <div>
            <p className="label">{t("relatedEyebrow")}</p>
            <p className="mt-2 text-sm text-muted">{t("related")}</p>
          </div>
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map(({ project: p, shared }, i) => (
              <Reveal as="li" key={p.key}>
                <ProjectCard project={p} index={i} highlight={shared} />
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      <Lightbox images={images} title={project.title} index={lightbox} onChange={setLightbox} />
    </article>
  );
}

function Lightbox({
  images,
  title,
  index,
  onChange,
}: {
  images: string[];
  title: string;
  index: number | null;
  onChange: (i: number | null) => void;
}) {
  const t = useTranslations("projectPage");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const open = index !== null;

  const go = useCallback(
    (delta: number) => index !== null && onChange((index + delta + images.length) % images.length),
    [index, images.length, onChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, go, onChange]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between px-5 py-4 font-mono text-xs text-zinc-400">
            <span className="truncate">{title}</span>
            <span className="tabular-nums">
              {pad(index + 1)} / {pad(images.length)}
            </span>
            <button type="button" onClick={() => onChange(null)} className="rounded px-2 py-1 text-white hover:bg-white/10">
              {t("close")} ✕
            </button>
          </div>
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4"
            onClick={(e) => e.target === e.currentTarget && onChange(null)}
          >
            <img src={images[index]} alt={`${title} — ${index + 1}`} className="max-h-full max-w-full rounded-lg object-contain" />
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label={t("prevImage")} className="absolute left-3 rounded-full bg-white/10 px-4 py-3 text-white hover:bg-white/20">
                  ←
                </button>
                <button type="button" onClick={() => go(1)} aria-label={t("nextImage")} className="absolute right-3 rounded-full bg-white/10 px-4 py-3 text-white hover:bg-white/20">
                  →
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => onChange(i)}
                  aria-label={t("openImage", { n: i + 1 })}
                  aria-current={i === index}
                  className={`h-12 w-20 shrink-0 overflow-hidden rounded border-2 ${i === index ? "border-accent-500" : "border-transparent opacity-50 hover:opacity-80"}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

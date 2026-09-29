"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Icons } from "../constants";
import type { ProjectView } from "../lib/public-data";
import SiteShell from "./SiteShell";
import ProjectCard from "./ProjectCard";
import Magnetic from "./motion/Magnetic";
import { EASE_OUT, RevealImage, RevealLines } from "./motion/Reveal";

type Props = {
  project: ProjectView;
  index: number;
  total: number;
  related: { project: ProjectView; shared: string[] }[];
  prev: ProjectView | null;
  next: ProjectView | null;
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProjectDetail(props: Props) {
  return (
    <SiteShell>
      <ProjectDetailBody {...props} />
    </SiteShell>
  );
}

function ProjectDetailBody({ project, index, total, related, prev, next }: Props) {
  const t = useTranslations("projectPage");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const images = project.gallery.length ? project.gallery : project.image ? [project.image] : [];
  const [cover, ...rest] = images;
  const paragraphs = project.description.split(/\n{1,}/).filter((p) => p.trim());
  const hasLive = project.link && project.link !== "#";
  const sharedTags = [...new Set(related.flatMap((r) => r.shared))];

  // Cover grows from an inset card to full width as it scrolls into view.
  const coverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: coverRef, offset: ["start end", "start 0.25"] });
  const coverScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.86, 1]);
  const coverRadius = useTransform(scrollYProgress, [0, 1], reduce ? [16, 16] : [48, 16]);

  return (
    <article className="relative bg-surface-50 dark:bg-surface-950 noise">
      {/* ——— Hero ——— */}
      <header className="mx-auto max-w-7xl px-6 pt-36 pb-12">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link
            href={`/${locale}/projects`}
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500 hover:text-accent-600 dark:hover:text-accent-400 ring-accent-focus rounded-sm"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> {t("back")}
          </Link>
          <span className="font-mono text-[11px] tabular-nums uppercase tracking-[0.22em] text-zinc-500">
            {pad(index + 1)} / {pad(total)}
          </span>
        </div>

        <motion.div
          className="eyebrow mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="eyebrow-index">{pad(index + 1)}</span>
          <span className="eyebrow-rule" />
          <span>case · {project.category}</span>
        </motion.div>

        <RevealLines
          as="h1"
          delay={0.15}
          className="max-w-5xl text-5xl font-bold leading-[1.02] tracking-tight text-zinc-900 dark:text-white md:text-7xl lg:text-8xl"
          lines={[project.title]}
        />

        {/* Meta row */}
        <motion.dl
          className="mt-14 grid grid-cols-2 gap-8 border-t border-zinc-200/80 pt-8 dark:border-white/10 md:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } } }}
        >
          {[
            { k: t("category"), v: <span>{project.category || "—"}</span> },
            {
              k: t("stack"),
              v: (
                <span className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/${locale}/projects?tag=${encodeURIComponent(tag)}`}
                      className="chip-mono hover:border-accent-500/60 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </span>
              ),
            },
            {
              k: t("links"),
              v: (
                <span className="flex flex-col gap-1.5">
                  {hasLive && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent-600 dark:hover:text-accent-400">
                      {t("live")} <Icons.ExternalLink />
                    </a>
                  )}
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent-600 dark:hover:text-accent-400">
                      {t("source")} <Icons.Github />
                    </a>
                  )}
                  {!hasLive && !project.githubLink && <span className="text-zinc-500">{t("private")}</span>}
                </span>
              ),
            },
            { k: t("images"), v: <span className="tabular-nums">{pad(images.length)}</span> },
          ].map(({ k, v }) => (
            <motion.div
              key={k}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } } }}
            >
              <dt className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">{k}</dt>
              <dd className="text-sm text-zinc-800 dark:text-zinc-200 [&_svg]:h-4 [&_svg]:w-4">{v}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </header>

      {/* ——— Cover ——— */}
      {cover && (
        <div ref={coverRef} className="mx-auto max-w-[1400px] px-4 md:px-6">
          <motion.button
            type="button"
            onClick={() => setLightbox(0)}
            data-cursor="Zoom"
            style={{ scale: coverScale, borderRadius: coverRadius }}
            className="relative block aspect-[16/9] w-full overflow-hidden bg-zinc-200 ring-accent-focus dark:bg-zinc-900"
            aria-label={t("openImage", { n: 1 })}
          >
            <motion.img
              src={cover}
              alt={project.title}
              className="h-full w-full object-cover object-top"
              initial={reduce ? false : { scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.3 }}
            />
          </motion.button>
        </div>
      )}

      {/* ——— Overview ——— */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-24 md:grid-cols-[1fr_2fr] md:py-32">
        <div className="md:sticky md:top-32 md:self-start">
          <div className="eyebrow">
            <span className="eyebrow-rule" />
            <span>{t("overview")}</span>
          </div>
        </div>
        <div className="space-y-6">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              className={
                i === 0
                  ? "text-2xl font-medium leading-snug tracking-tight text-zinc-900 dark:text-white md:text-3xl"
                  : "text-lg leading-relaxed text-zinc-600 dark:text-zinc-400"
              }
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              {p}
            </motion.p>
          ))}
          <div className="flex flex-wrap gap-3 pt-6">
            {hasLive && (
              <Magnetic>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-lume px-6 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-accent-600/30 ring-accent-focus"
                >
                  {t("visit")} <Icons.ExternalLink />
                </a>
              </Magnetic>
            )}
            {project.githubLink && (
              <Magnetic>
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 ring-accent-focus hover:border-accent-500 dark:border-white/20 dark:text-white"
                >
                  {t("source")} <Icons.Github />
                </a>
              </Magnetic>
            )}
          </div>
        </div>
      </section>

      {/* ——— Gallery: alternating full-bleed and two-up rows ——— */}
      {rest.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="eyebrow mb-10">
            <span className="eyebrow-rule" />
            <span>{t("gallery")}</span>
            <span className="eyebrow-index">{pad(images.length)}</span>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {rest.map((src, i) => {
              const full = i % 3 === 0;
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setLightbox(i + 1)}
                  data-cursor="Zoom"
                  aria-label={t("openImage", { n: i + 2 })}
                  className={`group relative block text-left ring-accent-focus rounded-2xl ${full ? "md:col-span-2" : ""}`}
                >
                  <RevealImage
                    src={src}
                    alt={`${project.title} — ${i + 2}`}
                    className={`rounded-2xl bg-zinc-200 dark:bg-zinc-900 ${full ? "aspect-[16/9]" : "aspect-[4/3]"}`}
                    imgClassName="object-top"
                    parallax={full ? 40 : 24}
                  />
                  <span className="absolute bottom-4 left-4 rounded-md bg-black/50 px-2 py-1 font-mono text-[10px] tabular-nums text-white backdrop-blur-md">
                    {pad(i + 2)} / {pad(images.length)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ——— Next project ——— */}
      {next && (
        <section className="border-y border-zinc-200/80 dark:border-white/10">
          <Link
            href={`/${locale}/projects/${next.slug}`}
            data-cursor="Next"
            className="group relative mx-auto flex max-w-7xl flex-col gap-4 overflow-hidden px-6 py-20 md:flex-row md:items-end md:justify-between md:py-28"
          >
            <div className="relative z-10">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">{t("next")}</p>
              <p className="text-4xl font-bold tracking-tight text-zinc-900 transition-colors duration-500 group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400 md:text-7xl">
                {next.title}
              </p>
            </div>
            {next.image && (
              <span className="pointer-events-none relative z-0 block h-40 w-full overflow-hidden rounded-xl md:absolute md:right-6 md:top-1/2 md:h-56 md:w-80 md:-translate-y-1/2 md:rotate-3 md:scale-90 md:opacity-0 md:transition-all md:duration-700 md:ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:rotate-0 md:group-hover:scale-100 md:group-hover:opacity-100">
                <img src={next.image} alt="" className="h-full w-full object-cover object-top" />
              </span>
            )}
          </Link>
          {prev && prev.slug !== next.slug && (
            <div className="mx-auto max-w-7xl px-6 pb-8">
              <Link
                href={`/${locale}/projects/${prev.slug}`}
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500 hover:text-accent-600 dark:hover:text-accent-400"
              >
                ← {t("previous")}: {prev.title}
              </Link>
            </div>
          )}
        </section>
      )}

      {/* ——— Related (same tags) ——— */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow mb-4">
                <span className="eyebrow-rule" />
                <span>{t("relatedEyebrow")}</span>
              </div>
              <RevealLines as="h2" className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-5xl" lines={[t("related")]} />
            </div>
            {sharedTags.length > 0 && (
              <div className="flex max-w-md flex-wrap gap-1.5 md:justify-end">
                {sharedTags.slice(0, 8).map((tag) => (
                  <Link
                    key={tag}
                    href={`/${locale}/projects?tag=${encodeURIComponent(tag)}`}
                    className="chip-mono !px-3 !py-1.5 hover:border-accent-500/60 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {related.map(({ project: p, shared }, i) => (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: (i % 3) * 0.08 }}
              >
                <ProjectCard project={p} index={i} highlight={shared} />
              </motion.div>
            ))}
          </div>
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
  const [dir, setDir] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const open = index !== null;
  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      setDir(delta);
      onChange((index + delta + images.length) % images.length);
    },
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
    window.__lenis?.stop();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
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
          className="fixed inset-0 z-[160] flex flex-col bg-black/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between px-5 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
            <span className="truncate">{title}</span>
            <span className="tabular-nums">
              {pad(index + 1)} / {pad(images.length)}
            </span>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-md px-2 py-1 text-white hover:bg-white/10 ring-accent-focus"
              aria-label={t("close")}
            >
              {t("close")} ✕
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4"
            onClick={(e) => e.target === e.currentTarget && onChange(null)}
          >
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.img
                key={images[index]}
                src={images[index]}
                alt={`${title} — ${index + 1}`}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ x: d >= 0 ? 80 : -80, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d >= 0 ? -80 : 80, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: EASE_OUT }}
                drag={images.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
                className="max-h-full max-w-full cursor-grab select-none rounded-lg object-contain active:cursor-grabbing"
                draggable={false}
              />
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20 ring-accent-focus"
                  aria-label={t("prevImage")}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20 ring-accent-focus"
                  aria-label={t("nextImage")}
                >
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
                  onClick={() => {
                    setDir(i > index ? 1 : -1);
                    onChange(i);
                  }}
                  aria-label={t("openImage", { n: i + 1 })}
                  aria-current={i === index}
                  className={`h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition ${
                    i === index ? "border-accent-500 opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                  }`}
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

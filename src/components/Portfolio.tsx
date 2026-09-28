import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Icons, PROJECTS } from "../constants";
import { usePublicData } from "../hooks";
import { projectToView, type ProjectItem, type ProjectView } from "../lib/public-data";
import type { Locale } from "../lib/models/shared";
import SectionHeader from "./SectionHeader";
import ProjectCard from "./ProjectCard";
import Magnetic from "./motion/Magnetic";
import { EASE_OUT } from "./motion/Reveal";

const SHOWCASE_COUNT = 6;

function useMediaQuery(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

const Portfolio: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const reduce = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");

  const { data: projects } = usePublicData<ProjectItem[]>("/api/public/projects", PROJECTS as unknown as ProjectItem[]);

  const showcase = useMemo(() => {
    const views = projects.map((p) => ({ raw: p, view: projectToView(p, locale) }));
    // Featured projects lead the showcase, then the rest in admin order.
    const featured = views.filter((v) => v.raw.featured);
    const rest = views.filter((v) => !v.raw.featured);
    return [...featured, ...rest].slice(0, SHOWCASE_COUNT).map((v) => v.view);
  }, [projects, locale]);

  return desktop && !reduce ? (
    <SplitShowcase projects={showcase} total={projects.length} />
  ) : (
    <StackedShowcase projects={showcase} />
  );
};

function Header({ visible }: { visible: boolean }) {
  const t = useTranslations();
  return (
    <SectionHeader
      index={4}
      eyebrow={t("nav.projects")}
      title={t("portfolio.title")}
      description={t("portfolio.description")}
      align="left"
      visible={visible}
    />
  );
}

/**
 * Desktop: an editorial index of projects on the left scrolls past a sticky
 * frame on the right. The frame wipes to whichever project is centred in the
 * viewport and plays through its gallery like stories.
 */
function SplitShowcase({ projects, total }: { projects: ProjectView[]; total: number }) {
  const t = useTranslations();
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setHeaderVisible(true), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll progress through the list drives the vertical rail next to the frame.
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });
  const rail = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), { stiffness: 120, damping: 30 });
  const current = projects[active];

  // Active = the row whose centre is closest to the viewport centre.
  useMotionValueEvent(scrollYProgress, "change", () => {
    const rows = listRef.current?.children;
    if (!rows) return;
    const mid = window.innerHeight / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(rows).forEach((row, i) => {
      const r = row.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  });

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative py-28 scroll-mt-20 bg-surface-100/60 dark:bg-surface-950 overflow-clip noise"
    >
      <div className="mx-auto max-w-7xl px-6">
        <Header visible={headerVisible} />

        <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-16">
          {/* Index */}
          <ol ref={listRef} className="relative">
            {projects.map((project, i) => (
              <ShowcaseRow
                key={project.key}
                project={project}
                index={i}
                active={i === active}
              />
            ))}
          </ol>

          {/* Sticky frame */}
          <div className="relative">
            <div className="sticky top-[12vh] flex h-[76vh] gap-5">
              <div className="flex flex-col items-center gap-3 pt-1 font-mono text-[11px] tabular-nums text-zinc-500">
                <span className="text-zinc-900 dark:text-white">{String(active + 1).padStart(2, "0")}</span>
                <div className="relative w-px flex-1 bg-zinc-300/60 dark:bg-white/10">
                  <motion.div className="absolute inset-x-0 top-0 bg-lume" style={{ height: rail }} />
                </div>
                <span>{String(projects.length).padStart(2, "0")}</span>
              </div>
              {current && <StoryFrame project={current} />}
            </div>
          </div>
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-zinc-200/80 pt-8 dark:border-white/10">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            {String(projects.length).padStart(2, "0")} / {String(total).padStart(2, "0")} · {t("portfolio.projects")}
          </span>
          <Magnetic>
            <Link
              href={`/${locale}/projects`}
              data-cursor="All"
              className="group inline-flex items-center gap-3 rounded-full bg-lume px-8 py-4 font-semibold text-zinc-950 shadow-lg shadow-accent-600/30 ring-accent-focus"
            >
              {t("portfolio.seeMoreProjects")}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

function ShowcaseRow({
  project,
  index,
  active,
}: {
  project: ProjectView;
  index: number;
  active: boolean;
}) {
  const locale = useLocale();

  return (
    <li className="flex min-h-[62vh] items-center border-t border-zinc-200/80 first:border-t-0 dark:border-white/[0.07]">
      <motion.div
        className="w-full py-10"
        animate={{ opacity: active ? 1 : 0.28, x: active ? 0 : -8 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <div className="mb-5 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
          <span className="text-accent-600 dark:text-accent-400">{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent-500/70 to-transparent" />
          <span>{project.category}</span>
          {project.gallery.length > 1 && <span>· {project.gallery.length} shots</span>}
        </div>

        <Link href={`/${locale}/projects/${project.slug}`} data-cursor="View" className="group block ring-accent-focus rounded-md">
          <h3 className="text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 dark:text-white xl:text-5xl">
            <span className={active ? "text-lume" : ""}>{project.title}</span>
          </h3>
        </Link>

        <p className="mt-5 line-clamp-3 max-w-md text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 6).map((tag) => (
            <Link
              key={tag}
              href={`/${locale}/projects?tag=${encodeURIComponent(tag)}`}
              className="chip-mono hover:border-accent-500/60 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-6">
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-800 hover:text-accent-600 dark:text-zinc-200 dark:hover:text-accent-400"
          >
            View case <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          {project.link && project.link !== "#" && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Live"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500 hover:text-accent-600 dark:hover:text-accent-400 [&_svg]:h-3.5 [&_svg]:w-3.5"
            >
              Live <Icons.ExternalLink />
            </a>
          )}
        </div>
      </motion.div>
    </li>
  );
}

const STORY_MS = 2800;

/** Sticky preview: curtain-wipes between projects and cycles each gallery. */
function StoryFrame({ project }: { project: ProjectView }) {
  const locale = useLocale();
  const images = project.gallery.length ? project.gallery : project.image ? [project.image] : [];
  const [shot, setShot] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => setShot(0), [project.slug]);
  useEffect(() => {
    if (paused || images.length < 2) return;
    const id = setTimeout(() => setShot((s) => (s + 1) % images.length), STORY_MS);
    return () => clearTimeout(id);
  }, [shot, paused, images.length, project.slug]);

  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      data-cursor="View"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative block flex-1 overflow-hidden rounded-3xl bg-zinc-200 shadow-2xl shadow-black/20 ring-1 ring-black/5 ring-accent-focus dark:bg-zinc-900 dark:ring-white/10"
      aria-label={project.title}
    >
      {/* Project change: new frame wipes up over the previous one */}
      <AnimatePresence initial={false}>
        <motion.div
          key={project.slug}
          className="absolute inset-0"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <AnimatePresence initial={false}>
            {images[shot] && (
              <motion.img
                key={images[shot]}
                src={images[shot]}
                alt={`${project.title} — ${shot + 1}`}
                className="absolute inset-0 h-full w-full object-cover object-top"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: EASE_OUT }}
              />
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Story segments */}
      {images.length > 1 && (
        <div className="absolute inset-x-5 top-5 z-10 flex gap-1.5">
          {images.map((src, i) => (
            <span key={src} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
              <motion.span
                key={`${project.slug}-${shot}-${i}`}
                className="block h-full bg-white"
                initial={{ width: i < shot ? "100%" : "0%" }}
                animate={{ width: i < shot ? "100%" : i === shot ? (paused ? "0%" : "100%") : "0%" }}
                transition={i === shot && !paused ? { duration: STORY_MS / 1000, ease: "linear" } : { duration: 0 }}
              />
            </span>
          ))}
        </div>
      )}

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 p-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.slug}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">{project.category}</p>
            <p className="mt-2 text-2xl font-bold text-white">{project.title}</p>
          </motion.div>
        </AnimatePresence>
        <span className="shrink-0 rounded-full border border-white/25 bg-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-md">
          {String(shot + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>
    </Link>
  );
}

/** Mobile / reduced motion: a plain staggered stack. */
function StackedShowcase({ projects }: { projects: ProjectView[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="portfolio" ref={ref} className="py-24 scroll-mt-28 bg-surface-100/60 dark:bg-surface-950 relative overflow-clip noise">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Header visible={visible} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.08 }}
            >
              <ProjectCard project={project} index={i} />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-lume text-zinc-950 rounded-full font-medium shadow-md ring-accent-focus"
          >
            {t("portfolio.seeMoreProjects")} →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Portfolio;

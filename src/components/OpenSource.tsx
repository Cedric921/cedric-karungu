"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePublicData } from "../hooks";
import { OSS_PROJECTS, type OssData, type OssPr, type OssRepo } from "../lib/oss";
import type { Locale } from "../lib/models/shared";
import snapshot from "../data/oss-snapshot.json";
import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { usePrefersReducedMotion } from "./fx/useReducedMotion";

const PREVIEW = 4; // PRs shown per branch before "show all"

const compact = (n: number, locale: string) =>
  new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: n >= 100_000 ? 0 : 1 }).format(n);
const shortDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" }).format(new Date(iso));

/** Splits a conventional-commit title: "fix(proxy): …" → { type: "fix", scope: "proxy", text: "…" }. */
function parseTitle(title: string) {
  const m = /^(\w+)(?:\(([^)]+)\))?!?:\s*(.+)$/.exec(title);
  return m ? { type: m[1].toLowerCase(), scope: m[2], text: m[3] } : { type: "", scope: "", text: title.replace(/^\[[^\]]+\]\s*/, "") };
}

const TYPE_TONE: Record<string, string> = {
  feat: "bg-accent-500/15 text-accent-600 dark:text-accent-300",
  fix: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  test: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  refactor: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300",
  docs: "bg-line/10 text-muted",
  chore: "bg-line/10 text-muted",
};

const OpenSource: React.FC<{ index: number; total: number }> = ({ index, total }) => {
  const t = useTranslations("oss");
  const locale = useLocale() as Locale;
  const { data } = usePublicData<OssData>("/api/public/oss", snapshot as OssData);

  const repos = useMemo(() => {
    const byRepo = new Map(data.repos.map((r) => [r.repo.toLowerCase(), r]));
    return OSS_PROJECTS.map((p) => ({ ...p, data: byRepo.get(p.repo.toLowerCase()) })).filter(
      (p): p is typeof p & { data: OssRepo } => !!p.data && p.data.prs.length > 0,
    );
  }, [data]);

  const merged = repos.reduce((n, r) => n + r.data.prs.filter((p) => p.state === "merged").length, 0);
  const open = repos.reduce((n, r) => n + r.data.prs.filter((p) => p.state === "open").length, 0);
  const stars = repos.reduce((n, r) => n + r.data.stars, 0);

  return (
    <Section id="open-source" index={index} total={total} label={t("nav")} intro={t("description")} title={t("title")}>
      {/* Headline numbers */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border hairline bg-line/10 md:grid-cols-4">
        <Stat value={merged} label={t("merged")} tone="text-accent-500" icon={<MergeIcon />} />
        <Stat value={open} label={t("inReview")} tone="text-highlight-500" icon={<OpenIcon />} />
        <Stat value={repos.length} label={t("projects")} tone="text-ink" icon={<RepoIcon />} />
        <Stat value={stars} label={t("stars")} tone="text-ink" icon={<span aria-hidden="true">★</span>} format={(n) => compact(n, locale)} />
      </div>
      <p className="mt-3 flex items-center gap-2 font-mono text-[11px] text-faint">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        {t("live", { date: new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(data.updatedAt)) })}
      </p>

      <ol className="mt-10 space-y-6">
        {repos.map((r, i) => (
          <Reveal as="li" key={r.repo} delay={Math.min(i, 3) * 0.05}>
            <RepoCard project={r} repo={r.data} locale={locale} />
          </Reveal>
        ))}
      </ol>
    </Section>
  );
};

/* ———————————————————————— pieces ———————————————————————— */

function Stat({
  value,
  label,
  tone,
  icon,
  format = String,
}: {
  value: number;
  label: string;
  tone: string;
  icon: React.ReactNode;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = usePrefersReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) return setShown(value);
    const c = animate(0, value, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
  }, [inView, value, reduce]);

  return (
    <div ref={ref} className="bg-canvas p-5 md:p-6">
      <p className={`flex items-center gap-2 whitespace-nowrap font-display text-4xl font-bold tracking-tight tabular-nums md:text-[2.6rem] xl:text-5xl ${tone}`}>
        {format(shown)}
        <span className="text-base opacity-70 [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      </p>
      <p className="label mt-2">{label}</p>
    </div>
  );
}

type Project = (typeof OSS_PROJECTS)[number];

function RepoCard({ project, repo, locale }: { project: Project; repo: OssRepo; locale: Locale }) {
  const t = useTranslations("oss");
  const merged = repo.prs.filter((p) => p.state === "merged");
  const open = repo.prs.filter((p) => p.state === "open");
  const ratio = merged.length / repo.prs.length;

  return (
    <article
      data-inspect={`<Repo name="${project.name}" prs={${repo.prs.length}} />`}
      className="group/card rounded-2xl border hairline bg-raised/40 p-5 transition-colors hover:border-accent-500/30 md:p-7"
    >
      <header className="flex flex-wrap items-start gap-4">
        <img src={repo.avatar} alt="" width={44} height={44} loading="lazy" className="h-11 w-11 rounded-xl border hairline bg-canvas object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="font-display text-2xl font-bold tracking-tight text-ink">{project.name}</h3>
            <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-highlight-500/30 bg-highlight-500/10 px-2 py-0.5 font-mono text-[11px] text-highlight-600 dark:text-highlight-300">
              ★ {compact(repo.stars, locale)}
            </span>
          </div>
          <a href={`https://github.com/${repo.repo}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-faint hover:text-ink">
            {repo.repo}
          </a>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          {project.blogSlug && (
            <a href={`/${locale}/blog/${project.blogSlug}`} className="chip whitespace-nowrap">
              {t("story")} →
            </a>
          )}
          <a
            href={`https://github.com/${repo.repo}/pulls?q=is%3Apr+author%3ACedric921`}
            target="_blank"
            rel="noopener noreferrer"
            className="chip whitespace-nowrap"
          >
            {t("allPrs")} ↗
          </a>
        </div>
      </header>

      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">{project.description[locale]}</p>

      {/* Merged vs in review */}
      <div className="mt-5">
        <div className="flex h-2 overflow-hidden rounded-full bg-line/10">
          <motion.span
            className="h-full bg-accent-500"
            initial={{ width: 0 }}
            whileInView={{ width: `${ratio * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            className="h-full bg-[repeating-linear-gradient(135deg,rgb(245_158_11/0.75)_0_4px,rgb(245_158_11/0.35)_4px_8px)]"
            initial={{ width: 0 }}
            whileInView={{ width: `${(1 - ratio) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-faint">
          <span>
            <span className="text-accent-500">● {merged.length} {t("merged")}</span>
            <span className="mx-2">·</span>
            <span className="text-highlight-500">◌ {open.length} {t("inReview")}</span>
          </span>
          <Activity prs={repo.prs} />
        </div>
      </div>

      {/* PR tree */}
      <div className="mt-6 rounded-xl border hairline bg-canvas/60 p-4 font-mono text-[13px] md:p-5">
        <p className="flex items-center gap-2 text-ink">
          <BranchIcon />
          <span>{repo.repo.split("/")[1]}</span>
          <span className="text-faint">/ {t("myPrs")}</span>
        </p>
        <ul className="mt-2">
          {merged.length > 0 && <Branch kind="merged" prs={merged} last={open.length === 0} locale={locale} />}
          {open.length > 0 && <Branch kind="open" prs={open} last locale={locale} />}
        </ul>
      </div>
    </article>
  );
}

/** One branch of the tree ("merged" or "in review"), collapsible. */
function Branch({ kind, prs, last, locale }: { kind: "merged" | "open"; prs: OssPr[]; last: boolean; locale: string }) {
  const t = useTranslations("oss");
  const [open, setOpen] = useState(true);
  const [all, setAll] = useState(false);
  const shown = all ? prs : prs.slice(0, PREVIEW);
  const tone = kind === "merged" ? "text-accent-500" : "text-highlight-500";

  return (
    <li className={`tree-node ${last ? "tree-last" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2 py-1.5 text-left hover:text-ink"
      >
        <span className={`inline-block transition-transform duration-300 ${open ? "rotate-90" : ""} text-faint`}>▸</span>
        <span className={tone}>{kind === "merged" ? <MergeIcon /> : <OpenIcon />}</span>
        <span className="text-ink">{kind === "merged" ? t("merged") : t("inReview")}</span>
        <span className={`rounded-full px-1.5 text-[11px] ${kind === "merged" ? "bg-accent-500/15 text-accent-500" : "bg-highlight-500/15 text-highlight-500"}`}>
          {prs.length}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="ml-[7px] overflow-hidden"
          >
            {shown.map((pr, i) => (
              <PrRow key={pr.number} pr={pr} index={i} last={i === shown.length - 1 && prs.length <= PREVIEW} locale={locale} />
            ))}
            {prs.length > PREVIEW && (
              <li className="tree-node tree-last">
                <button type="button" onClick={() => setAll((a) => !a)} className="py-1.5 text-faint hover:text-ink">
                  {all ? t("showLess") : t("showAll", { n: prs.length })}
                </button>
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

function PrRow({ pr, index, last, locale }: { pr: OssPr; index: number; last: boolean; locale: string }) {
  const { type, scope, text } = parseTitle(pr.title);
  const date = pr.state === "merged" && pr.mergedAt ? pr.mergedAt : pr.createdAt;
  return (
    <motion.li
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index, 12) * 0.03 }}
      className={`tree-node ${last ? "tree-last" : ""}`}
    >
      <a
        href={pr.url}
        target="_blank"
        rel="noopener noreferrer"
        title={pr.title}
        className="-mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-line/5"
      >
        <span className={pr.state === "merged" ? "text-accent-500" : "text-highlight-500"}>
          {pr.state === "merged" ? <MergeIcon /> : <OpenIcon pulse />}
        </span>
        <span className="shrink-0 text-faint">#{pr.number}</span>
        {type && (
          <span className={`hidden shrink-0 rounded px-1.5 text-[11px] sm:inline ${TYPE_TONE[type] ?? "bg-line/10 text-muted"}`}>
            {type}
            {scope && <span className="opacity-70">({scope})</span>}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate font-sans text-[13.5px] text-muted group-hover/card:text-ink/90">{text}</span>
        <span className="hidden shrink-0 text-[11px] text-faint md:inline">{shortDate(date, locale)}</span>
      </a>
    </motion.li>
  );
}

/** Weekly activity over the last 12 weeks: merged on top of in-review. */
function Activity({ prs }: { prs: OssPr[] }) {
  const WEEKS = 12;
  const now = Date.now();
  const weeks = Array.from({ length: WEEKS }, () => ({ merged: 0, open: 0 }));
  for (const p of prs) {
    const w = Math.floor((now - new Date(p.createdAt).getTime()) / (7 * 86_400_000));
    if (w >= 0 && w < WEEKS) weeks[WEEKS - 1 - w][p.state === "merged" ? "merged" : "open"]++;
  }
  const max = Math.max(1, ...weeks.map((w) => w.merged + w.open));
  return (
    <span className="flex h-5 items-end gap-[3px]" aria-hidden="true">
      {weeks.map((w, i) => (
        <span key={i} className="flex w-1.5 flex-col-reverse overflow-hidden rounded-sm bg-line/10" style={{ height: "100%" }}>
          <motion.span
            className="w-full bg-accent-500"
            initial={{ height: 0 }}
            whileInView={{ height: `${(w.merged / max) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.03 }}
          />
          <motion.span
            className="w-full bg-highlight-500/80"
            initial={{ height: 0 }}
            whileInView={{ height: `${(w.open / max) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.03 + 0.1 }}
          />
        </span>
      ))}
    </span>
  );
}

/* ———————————————————————— icons (Octicons-style) ———————————————————————— */

function MergeIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z" />
    </svg>
  );
}

function OpenIcon({ pulse = false }: { pulse?: boolean }) {
  return (
    <span className="relative inline-flex">
      {pulse && <span className="absolute inset-0 animate-ping rounded-full bg-highlight-500/30 motion-reduce:animate-none" />}
      <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true" className="relative">
        <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
      </svg>
    </span>
  );
}

function RepoIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
    </svg>
  );
}

function BranchIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true" className="text-faint">
      <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
    </svg>
  );
}

export default OpenSource;

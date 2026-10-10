"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { ArticleView } from "../../lib/public-data";
import SiteShell from "../SiteShell";
import Reveal from "../ui/Reveal";
import { useScramble } from "../fx/Scramble";
import { spotlightMove } from "../fx/useSpotlight";
import { formatDate } from "./format";

const GRID = "grid gap-8 md:grid-cols-[200px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[240px_minmax(0,1fr)]";

/** /blog — every published article, filterable by tag. */
export default function BlogIndex({ articles }: { articles: ArticleView[] }) {
  const t = useTranslations("blog");
  const [tag, setTag] = useState("");

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    articles.forEach((a) => a.tags.forEach((tg) => counts.set(tg, (counts.get(tg) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tg]) => tg);
  }, [articles]);
  const visible = tag ? articles.filter((a) => a.tags.includes(tag)) : articles;

  return (
    <SiteShell>
      <div className="wrap pt-32 pb-24 md:pt-40">
        <header className={GRID}>
          <p className="label flex items-center gap-2 md:pt-4">
            <span className="inline-block h-1.5 w-1.5 bg-accent-500" aria-hidden="true" />
            {t("nav")} · {String(articles.length).padStart(2, "0")}
          </p>
          <div>
            <h1 className="h-display text-5xl leading-[0.95] md:text-7xl">{t("title")}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{t("description")}</p>
          </div>
        </header>

        {tags.length > 0 && (
          <div className={`mt-14 border-y hairline py-6 ${GRID}`}>
            <span className="label pt-1">Tags</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setTag("")} aria-pressed={!tag} className={`chip ${!tag ? "!border-accent-500 !bg-accent-500 !text-white" : ""}`}>
                {t("all")}
              </button>
              {tags.map((tg) => (
                <button
                  key={tg}
                  onClick={() => setTag(tg === tag ? "" : tg)}
                  aria-pressed={tg === tag}
                  className={`chip ${tg === tag ? "!border-accent-500 !bg-accent-500 !text-white" : ""}`}
                >
                  {tg}
                </button>
              ))}
            </div>
          </div>
        )}

        {visible.length === 0 ? (
          <p className="mt-20 text-center text-muted">{t("empty")}</p>
        ) : (
          <ol className="mt-10 divide-y divide-line/10 border-b hairline">
            {visible.map((a, i) => (
              <Reveal as="li" key={a.slug} delay={Math.min(i, 4) * 0.04}>
                <ArticleRow article={a} />
              </Reveal>
            ))}
          </ol>
        )}
      </div>
    </SiteShell>
  );
}

/**
 * One list row. `compact` (landing teaser, already inside a section column)
 * puts the date above the title instead of in its own column.
 */
export function ArticleRow({ article: a, compact = false }: { article: ArticleView; compact?: boolean }) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const { display, run } = useScramble(a.title, 450);

  return (
    <Link
      href={`/${locale}/blog/${a.slug}`}
      onMouseEnter={() => run(a.title)}
      onPointerMove={spotlightMove}
      data-inspect={`<Article minutes={${a.minutes}} />`}
      className={`spotlight group -mx-4 rounded-2xl px-4 py-8 ${compact ? "block" : GRID}`}
    >
      <div className={`font-mono text-xs leading-relaxed text-faint ${compact ? "mb-3 flex gap-3" : "md:pt-1.5"}`}>
        <p>{formatDate(a.date, locale)}</p>
        <p>{compact && "· "}{t("minRead", { n: a.minutes })}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_180px]">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink transition-colors group-hover:text-accent-500 md:text-3xl">
            <span aria-label={a.title}>
              <span aria-hidden="true">{display}</span>
            </span>{" "}
            <span aria-hidden="true" className="inline-block text-lg text-faint transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent-500">
              ↗
            </span>
          </h2>
          {a.excerpt && <p className="mt-3 line-clamp-2 max-w-2xl text-[15px] leading-relaxed text-muted">{a.excerpt}</p>}
          {a.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {a.tags.slice(0, 4).map((tg) => (
                <li key={tg} className="chip">
                  {tg}
                </li>
              ))}
            </ul>
          )}
        </div>
        {a.cover && (
          <div className="hidden self-start overflow-hidden rounded-xl border hairline bg-raised sm:block">
            <img src={a.cover} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        )}
      </div>
    </Link>
  );
}

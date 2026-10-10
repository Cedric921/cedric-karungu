"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GithubSlugger from "github-slugger";
import { useLocale, useTranslations } from "next-intl";
import type { ArticleView } from "../../lib/public-data";
import SiteShell from "../SiteShell";
import Markdown from "../Markdown";
import MagneticLetters from "../fx/MagneticLetters";
import { formatDate } from "./format";

const GRID = "grid gap-8 md:grid-cols-[200px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[240px_minmax(0,1fr)]";

/** h2/h3 headings with the same ids rehype-slug generates. */
function useHeadings(markdown: string) {
  return useMemo(() => {
    const slugger = new GithubSlugger();
    const out: { id: string; text: string; level: 2 | 3 }[] = [];
    let inCode = false;
    for (const line of markdown.split("\n")) {
      if (line.trim().startsWith("```")) inCode = !inCode;
      if (inCode) continue;
      const m = /^(##|###)\s+(.+?)\s*#*$/.exec(line);
      if (m) {
        const text = m[2].replace(/[*_`[\]]/g, "").replace(/\(.*?\)/g, "");
        out.push({ id: slugger.slug(text), text, level: m[1].length as 2 | 3 });
      }
    }
    return out;
  }, [markdown]);
}

export default function ArticlePage({
  article: a,
  prev,
  next,
}: {
  article: ArticleView;
  prev: ArticleView | null;
  next: ArticleView | null;
}) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const headings = useHeadings(a.content);
  const [activeId, setActiveId] = useState("");
  const [copied, setCopied] = useState(false);

  // Highlight the section currently being read.
  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((x, y) => x.boundingClientRect.top - y.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <SiteShell>
      <article className="pt-28 md:pt-36">
        <header className={`wrap ${GRID}`}>
          <div className="space-y-3 md:pt-4">
            <Link href={`/${locale}/blog`} className="link-quiet text-sm text-muted">
              ← {t("back")}
            </Link>
            <p className="font-mono text-xs leading-relaxed text-faint">
              {formatDate(a.date, locale)}
              <br />
              {t("minRead", { n: a.minutes })}
            </p>
          </div>
          <div>
            {a.tags.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {a.tags.map((tg) => (
                  <li key={tg} className="chip">
                    {tg}
                  </li>
                ))}
              </ul>
            )}
            <h1 className="h-display mt-5 max-w-4xl text-[clamp(2.4rem,6vw,4.75rem)] leading-[1]">
              <MagneticLetters text={a.title} />
            </h1>
            {a.excerpt && <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">{a.excerpt}</p>}
          </div>
        </header>

        {a.cover && (
          <div className="wrap mt-12 md:mt-16">
            <img src={a.cover} alt="" className="aspect-[2/1] w-full rounded-2xl border hairline object-cover" />
          </div>
        )}

        <div className={`wrap mt-14 md:mt-20 ${GRID}`}>
          {/* Sticky table of contents + share */}
          <aside className="hidden md:block">
            <div className="sticky top-28 space-y-6">
              {headings.length > 1 && (
                <nav aria-label={t("contents")}>
                  <p className="label">{t("contents")}</p>
                  <ol className="mt-3 space-y-2 border-l hairline text-sm">
                    {headings.map((h) => (
                      <li key={h.id} className={h.level === 3 ? "pl-6" : "pl-3"}>
                        <a
                          href={`#${h.id}`}
                          className={`-ml-px block border-l-2 pl-3 transition-colors ${
                            activeId === h.id ? "border-accent-500 text-ink" : "border-transparent text-muted hover:text-ink"
                          }`}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              <button type="button" onClick={copy} className="link-quiet text-sm text-muted">
                {copied ? `${t("copied")} ✓` : t("copyLink")}
              </button>
            </div>
          </aside>

          <div className="min-w-0 max-w-[70ch]">
            {a.contentLocale !== locale && (
              <p className="mb-8 rounded-lg border border-accent-500/30 bg-accent-500/5 px-4 py-3 text-sm text-muted">{t("onlyEnglish")}</p>
            )}
            <Markdown>{a.content}</Markdown>
          </div>
        </div>

        {(prev || next) && (
          <nav className="wrap mt-24 grid border-t hairline sm:grid-cols-2">
            {[
              { item: prev, label: t("prev"), arrow: "←", align: "" },
              { item: next, label: t("next"), arrow: "→", align: "sm:text-right" },
            ].map(({ item, label, arrow, align }) =>
              item ? (
                <Link key={label} href={`/${locale}/blog/${item.slug}`} className={`group py-10 ${align}`}>
                  <p className="label">
                    {arrow === "←" && `${arrow} `}
                    {label}
                    {arrow === "→" && ` ${arrow}`}
                  </p>
                  <p className="mt-3 font-display text-2xl font-bold tracking-tight text-ink transition-colors group-hover:text-accent-500">
                    {item.title}
                  </p>
                </Link>
              ) : (
                <span key={label} />
              ),
            )}
          </nav>
        )}
      </article>
    </SiteShell>
  );
}

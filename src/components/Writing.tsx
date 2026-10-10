"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { ArticleView } from "../lib/public-data";
import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { ArticleRow } from "./blog/BlogIndex";

/** Landing teaser: the three latest articles (rendered only when there are some). */
export default function Writing({ articles, index, total }: { articles: ArticleView[]; index: number; total: number }) {
  const t = useTranslations("blog");
  const locale = useLocale();
  if (!articles.length) return null;
  return (
    <Section id="writing" index={index} total={total} label={t("nav")} intro={t("description")} title={t("latest")}>
      <ol className="divide-y divide-line/10 border-y hairline">
        {articles.slice(0, 3).map((a, i) => (
          <Reveal as="li" key={a.slug} delay={i * 0.05}>
            <ArticleRow article={a} compact />
          </Reveal>
        ))}
      </ol>
      <div className="mt-10 flex justify-end">
        <Link href={`/${locale}/blog`} className="btn-ghost">
          {t("seeAll")} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </Section>
  );
}

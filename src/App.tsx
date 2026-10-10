"use client";

import React, { useMemo } from "react";
import { useLocale } from "next-intl";
import { Hero, AboutMe, Skills, Portfolio, Experience, Contact } from "./components";
import SiteShell from "./components/SiteShell";
import Writing from "./components/Writing";
import { SectionTotalContext } from "./components/ui/Section";
import { usePublicData } from "./hooks";
import { articleToView, type ArticleItem } from "./lib/public-data";
import type { Locale } from "./lib/models/shared";

const NO_ARTICLES: ArticleItem[] = [];

const App: React.FC = () => {
  const locale = useLocale() as Locale;
  const { data } = usePublicData<ArticleItem[]>("/api/public/articles", NO_ARTICLES);
  const articles = useMemo(() => data.map((a) => articleToView(a, locale)), [data, locale]);
  // Writing slots in as section 05 (before Contact) once something is published.
  const total = articles.length ? 6 : 5;

  return (
    <SectionTotalContext.Provider value={total}>
      <SiteShell>
        <Hero />
        <AboutMe />
        <Skills />
        <Portfolio />
        <Experience />
        <Writing articles={articles} index={5} total={total} />
        <Contact />
      </SiteShell>
    </SectionTotalContext.Provider>
  );
};

export default App;

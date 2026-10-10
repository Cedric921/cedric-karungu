"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { EXPERIENCES } from "../constants";
import { usePublicData } from "../hooks";
import { experienceToView, pick, type ExperienceItem } from "../lib/public-data";
import type { Locale } from "../lib/models/shared";
import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { SECTION_TOTAL } from "./AboutMe";
import { shortHash } from "./fx/hash";

const isCurrent = (period: string) => /present|présent|presente|now|actuel/i.test(period);

/** Sort key from a free-text period ("Dec 2018 - Sep 2021", "Nov 2023 - Present"). */
function periodKey(period: string): [number, number] {
  const years = (period.match(/\b(19|20)\d{2}\b/g) || []).map(Number);
  const start = years[0] ?? 0;
  const end = isCurrent(period) ? 9999 : (years[years.length - 1] ?? start);
  return [end, start];
}

const Experience: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { data } = usePublicData<ExperienceItem[]>("/api/public/experiences", EXPERIENCES as unknown as ExperienceItem[]);

  // Most recent first, whatever order the items are stored in.
  const items = useMemo(() => {
    const views = data.map((e) => ({ v: experienceToView(e, locale), k: periodKey(pick(e.period, "en")) }));
    return views.sort((a, b) => b.k[0] - a.k[0] || b.k[1] - a.k[1]).map(({ v }) => v);
  }, [data, locale]);

  return (
    <Section
      id="experience"
      index={4}
      total={SECTION_TOTAL}
      label={t("nav.experience")}
      intro={t("experience.description")}
      title={t("experience.title")}
    >
      <Timeline items={items} />
    </Section>
  );
};

type Item = { key: string; role: string; company: string; period: string; location: string; description: string };

/** Career as a `git log --graph`: the branch draws itself with the scroll and each commit lights up as it passes. */
function Timeline({ items }: { items: Item[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.65", "end 0.65"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <ol ref={ref} data-inspect="git log --graph" className="relative border-y hairline pl-7 md:pl-10">
      <span aria-hidden="true" className="absolute bottom-0 left-[3px] top-0 w-px bg-line/10" />
      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 left-[3px] top-0 w-px origin-top bg-accent-500"
        style={{ scaleY }}
      />
      {items.map((e, i) => (
        <TimelineRow key={e.key} item={e} index={i} />
      ))}
    </ol>
  );
}

function TimelineRow({ item: e, index }: { item: Item; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const [lit, setLit] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Lit once the row's top passes 65% of the viewport (same line as the rail fill).
    const io = new IntersectionObserver(([en]) => setLit(en.boundingClientRect.top < window.innerHeight * 0.65), {
      rootMargin: "0px 0px -35% 0px",
      threshold: [0, 1],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Reveal
      as="li"
      delay={Math.min(index, 4) * 0.04}
      className="group relative grid gap-3 border-t hairline py-8 first:border-t-0 md:grid-cols-[170px_minmax(0,1fr)] md:gap-8"
    >
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        aria-hidden="true"
        className={`absolute -left-[32px] top-9 grid h-[15px] w-[15px] place-items-center rounded-full border-2 transition-all duration-500 md:-left-[44px] ${
          lit ? "border-accent-500 bg-canvas shadow-[0_0_0_5px_rgb(139_92_246/0.12)]" : "border-line/25 bg-canvas"
        }`}
      >
        <span className={`h-[5px] w-[5px] rounded-full transition-all duration-500 ${lit ? "bg-accent-500" : "bg-transparent"}`} />
      </span>
      <div className="font-mono text-xs leading-relaxed text-faint">
        <p className="flex flex-wrap items-center gap-x-2">
          <span className="text-highlight-500/90">{shortHash(`${e.company}${e.role}`)}</span>
          {isCurrent(e.period) && (
            <span className="rounded border border-accent-500/40 px-1 text-[10px] text-accent-500">HEAD → main</span>
          )}
        </p>
        <p className={`mt-1 ${isCurrent(e.period) ? "text-ink" : ""}`}>{e.period}</p>
        <p>{e.location}</p>
      </div>
      <div>
        <h3 className="font-display text-xl font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent-500 md:text-2xl">
          {e.role}
        </h3>
        <p className="mt-1 text-sm text-muted">{e.company}</p>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">{e.description}</p>
      </div>
    </Reveal>
  );
}

export default Experience;

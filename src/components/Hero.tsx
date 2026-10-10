"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { EXPERIENCES } from "../constants";
import { usePublicData, useSiteContent } from "../hooks";
import { experienceToView, type ExperienceItem } from "../lib/public-data";
import StackedName from "./fx/StackedName";
import TypeLoop from "./fx/TypeLoop";
import FlipAvatar from "./fx/FlipAvatar";
import RollText from "./fx/RollText";
import type { Locale } from "../lib/models/shared";

const resumePdf = "/document/Ced CV.pdf";
const EASE = [0.22, 1, 0.36, 1] as const;

/** "CEDRIC KARUNGU" → "Cedric Karungu" (content may be stored in caps). */
const titleCase = (s: string) =>
  s === s.toUpperCase() ? s.toLowerCase().replace(/(^|[\s-])\p{L}/gu, (m) => m.toUpperCase()) : s;

function useClock(timeZone: string) {
  const [now, setNow] = useState<string[]>([]);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone });
    const tick = () => setNow(fmt.format(new Date()).split(":"));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);
  return now;
}

const Hero: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const content = useSiteContent();
  const reduce = useReducedMotion();
  const tr = (key: string) => content.get(key) ?? t(key);
  const time = useClock("Africa/Kigali");

  const { data: experiences } = usePublicData<ExperienceItem[]>(
    "/api/public/experiences",
    EXPERIENCES as unknown as ExperienceItem[],
  );
  const current = useMemo(() => {
    const views = experiences.map((e) => experienceToView(e, locale));
    return views.find((v) => /present|présent|presente|now|actuel/i.test(v.period)) ?? views[views.length - 1];
  }, [experiences, locale]);

  const [role, ...stack] = tr("hero.titles.0").split("|").map((s) => s.trim()).filter(Boolean);
  const name = titleCase(tr("hero.name"));

  const fade = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay: 0.08 * i },
  });

  const links = [
    { label: tr("hero.downloadResume"), href: resumePdf, download: "Ced-CV.pdf" },
    { label: "GitHub", href: "https://github.com/Cedric921" },
    { label: "LinkedIn", href: "https://linkedin.com/in/cedric-karungu" },
    { label: "ckarungu921@gmail.com", href: "mailto:ckarungu921@gmail.com" },
  ];

  return (
    <section id="home" className="pt-28 pb-20 md:pt-40 md:pb-28">
      <div className="wrap grid gap-12 md:grid-cols-[200px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Profile column */}
        <motion.aside {...fade(0)} className="order-2 space-y-6 md:order-1 md:pt-4">
          <FlipAvatar src="/images/VB/cedric.png" alt={name} nickname={tr("hero.nickname")} />
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="label">{tr("footer.location")}</dt>
              <dd className="mt-1 font-mono text-xs text-muted tabular-nums">
                {time.length ? (
                  <>
                    {time[0]}
                    <span className="animate-pulse">:</span>
                    {time[1]}
                    <span className="text-faint">:{time[2]}</span>
                  </>
                ) : (
                  "--:--"
                )}{" "}
                {t("ui.localTime")}
              </dd>
            </div>
            {current && (
              <div>
                <dt className="label">{t("ui.currently")}</dt>
                <dd className="mt-1 text-ink">
                  {current.role}
                  <span className="block text-muted">{current.company}</span>
                </dd>
              </div>
            )}
            <div>
              <dt className="label">{t("ui.status")}</dt>
              <dd className="mt-1 flex items-center gap-2 text-ink">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {tr("hero.available")}
              </dd>
            </div>
          </dl>
        </motion.aside>

        {/* Main column */}
        <div className="order-1 min-w-0 md:order-2">
          <motion.p {...fade(1)} className="label mb-5">
            {tr("hero.nickname")} — {role}
          </motion.p>

          <motion.div {...fade(1)} data-inspect="<FullStack layers={3} />" className="w-fit pr-14">
            <StackedName
              lines={name.split(" ").length > 1 ? [name.split(" ")[0], name.split(" ").slice(1).join(" ")] : [name]}
              className="h-display text-[clamp(3.2rem,10vw,7.5rem)] leading-[0.9]"
            />
          </motion.div>

          <motion.p {...fade(2)} className="mt-7 font-display text-2xl font-semibold tracking-tight text-muted md:text-[2.6rem] md:leading-tight">
            {t("ui.iBuild")}{" "}
            <TypeLoop words={t.raw("ui.builds") as string[]} className="accent-serif text-[1.12em]" />
          </motion.p>

          {stack.length > 0 && (
            <motion.ul {...fade(3)} className="mt-6 flex flex-wrap gap-2">
              {stack.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </motion.ul>
          )}

          <motion.p {...fade(4)} className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            {tr("hero.description")}
          </motion.p>

          <motion.div {...fade(5)} className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#portfolio" className="btn-primary group">
              <RollText accent={false}>{tr("hero.viewWork")}</RollText> <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">↓</span>
            </a>
            <a href={resumePdf} download="Ced-CV.pdf" className="btn-ghost group">
              <RollText>{tr("hero.downloadResume")}</RollText> <span aria-hidden="true">↗</span>
            </a>
          </motion.div>

          <motion.ul {...fade(6)} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {links.slice(1).map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group text-muted"
                >
                  <RollText>{l.label}</RollText>
                </a>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
};

export default Hero;

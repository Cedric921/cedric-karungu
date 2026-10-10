"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { SKILLS } from "../constants";
import { usePublicData } from "../hooks";
import type { SkillItem } from "../lib/public-data";
import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { SECTION_TOTAL } from "./AboutMe";

/** Rough fill for the hover bar, from the free-text level. */
const LEVEL: Record<string, number> = { beginner: 25, intermediate: 55, advanced: 80, expert: 100 };
const levelPct = (level: string) => LEVEL[level.trim().toLowerCase()] ?? 60;

const Skills: React.FC = () => {
  const t = useTranslations();
  const { data: skills } = usePublicData<SkillItem[]>("/api/public/skills", SKILLS as unknown as SkillItem[]);

  // Group by category, keeping the known ones first and any new admin categories after.
  const groups = useMemo(() => {
    const known: Record<string, string> = {
      "Front End": t("skills.frontEnd"),
      "Back End": t("skills.backEnd"),
      "A.I": t("skills.ai"),
    };
    const order = [...Object.keys(known), ...new Set(skills.map((s) => s.category).filter((c) => !(c in known)))];
    return order
      .map((cat) => ({ cat, label: known[cat] ?? cat, items: skills.filter((s) => s.category === cat) }))
      .filter((g) => g.items.length);
  }, [skills, t]);

  return (
    <Section id="skills" index={2} total={SECTION_TOTAL} label={t("nav.skills")} intro={t("skills.description")} title={t("skills.title")}>
      <div className="divide-y divide-line/10 border-y hairline">
        {groups.map((g, gi) => (
          <Reveal key={g.cat} delay={gi * 0.05} className="grid gap-4 py-8 md:grid-cols-[160px_minmax(0,1fr)]">
            <h3 className="label pt-1.5">{g.label}</h3>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((s) => (
                <li
                  key={s.name}
                  data-inspect={`${s.name} — ${s.level}`}
                  className="group/skill relative flex cursor-default items-center gap-3 rounded-md pb-2 transition-transform duration-300 hover:translate-x-1"
                >
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line/5" />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-px origin-left scale-x-0 bg-accent-500 transition-transform duration-700 ease-out group-hover/skill:scale-x-100"
                    style={{ width: `${levelPct(s.level)}%` }}
                  />
                  {s.logoUrl ? (
                    <img src={s.logoUrl} alt="" loading="lazy" className="h-5 w-5 shrink-0 object-contain opacity-60 transition duration-300 [filter:brightness(0)] group-hover/skill:rotate-[-8deg] group-hover/skill:scale-125 group-hover/skill:opacity-100 group-hover/skill:[filter:none] dark:[filter:brightness(0)_invert(1)] dark:group-hover/skill:[filter:none]" />
                  ) : (
                    <span className="h-5 w-5 shrink-0 rounded bg-line/10" />
                  )}
                  <span className="text-[15px] text-ink transition-colors group-hover/skill:text-accent-500">{s.name}</span>
                  <span className="ml-auto font-mono text-[11px] text-faint">{s.level}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

export default Skills;

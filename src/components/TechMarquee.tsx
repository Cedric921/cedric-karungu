import React from "react";
import { SKILLS } from "../constants";
import { usePublicData } from "../hooks";
import type { SkillItem } from "../lib/public-data";
import Marquee from "./motion/Marquee";

/** Two counter-scrolling bands of the stack; speed follows scroll velocity. */
const TechMarquee: React.FC = () => {
  const { data: skills } = usePublicData<SkillItem[]>("/api/public/skills", SKILLS as SkillItem[]);
  const names = skills.map((s) => s.name);
  const half = Math.ceil(names.length / 2);

  const band = (items: string[], outline: boolean) =>
    items.map((name) => (
      <span key={name} className="flex items-center">
        <span
          className={`px-6 text-4xl font-bold tracking-tight md:text-6xl ${
            outline
              ? "text-transparent [-webkit-text-stroke:1px_rgba(113,113,122,0.55)] dark:[-webkit-text-stroke:1px_rgba(255,255,255,0.28)]"
              : "text-zinc-900 dark:text-white"
          }`}
        >
          {name}
        </span>
        <span className="text-2xl text-accent-500 md:text-4xl" aria-hidden="true">
          ✦
        </span>
      </span>
    ));

  return (
    <section
      aria-label="Tech stack"
      className="relative overflow-hidden border-y border-zinc-200/70 bg-surface-50 py-8 dark:border-white/[0.06] dark:bg-surface-950 md:py-12"
    >
      <div className="-rotate-1 space-y-4">
        <Marquee baseVelocity={-0.8}>{band(names.slice(0, half), false)}</Marquee>
        <Marquee baseVelocity={0.8}>{band(names.slice(half), true)}</Marquee>
      </div>
    </section>
  );
};

export default TechMarquee;

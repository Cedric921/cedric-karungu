"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSiteContent } from "../hooks";
import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import ScrollWords from "./fx/ScrollWords";

export const SECTION_TOTAL = 5;

const AboutMe: React.FC = () => {
  const t = useTranslations();
  const content = useSiteContent();
  const tr = (key: string) => content.get(key) ?? t(key);

  const facts = [
    { k: t("ui.experience"), v: tr("about.experience") },
    { k: t("ui.status"), v: tr("about.freelance") },
    { k: t("ui.basedIn"), v: tr("about.location") },
    { k: t("ui.languages"), v: tr("about.languages") },
  ];

  return (
    <Section
      id="about"
      index={1}
      total={SECTION_TOTAL}
      label={t("nav.about")}
      intro={`${tr("about.role")} ${tr("about.separator")} ${tr("about.projectManager")}`}
      title={tr("about.mainTitle")}
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-6">
          {/* First paragraph lights up word by word with the scroll */}
          <ScrollWords text={tr("about.bio1")} className="text-xl leading-relaxed text-ink md:text-2xl md:leading-relaxed" />
          {[tr("about.bio2"), tr("about.bio3")].map((p, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className="text-base leading-relaxed text-muted md:text-lg">{p}</p>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <dl className="divide-y divide-line/10 border-y hairline">
            {facts.map((f) => (
              <div key={f.k} className="group py-4 transition-[padding] duration-300 hover:pl-2">
                <dt className="label">{f.k}</dt>
                <dd className="mt-1 text-sm text-ink">{f.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
};

export default AboutMe;

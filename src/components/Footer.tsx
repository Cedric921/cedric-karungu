"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePublicData } from "../hooks";
import type { SocialLinkItem } from "../lib/public-data";
import Logo from "./ui/Logo";

const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  { label: "GitHub", url: "https://github.com/Cedric921", icon: "Github" },
  { label: "LinkedIn", url: "https://linkedin.com/in/cedric-karungu", icon: "Linkedin" },
  { label: "Email", url: "mailto:ckarungu921@gmail.com", icon: "Mail" },
];

const Footer: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();
  const { data: socials } = usePublicData<SocialLinkItem[]>("/api/public/social-links", DEFAULT_SOCIAL_LINKS);

  const nav = [
    { id: "about", label: t("nav.about") },
    { id: "skills", label: t("nav.skills") },
    { id: "portfolio", label: t("nav.projects") },
    { id: "experience", label: t("nav.experience") },
    { id: "contact", label: t("nav.contact") },
  ];

  return (
    <footer className="border-t hairline">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[200px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted">{t("footer.role")}</p>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          <p className="text-sm leading-relaxed text-muted sm:col-span-3 lg:col-span-1">{t("footer.tagline")}</p>
          <div>
            <p className="label">{t("ui.index")}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`/${locale}#${n.id}`} className="link text-muted">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`/${locale}/projects`} className="link text-muted">
                  {t("ui.allProjects")}
                </a>
              </li>
              <li>
                <a href={`/${locale}/blog`} className="link text-muted">
                  {t("nav.blog")}
                </a>
              </li>
              <li>
                <a href={`/${locale}/blog/rss.xml`} className="link text-muted">
                  RSS
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="label">{t("ui.findMe")}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {socials.map((s) => {
                const external = !s.url.startsWith("mailto:");
                return (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="link text-muted"
                    >
                      {s.label} {external && <span aria-hidden="true">↗</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="wrap flex flex-col gap-3 border-t hairline py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} Cédric Karungu. {t("footer.copyright")}
        </p>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="link-quiet">
          {t("ui.backToTop")} ↑
        </a>
      </div>
    </footer>
  );
};

export default Footer;

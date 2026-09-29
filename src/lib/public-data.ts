import type { Locale } from "./models/shared";
import { slugify } from "./slug";

export type LocalizedString = { en: string; fr: string; es: string };

export type ProjectItem = {
  _id?: string;
  id?: number;
  title: LocalizedString | string;
  slug?: string;
  description: LocalizedString | string;
  category: LocalizedString | string;
  image: string;
  gallery?: string[];
  link: string;
  githubLink?: string;
  tags: string[];
  order?: number;
  featured?: boolean;
};

export type ExperienceItem = {
  _id?: string;
  id?: number;
  role: LocalizedString | string;
  company: string;
  period: LocalizedString | string;
  location: LocalizedString | string;
  description: LocalizedString | string;
  order?: number;
};

export type SkillItem = {
  _id?: string;
  name: string;
  level: string;
  category: string;
  logoUrl: string;
  order?: number;
};

export type SocialLinkItem = {
  _id?: string;
  label: string;
  url: string;
  icon: string;
  order?: number;
};

function isLocalized(v: unknown): v is LocalizedString {
  return !!v && typeof v === "object" && "en" in (v as object);
}

export function pick(
  value: LocalizedString | string | undefined,
  locale: Locale,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (isLocalized(value)) {
    return value[locale] || value.en || value.fr || value.es || "";
  }
  return "";
}

export type ProjectView = {
  key: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  gallery: string[];
  link: string;
  githubLink: string;
  tags: string[];
};

export function projectToView(p: ProjectItem, locale: Locale): ProjectView {
  const titleEn = pick(p.title, "en");
  // Prefer content-stable key so it matches whether the item comes from the
  // static constants fallback or the API response (avoids remount + animation reset).
  return {
    key: String(titleEn || p.link || p._id || p.id || ""),
    slug: p.slug || slugify(titleEn) || String(p._id || p.id || ""),
    title: pick(p.title, locale),
    description: pick(p.description, locale),
    category: pick(p.category, locale),
    image: p.image || "",
    gallery: p.gallery?.length ? p.gallery : p.image ? [p.image] : [],
    link: p.link || "#",
    githubLink: p.githubLink || "",
    tags: p.tags || [],
  };
}

/**
 * Projects sharing the most tags with `current` (ties keep list order), topped
 * up with same-category projects so the section is never too sparse.
 */
export function relatedProjects(
  all: ProjectView[],
  current: ProjectView,
  max = 6,
): { project: ProjectView; shared: string[] }[] {
  const tags = new Set(current.tags.map((t) => t.toLowerCase()));
  const others = all.filter((p) => p.slug !== current.slug);
  const scored = others
    .map((project, i) => ({
      project,
      i,
      shared: project.tags.filter((t) => tags.has(t.toLowerCase())),
    }))
    .filter((r) => r.shared.length > 0)
    .sort((a, b) => b.shared.length - a.shared.length || a.i - b.i);

  const picked = scored.slice(0, max).map(({ project, shared }) => ({ project, shared }));
  if (picked.length < 3) {
    for (const p of others) {
      if (picked.length >= Math.min(3, max)) break;
      if (!picked.some((r) => r.project.slug === p.slug) && p.category === current.category) {
        picked.push({ project: p, shared: [] });
      }
    }
  }
  return picked;
}

export type ExperienceView = {
  key: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
};

export function experienceToView(
  e: ExperienceItem,
  locale: Locale,
): ExperienceView {
  const roleEn = pick(e.role, "en");
  return {
    key: String(`${e.company}-${roleEn}` || e._id || e.id || ""),
    role: pick(e.role, locale),
    company: e.company,
    period: pick(e.period, locale),
    location: pick(e.location, locale),
    description: pick(e.description, locale),
  };
}

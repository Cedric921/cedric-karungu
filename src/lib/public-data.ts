import type { Locale } from './models/shared';

export type LocalizedString = { en: string; fr: string; es: string };

export type ProjectItem = {
  _id?: string;
  id?: number;
  title: LocalizedString | string;
  description: LocalizedString | string;
  category: LocalizedString | string;
  image: string;
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
  return !!v && typeof v === 'object' && 'en' in (v as object);
}

export function pick(value: LocalizedString | string | undefined, locale: Locale): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (isLocalized(value)) {
    return value[locale] || value.en || value.fr || value.es || '';
  }
  return '';
}

export type ProjectView = {
  key: string;
  title: string;
  description: string;
  category: string;
  image: string;
  link: string;
  githubLink: string;
  tags: string[];
};

export function projectToView(p: ProjectItem, locale: Locale): ProjectView {
  return {
    key: String(p._id ?? p.id ?? p.link ?? Math.random()),
    title: pick(p.title, locale),
    description: pick(p.description, locale),
    category: pick(p.category, locale),
    image: p.image || '',
    link: p.link || '#',
    githubLink: p.githubLink || '',
    tags: p.tags || [],
  };
}

export type ExperienceView = {
  key: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
};

export function experienceToView(e: ExperienceItem, locale: Locale): ExperienceView {
  return {
    key: String(e._id ?? e.id ?? e.company ?? Math.random()),
    role: pick(e.role, locale),
    company: e.company,
    period: pick(e.period, locale),
    location: pick(e.location, locale),
    description: pick(e.description, locale),
  };
}

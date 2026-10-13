import type { Metadata } from 'next';
import { BRAND } from './brand';
import type { Locale } from './models/shared';

export const SEO_LOCALES: Locale[] = ['en', 'fr', 'es'];
const OG_LOCALE: Record<Locale, string> = { en: 'en_US', fr: 'fr_FR', es: 'es_ES' };

export const absoluteUrl = (path: string) => `${BRAND.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;

/** Public profiles, used as schema.org `sameAs` for the author. */
export const AUTHOR = {
  '@type': 'Person',
  name: BRAND.name,
  url: BRAND.siteUrl,
  jobTitle: BRAND.role,
  sameAs: ['https://github.com/Cedric921', 'https://linkedin.com/in/cedric-karungu'],
} as const;

/**
 * Canonical URL + hreflang links for a page that exists in several locales.
 * `path` is the part after the locale ("/blog/my-post"). Only `available`
 * locales are listed (an untranslated article isn't advertised in that language).
 */
export function localeAlternates(locale: Locale, path: string, available: Locale[] = SEO_LOCALES): Metadata['alternates'] {
  const canonicalLocale = available.includes(locale) ? locale : available[0] ?? 'en';
  const languages: Record<string, string> = {};
  for (const l of available) languages[l] = `/${l}${path}`;
  languages['x-default'] = `/${available.includes('en') ? 'en' : canonicalLocale}${path}`;
  return { canonical: `/${canonicalLocale}${path}`, languages };
}

export const ogLocale = (locale: Locale, available: Locale[] = SEO_LOCALES) => ({
  locale: OG_LOCALE[locale],
  alternateLocale: available.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
});

/** Cuts text to `max` characters on a word boundary, adding an ellipsis. */
export function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max * 0.6)).replace(/[\s,;:.—-]+$/, '')}…`;
}

/** Plain text from Markdown, for descriptions and word counts. */
export const markdownToText = (md: string) =>
  md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Serialised JSON-LD, safe to inline in a <script> (no "</script>" breakout). */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

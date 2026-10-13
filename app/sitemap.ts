import type { MetadataRoute } from 'next';
import { getPublishedArticles } from '@/lib/articles-server';
import { getPublicProjectItems } from '@/lib/projects-server';
import { articleToView, projectToView } from '@/lib/public-data';
import { SEO_LOCALES, absoluteUrl } from '@/lib/seo';
import type { Locale } from '@/lib/models/shared';

export const revalidate = 3600;

/** One entry per page and locale, each listing its language alternates. */
function entries(path: string, opts: { lastModified?: string | Date; priority: number; locales?: Locale[] }): MetadataRoute.Sitemap {
  const locales = opts.locales ?? SEO_LOCALES;
  const languages = Object.fromEntries(locales.map((l) => [l, absoluteUrl(`/${l}${path}`)]));
  return locales.map((l) => ({
    url: absoluteUrl(`/${l}${path}`),
    lastModified: opts.lastModified ? new Date(opts.lastModified) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: opts.priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, projects] = await Promise.all([getPublishedArticles(true), getPublicProjectItems()]);
  return [
    ...entries('', { priority: 1 }),
    ...entries('/projects', { priority: 0.8 }),
    ...entries('/blog', { priority: 0.8 }),
    ...projects
      .map((p) => projectToView(p, 'en'))
      .filter((p) => p.slug)
      .flatMap((p) => entries(`/projects/${p.slug}`, { priority: 0.7 })),
    ...articles.flatMap((a) => {
      const v = articleToView(a, 'en');
      return entries(`/blog/${v.slug}`, { priority: 0.7, lastModified: v.updated || v.date, locales: v.locales });
    }),
  ];
}

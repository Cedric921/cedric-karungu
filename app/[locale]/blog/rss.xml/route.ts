import { getPublishedArticles } from '@/lib/articles-server';
import { articleToView } from '@/lib/public-data';
import { BRAND } from '@/lib/brand';
import type { Locale } from '@/lib/models/shared';

export const revalidate = 3600;

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);

/** RSS 2.0 feed of published articles for the given locale. */
export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = (await getPublishedArticles()).map((a) => articleToView(a, locale as Locale));
  const base = `${BRAND.siteUrl}/${locale}/blog`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(BRAND.name)} — Blog</title><link>${base}</link><description>${esc(BRAND.name)}</description><language>${locale}</language>
${items
  .map(
    (a) => `<item><title>${esc(a.title)}</title><link>${base}/${a.slug}</link><guid>${base}/${a.slug}</guid>${
      a.date ? `<pubDate>${new Date(a.date).toUTCString()}</pubDate>` : ''
    }<description>${esc(a.excerpt)}</description>${a.tags.map((t) => `<category>${esc(t)}</category>`).join('')}</item>`,
  )
  .join('\n')}
</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}

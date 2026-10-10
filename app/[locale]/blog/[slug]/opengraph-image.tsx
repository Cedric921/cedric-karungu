import { ImageResponse } from 'next/og';
import { brandFonts } from '@/lib/brand';
import { OG_SIZE, OgFrame } from '@/lib/og-card';
import { getPublishedArticle } from '@/lib/articles-server';
import { articleToView } from '@/lib/public-data';
import type { Locale } from '@/lib/models/shared';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Article — Cédric Karungu';
export const revalidate = 3600;

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Social card for an article: logo, date · reading time, big title. */
export default async function ArticleOgImage({ params }: Props) {
  const { locale, slug } = await params;
  const item = await getPublishedArticle(slug);
  const a = item ? articleToView(item, locale as Locale) : null;
  const title = a?.title || 'Writing';
  const date = a?.date ? new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(a.date)) : '';

  return new ImageResponse(
    (
      <OgFrame>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 22, fontWeight: 700, letterSpacing: 4, color: '#a78bfa' }}>
            {`ARTICLE${date ? ` · ${date.toUpperCase()}` : ''}${a ? ` · ${a.minutes} MIN` : ''}`}
          </div>
          <div style={{ display: 'flex', marginTop: 20, fontSize: title.length > 50 ? 58 : 72, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, maxWidth: 1050 }}>
            {title.length > 90 ? `${title.slice(0, 87)}…` : title}
          </div>
        </div>
      </OgFrame>
    ),
    { ...size, fonts: await brandFonts() },
  );
}

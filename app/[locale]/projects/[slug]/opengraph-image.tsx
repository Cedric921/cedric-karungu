import { ImageResponse } from 'next/og';
import { brandFonts, imageAsDataUrl } from '@/lib/brand';
import { OG_SIZE, OgFrame } from '@/lib/og-card';
import { getPublicProjectItems } from '@/lib/projects-server';
import { projectToView } from '@/lib/public-data';
import type { Locale } from '@/lib/models/shared';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Project case study — Cédric Karungu';
export const revalidate = 3600;

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Social card for a project: header logo, title, tags and the cover shot. */
export default async function ProjectOgImage({ params }: Props) {
  const { locale, slug } = await params;
  const items = await getPublicProjectItems();
  const project = items.map((p) => projectToView(p, locale as Locale)).find((p) => p.slug === slug);
  const cover = project?.image ? await imageAsDataUrl(project.image) : null;
  const title = project?.title || 'Project';

  return new ImageResponse(
    (
      <OgFrame>
        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', fontSize: 22, fontWeight: 700, letterSpacing: 4, color: '#a78bfa' }}>
              {`CASE STUDY · ${(project?.category || '').toUpperCase()}`}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 18,
                fontSize: title.length > 28 ? 58 : 76,
                fontWeight: 800,
                letterSpacing: -2,
                lineHeight: 1.05,
              }}
            >
              {title.length > 60 ? `${title.slice(0, 57)}…` : title}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28 }}>
              {(project?.tags || []).slice(0, 4).map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: 'flex',
                    fontSize: 20,
                    fontWeight: 700,
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          {cover && (
            <img
              src={cover}
              width={480}
              height={300}
              style={{ borderRadius: 20, objectFit: 'cover', objectPosition: 'top', border: '1px solid rgba(255,255,255,0.12)' }}
            />
          )}
        </div>
      </OgFrame>
    ),
    { ...size, fonts: await brandFonts() },
  );
}

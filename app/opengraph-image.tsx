import { ImageResponse } from 'next/og';
import { BRAND, brandFonts } from '@/lib/brand';
import { OG_SIZE, OgFrame } from '@/lib/og-card';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = `${BRAND.name} — ${BRAND.role}`;

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <OgFrame>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 104, fontWeight: 800, letterSpacing: -4, lineHeight: 1.02 }}>
            {BRAND.name}
          </div>
          <div style={{ display: 'flex', marginTop: 24, fontSize: 38, fontWeight: 700, color: '#c4b5fd' }}>
            {BRAND.role} · Next.js · Nest.js · React Native
          </div>
        </div>
      </OgFrame>
    ),
    { ...size, fonts: await brandFonts() },
  );
}

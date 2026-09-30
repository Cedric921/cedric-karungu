import { readFile } from 'node:fs/promises';
import path from 'node:path';

/** Brand tokens shared by the header logo, icons and social cards. */
export const BRAND = {
  name: 'Cédric Karungu',
  monogram: 'CK',
  role: 'Full-stack Engineer',
  bg: '#0a0908', // surface-950
  fg: '#ffffff',
  accent: '#8b5cf6', // accent-500, the dot in the header logo
  amber: '#f59e0b',
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || 'https://cedric-karungu.vercel.app').replace(/\/$/, ''),
};

const fontDir = path.join(process.cwd(), 'src/assets/fonts');

/** Plus Jakarta Sans, the header font, for next/og. */
export async function brandFonts() {
  const [bold, extra] = await Promise.all([
    readFile(path.join(fontDir, 'PlusJakartaSans-700.woff')),
    readFile(path.join(fontDir, 'PlusJakartaSans-800.woff')),
  ]);
  return [
    { name: 'Jakarta', data: bold, weight: 700 as const, style: 'normal' as const },
    { name: 'Jakarta', data: extra, weight: 800 as const, style: 'normal' as const },
  ];
}

/** The header logo: "CK" with the violet dot, tight tracking. */
export function Logo({ size }: { size: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        fontFamily: 'Jakarta',
        fontWeight: 700,
        fontSize: size,
        letterSpacing: -size * 0.05,
        color: BRAND.fg,
        lineHeight: 1,
      }}
    >
      {BRAND.monogram}
      <span style={{ color: BRAND.accent }}>.</span>
    </div>
  );
}

/** Square app icon: the logo on the dark surface. */
export function IconArt({ size, radius }: { size: number; radius: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: BRAND.bg,
        borderRadius: radius,
        // optical centring: the dot makes the wordmark look right-heavy
        paddingLeft: size * 0.04,
        paddingBottom: size * 0.04,
      }}
    >
      <Logo size={size * 0.5} />
    </div>
  );
}

/** Reads a public/ path or remote URL into a data URL next/og can embed. */
export async function imageAsDataUrl(src: string): Promise<string | null> {
  try {
    if (src.startsWith('/')) {
      const file = path.join(process.cwd(), 'public', decodeURIComponent(src));
      const buf = await readFile(file);
      const ext = path.extname(file).slice(1).toLowerCase().replace('jpg', 'jpeg');
      return `data:image/${ext};base64,${buf.toString('base64')}`;
    }
    if (/^https?:\/\//.test(src)) {
      // Cloudinary: ask for a JPEG sized for the card.
      const url = src.includes('res.cloudinary.com') ? src.replace('/upload/', '/upload/f_jpg,q_80,w_1000/') : src;
      const res = await fetch(url);
      if (!res.ok) return null;
      const type = res.headers.get('content-type') || 'image/jpeg';
      if (!/jpe?g|png/.test(type)) return null;
      return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
    }
  } catch {
    /* fall through to no image */
  }
  return null;
}

import { ImageResponse } from 'next/og';
import { brandFonts, IconArt } from '@/lib/brand';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// iOS applies its own corner mask, so no radius here.
export default async function AppleIcon() {
  return new ImageResponse(<IconArt size={180} radius={0} />, { ...size, fonts: await brandFonts() });
}

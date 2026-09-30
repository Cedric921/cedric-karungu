import { ImageResponse } from 'next/og';
import { brandFonts, IconArt } from '@/lib/brand';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default async function Icon() {
  return new ImageResponse(<IconArt size={512} radius={112} />, { ...size, fonts: await brandFonts() });
}

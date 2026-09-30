import OpenGraphImage from './opengraph-image';
import { BRAND } from '@/lib/brand';
import { OG_SIZE } from '@/lib/og-card';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = `${BRAND.name} — ${BRAND.role}`;

export default OpenGraphImage;

import '../src/styles/globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BRAND } from '../src/lib/brand';

const description =
  'Cédric Karungu (Lord Vb) — full-stack engineer building web and mobile products with Next.js, Nest.js and React Native.';

// Icons and social cards are generated from the header logo
// (app/icon.tsx, app/apple-icon.tsx, app/opengraph-image.tsx).
export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: { default: 'Cédric Karungu - Portfolio', template: '%s' },
  description,
  applicationName: BRAND.name,
  authors: [{ name: BRAND.name, url: BRAND.siteUrl }],
  openGraph: {
    type: 'website',
    siteName: `${BRAND.name} — Portfolio`,
    title: 'Cédric Karungu - Portfolio',
    description,
  },
  twitter: { card: 'summary_large_image', title: 'Cédric Karungu - Portfolio', description },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

import '../src/styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Portfolio',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

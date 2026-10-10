import { BRAND, Logo } from './brand';

export const OG_SIZE = { width: 1200, height: 630 };

/** Dark card with the header logo, used for every social preview. */
export function OgFrame({ children, footer }: { children: React.ReactNode; footer?: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64,
        fontFamily: 'Jakarta',
        color: BRAND.fg,
        background: BRAND.bg,
        // Flat like the site, with one faint accent glow.
        backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(139,92,246,0.16), transparent 40%)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={64} />
        <div style={{ display: 'flex', fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: 4 }}>
          PORTFOLIO
        </div>
      </div>
      {children}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
        <div style={{ display: 'flex', width: 48, height: 3, background: BRAND.accent }} />
        {footer ?? BRAND.siteUrl.replace(/^https?:\/\//, '')}
      </div>
    </div>
  );
}

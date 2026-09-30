import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

export default withNextIntl({
  reactStrictMode: true,
  // Fonts read by the next/og image routes at runtime.
  outputFileTracingIncludes: {
    '/**/*': ['./src/assets/fonts/**'],
  },
});

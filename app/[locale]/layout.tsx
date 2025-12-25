import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import en from '@/public/locales/en.json';
import fr from '@/public/locales/fr.json';
import es from '@/public/locales/es.json';

type Messages = typeof en;

const messages: Record<string, Messages> = {
  en,
  fr,
  es,
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }, { locale: 'es' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messagesForLocale = messages[locale];

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messagesForLocale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

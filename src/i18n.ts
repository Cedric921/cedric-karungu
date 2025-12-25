import { getRequestConfig } from 'next-intl/server';
import en from '@/public/locales/en.json';
import fr from '@/public/locales/fr.json';
import es from '@/public/locales/es.json';

type Messages = typeof en;

const locales: Record<string, Messages> = {
  en,
  fr,
  es,
};

export default getRequestConfig((ctx: any = {}) => {
  const params = ctx.params;
  const locale = params?.locale || 'en';
  const messages = locales[locale as keyof typeof locales] || locales.en;

  return {
    messages,
    locale,
  };
});

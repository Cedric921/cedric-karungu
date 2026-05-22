import { Schema } from 'mongoose';

export type Locale = 'en' | 'fr' | 'es';
export const LOCALES: Locale[] = ['en', 'fr', 'es'];

export type LocalizedString = {
  en: string;
  fr: string;
  es: string;
};

export const LocalizedStringSchema = new Schema<LocalizedString>(
  {
    en: { type: String, default: '' },
    fr: { type: String, default: '' },
    es: { type: String, default: '' },
  },
  { _id: false }
);

export function pickLocalized(value: LocalizedString | undefined, locale: Locale): string {
  if (!value) return '';
  return value[locale] || value.en || value.fr || value.es || '';
}

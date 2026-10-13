import type { Metadata } from "next";
import BlogIndex from "../../../src/components/blog/BlogIndex";
import { getPublishedArticles } from "../../../src/lib/articles-server";
import { articleToView } from "../../../src/lib/public-data";
import type { Locale } from "../../../src/lib/models/shared";
import { localeAlternates, ogLocale } from "../../../src/lib/seo";

export const revalidate = 60;

const TITLES: Record<string, string> = { en: "Writing", fr: "Écrits", es: "Escritos" };
const DESCRIPTIONS: Record<string, string> = {
  en: "Articles by Cédric Karungu on full-stack engineering, open source, architecture and shipping real products with Next.js, NestJS and React Native.",
  fr: "Articles de Cédric Karungu sur le développement full-stack, l'open source, l'architecture et la création de vrais produits avec Next.js, NestJS et React Native.",
  es: "Artículos de Cédric Karungu sobre desarrollo full-stack, open source, arquitectura y la creación de productos reales con Next.js, NestJS y React Native.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = `${TITLES[locale] ?? TITLES.en} — Cédric Karungu`;
  const description = DESCRIPTIONS[locale] ?? DESCRIPTIONS.en;
  return {
    title,
    description,
    alternates: { ...localeAlternates(locale as Locale, "/blog"), types: { "application/rss+xml": `/${locale}/blog/rss.xml` } },
    openGraph: { type: "website", url: `/${locale}/blog`, title, description, ...ogLocale(locale as Locale) },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = await getPublishedArticles();
  return <BlogIndex articles={items.map((a) => articleToView(a, locale as Locale))} />;
}

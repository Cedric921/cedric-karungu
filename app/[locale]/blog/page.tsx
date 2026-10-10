import type { Metadata } from "next";
import BlogIndex from "../../../src/components/blog/BlogIndex";
import { getPublishedArticles } from "../../../src/lib/articles-server";
import { articleToView } from "../../../src/lib/public-data";
import type { Locale } from "../../../src/lib/models/shared";

export const revalidate = 60;

const TITLES: Record<string, string> = { en: "Writing", fr: "Écrits", es: "Escritos" };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `${TITLES[locale] ?? TITLES.en} — Cédric Karungu`,
    alternates: { types: { "application/rss+xml": `/${locale}/blog/rss.xml` } },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = await getPublishedArticles();
  return <BlogIndex articles={items.map((a) => articleToView(a, locale as Locale))} />;
}

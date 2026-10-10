import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePage from "../../../../src/components/blog/ArticlePage";
import { getPublishedArticle, getPublishedArticles } from "../../../../src/lib/articles-server";
import { articleToView } from "../../../../src/lib/public-data";
import type { Locale } from "../../../../src/lib/models/shared";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getPublishedArticle(slug);
  if (!item) return { title: "Article not found — Cédric Karungu" };
  const a = articleToView(item, locale as Locale);
  const description = a.excerpt || a.content.replace(/[#>*_`\[\]()!-]/g, "").slice(0, 160);
  return {
    title: `${a.title} — Cédric Karungu`,
    description,
    openGraph: { type: "article", title: a.title, description, publishedTime: a.date || undefined, tags: a.tags },
    twitter: { card: "summary_large_image", title: a.title, description },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const item = await getPublishedArticle(slug);
  if (!item) notFound();
  const list = await getPublishedArticles();
  const i = list.findIndex((x) => x.slug === slug);
  // List is newest first: "previous" = older, "next" = newer.
  const older = i >= 0 ? list[i + 1] : undefined;
  const newer = i > 0 ? list[i - 1] : undefined;
  const view = (x?: typeof item) => (x ? articleToView(x, locale as Locale) : null);

  return <ArticlePage article={articleToView(item, locale as Locale)} prev={view(older)} next={view(newer)} />;
}

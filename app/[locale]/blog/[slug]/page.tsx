import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePage from "../../../../src/components/blog/ArticlePage";
import { getPublishedArticle, getPublishedArticles } from "../../../../src/lib/articles-server";
import { articleToView } from "../../../../src/lib/public-data";
import type { Locale } from "../../../../src/lib/models/shared";
import { BRAND } from "../../../../src/lib/brand";
import { AUTHOR, absoluteUrl, clip, jsonLd, localeAlternates, markdownToText, ogLocale } from "../../../../src/lib/seo";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getPublishedArticle(slug);
  if (!item) return { title: "Article not found — Cédric Karungu", robots: { index: false } };
  const a = articleToView(item, locale as Locale);
  const title = a.seoTitle || a.title;
  const description = a.seoDescription || clip(a.excerpt || markdownToText(a.content), 158);
  const path = `/blog/${a.slug}`;
  return {
    // Brand suffix only when it still fits in a search result (~60 chars).
    title: title.length <= 44 ? `${title} — Cédric Karungu` : title,
    description,
    keywords: a.tags,
    authors: [{ name: BRAND.name, url: BRAND.siteUrl }],
    alternates: localeAlternates(locale as Locale, path, a.locales),
    // An untranslated version (showing the English body) stays out of the index.
    robots: a.locales.includes(locale as Locale) ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "article",
      url: `/${locale}${path}`,
      title,
      description,
      siteName: `${BRAND.name} — Blog`,
      ...ogLocale(locale as Locale, a.locales),
      publishedTime: a.date || undefined,
      modifiedTime: a.updated || undefined,
      authors: [BRAND.siteUrl],
      tags: a.tags,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** schema.org BlogPosting + breadcrumb, for rich results. */
function articleJsonLd(a: ReturnType<typeof articleToView>, locale: string) {
  const url = absoluteUrl(`/${locale}/blog/${a.slug}`);
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: a.seoTitle || a.title,
      name: a.title,
      description: a.seoDescription || a.excerpt,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      image: a.cover ? (a.cover.startsWith("http") ? a.cover : absoluteUrl(a.cover)) : `${url}/opengraph-image`,
      datePublished: a.date || undefined,
      dateModified: a.updated || a.date || undefined,
      inLanguage: a.contentLocale,
      keywords: a.tags.join(", "),
      wordCount: markdownToText(a.content).split(" ").length,
      timeRequired: `PT${a.minutes}M`,
      author: AUTHOR,
      publisher: AUTHOR,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: BRAND.name, item: absoluteUrl(`/${locale}`) },
        { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl(`/${locale}/blog`) },
        { "@type": "ListItem", position: 3, name: a.title, item: url },
      ],
    },
  ];
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

  const article = articleToView(item, locale as Locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd(article, locale)) }} />
      <ArticlePage article={article} prev={view(older)} next={view(newer)} />
    </>
  );
}

import type { Metadata } from "next";
import App from "../../src/App";
import { BRAND } from "../../src/lib/brand";
import { AUTHOR, absoluteUrl, jsonLd, localeAlternates, ogLocale } from "../../src/lib/seo";
import type { Locale } from "../../src/lib/models/shared";

const META: Record<string, { title: string; description: string }> = {
  en: {
    title: "Cédric Karungu — Full-stack Engineer (Next.js, NestJS, React Native)",
    description: "Portfolio of Cédric Karungu, full-stack engineer building web and mobile products, ERP/CRM platforms and open-source contributions with Next.js, NestJS and React Native.",
  },
  fr: {
    title: "Cédric Karungu — Développeur full-stack (Next.js, NestJS, React Native)",
    description: "Portfolio de Cédric Karungu, développeur full-stack : produits web et mobiles, plateformes ERP/CRM et contributions open source avec Next.js, NestJS et React Native.",
  },
  es: {
    title: "Cédric Karungu — Desarrollador full-stack (Next.js, NestJS, React Native)",
    description: "Portafolio de Cédric Karungu, desarrollador full-stack: productos web y móviles, plataformas ERP/CRM y contribuciones open source con Next.js, NestJS y React Native.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = META[locale] ?? META.en;
  return {
    title,
    description,
    alternates: localeAlternates(locale as Locale, ""),
    openGraph: { type: "profile", url: `/${locale}`, title, description, ...ogLocale(locale as Locale) },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const person = { "@context": "https://schema.org", ...AUTHOR, url: absoluteUrl(`/${locale}`), image: absoluteUrl("/images/VB/cedric.png"), name: BRAND.name };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(person) }} />
      <App />
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import AllProjects from "../../../src/components/AllProjects";
import SiteShell from "../../../src/components/SiteShell";
import { localeAlternates, ogLocale } from "../../../src/lib/seo";
import type { Locale } from "../../../src/lib/models/shared";

const META: Record<string, { title: string; description: string }> = {
  en: { title: "Projects — Cédric Karungu", description: "Web platforms, mobile apps, ERP/CRM and SaaS products built by Cédric Karungu, filterable by technology." },
  fr: { title: "Projets — Cédric Karungu", description: "Plateformes web, apps mobiles, ERP/CRM et produits SaaS réalisés par Cédric Karungu, filtrables par technologie." },
  es: { title: "Proyectos — Cédric Karungu", description: "Plataformas web, apps móviles, ERP/CRM y productos SaaS creados por Cédric Karungu, filtrables por tecnología." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = META[locale] ?? META.en;
  return {
    title,
    description,
    alternates: localeAlternates(locale as Locale, "/projects"),
    openGraph: { type: "website", url: `/${locale}/projects`, title, description, ...ogLocale(locale as Locale) },
  };
}

export default function ProjectsPage() {
  return (
    <SiteShell>
      {/* useSearchParams (tag/type filters) needs a Suspense boundary for prerender */}
      <Suspense fallback={<div className="min-h-screen" />}>
        <AllProjects />
      </Suspense>
    </SiteShell>
  );
}

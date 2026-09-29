import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "../../../../src/components/ProjectDetail";
import { getPublicProjectItems } from "../../../../src/lib/projects-server";
import { projectToView, relatedProjects } from "../../../../src/lib/public-data";
import type { Locale } from "../../../../src/lib/models/shared";

// Re-render at most once a minute so admin edits show up quickly.
export const revalidate = 60;

type Props = { params: Promise<{ locale: string; slug: string }> };

async function load(locale: string, slug: string) {
  const items = await getPublicProjectItems();
  const views = items.map((p) => projectToView(p, locale as Locale));
  const index = views.findIndex((v) => v.slug === slug);
  if (index === -1) return null;
  return { views, index, project: views[index] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await load(locale, slug);
  if (!data) return { title: "Project not found — Cédric Karungu" };
  const { project } = data;
  const description = project.description.slice(0, 160);
  return {
    title: `${project.title} — Cédric Karungu`,
    description,
    openGraph: {
      title: project.title,
      description,
      images: project.image ? [{ url: project.image }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const data = await load(locale, slug);
  if (!data) notFound();
  const { views, index, project } = data;
  const prev = views[(index - 1 + views.length) % views.length];
  const next = views[(index + 1) % views.length];

  return (
    <ProjectDetail
      project={project}
      index={index}
      total={views.length}
      related={relatedProjects(views, project, 6)}
      prev={prev.slug !== project.slug ? prev : null}
      next={next.slug !== project.slug ? next : null}
    />
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudy } from '@/components/case-study/CaseStudy';
import { caseStudyExtras } from '@/components/case-study/extras';
import { caseStudies } from '@/lib/data/caseStudies';
import { projectCards } from '@/lib/data/projectCards';
import { projects } from '@/lib/data/projects';

type PageProps = { params: { slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const project = projects.find((item) => item.id === params.slug);
  const card = projectCards[params.slug];
  if (!project || !card) return {};

  return {
    title: project.name,
    description: card.line,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const project = projects.find((item) => item.id === params.slug);
  const card = projectCards[params.slug];
  if (!project || !card) notFound();

  const content = caseStudies[project.id] ?? { blocks: [] };
  const loadExtras = caseStudyExtras[project.id];
  const extras = loadExtras ? await loadExtras() : null;

  return <CaseStudy card={card} content={content} extras={extras} project={project} />;
}

import { notFound } from 'next/navigation';
import { ogContentType, ogSize, renderOgCard } from '@/lib/og';
import { projectCards } from '@/lib/data/projectCards';
import { projects } from '@/lib/data/projects';

export const runtime = 'edge';

export const alt = 'Case study';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const project = projects.find((item) => item.id === params.slug);
  const card = projectCards[params.slug];
  if (!project || !card) notFound();

  const headline = project.impact[0];

  return renderOgCard({
    eyebrow: `Case study · ${card.role}`,
    title: project.name,
    subtitle: headline ? `${headline.value} ${headline.label.toLowerCase()}` : card.line,
  });
}

import { ogContentType, ogSize, renderOgCard } from '@/lib/og';

export const runtime = 'edge';

export const alt = 'Tousif Ali: AI systems that replace manual work';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    eyebrow: 'AI product builder',
    title: 'I build AI systems for work I used to do by hand.',
    subtitle: '433 hours a month saved. CTO-backed integration. Global hackathon winner.',
  });
}

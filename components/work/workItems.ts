import { getOrderedProjects } from '@/lib/data/projectCards';

/** Serializable shape the work index needs: no functions, safe to pass to a client island. */
export type WorkItem = {
  slug: string;
  /** 1-based, stable regardless of the active filter. */
  index: number;
  name: string;
  tagline: string;
  role: string;
  statusLabel: string;
  live: boolean;
  kind: 'system' | 'competition';
  metric: { value: string; label: string };
  stack: string[];
  image?: { src: string; width: number; height: number };
};

/** Screenshots that already exist in /public/screenshots. */
const screenshots: Record<string, WorkItem['image']> = {
  barhunter: { src: '/screenshots/barhunter-overview.webp', width: 1600, height: 479 },
  fhoneman: { src: '/screenshots/fhoneman.webp', width: 1600, height: 741 },
  mailmerge: { src: '/screenshots/mailmerge.webp', width: 1600, height: 865 },
};

export function buildWorkItems(): WorkItem[] {
  return getOrderedProjects().map(({ card, project }, i) => ({
    slug: project.id,
    index: i + 1,
    name: project.name,
    tagline: card.line,
    role: card.role,
    statusLabel: card.statusLabel,
    live: card.statusTone === 'live',
    kind: project.kind === 'competition' ? 'competition' : 'system',
    metric: project.impact[0] ?? { value: '', label: '' },
    stack: project.techStack.slice(0, 4),
    image: screenshots[project.id],
  }));
}

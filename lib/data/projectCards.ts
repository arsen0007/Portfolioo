import { projects, type Project } from '@/lib/data/projects';

/**
 * Short, scannable copy for lists of projects (home, projects index). The full
 * story lives on each case study page; this is only what a reader needs to
 * decide whether to open one.
 */
export type ProjectCard = {
  /** What kind of work it is, in a few words. */
  role: string;
  /** One or two sentences: what it does and why it matters. */
  line: string;
  /** Plain-language state of the project. */
  statusLabel: string;
  /** Drives the colour of the status dot: only real running systems read as live. */
  statusTone: 'live' | 'quiet';
};

export const projectCards: Record<string, ProjectCard> = {
  casewise: {
    role: 'AI legal intake',
    line: 'An AI pipeline that replaced manual case processing. CEO-sponsored, and CTO-backed for integration into the core system.',
    statusLabel: 'Confidential · in progress',
    statusTone: 'quiet',
  },
  genie: {
    role: 'Agent runtime on hardware',
    line: 'Not a wrapper around an API: a complete agent runtime built from scratch. Dispatch pipeline, memory, multi-LLM routing, and 19 voice skills running on a Raspberry Pi.',
    statusLabel: 'Active · open source',
    statusTone: 'live',
  },
  'arsens-lab': {
    role: 'Self-hosted AI infrastructure',
    line: 'Six MCP servers, agents, workflows and a control plane: fourteen services on a Raspberry Pi that give an AI model real hardware to work with. Building it was the easy half.',
    statusLabel: 'Active · 14 services',
    statusTone: 'live',
  },
  barhunter: {
    role: 'Lead sourcing engine',
    line: 'Attorney profiles scraped from bar registries across the US and Canada, then normalized, conflict-checked and campaign-ready in under 60 seconds.',
    statusLabel: 'Live',
    statusTone: 'live',
  },
  'le-mans-t2': {
    role: 'Competition build',
    line: 'Real-time failure prediction for endurance racing, built in 24 hours by a team of five. It won because it predicts laps-to-failure rather than a probability: a lap count is already a decision.',
    statusLabel: 'Global winner',
    statusTone: 'quiet',
  },
  mailmerge: {
    role: 'Outreach preparation',
    line: 'Bulk data cleanup that non-technical teammates can run before every campaign send. Unglamorous, and still in daily use.',
    statusLabel: 'Live',
    statusTone: 'live',
  },
  fhoneman: {
    role: 'Client launch',
    line: 'A repair business with no online presence, turned into a live booking workflow with urgent and standard inquiry paths.',
    statusLabel: 'Live',
    statusTone: 'live',
  },
};

/**
 * Order in which projects are shown everywhere: strongest evidence of impact
 * first. A competition build is not a production system, so it sits after the
 * systems rather than being ranked against them.
 */
const displayOrder = [
  'casewise',
  'genie',
  'arsens-lab',
  'barhunter',
  'le-mans-t2',
  'mailmerge',
  'fhoneman',
] as const;

export type OrderedProject = { project: Project; card: ProjectCard };

export function getOrderedProjects(): OrderedProject[] {
  return displayOrder.flatMap((id) => {
    const project = projects.find((p) => p.id === id);
    const card = projectCards[id];
    return project && card ? [{ project, card }] : [];
  });
}

import type { AccentColor } from '@/lib/constants/colors';

/**
 * Homepage content.
 *
 * The through-line: most AI work fails in the handoff between the people who
 * understand the problem and the people who can build the fix. The whole page
 * is arranged to prove that Tousif closes that gap himself — operator first,
 * engineer second, product third — rather than to claim it.
 */

export type HeroMetric = {
  value: string;
  label: string;
  accent: AccentColor;
};

/**
 * Every metric carries its denominator. A number without one ("40% faster")
 * is unfalsifiable and reads as marketing rather than measurement.
 */
export const heroMetrics: HeroMetric[] = [
  { value: '433h', label: 'Saved every month, for a 7-person legal team', accent: 'blue' },
  { value: '96%', label: 'Faster intake — 15 minutes down to 30 seconds', accent: 'cyan' },
  { value: '94,363', label: 'Attorney records sourced across 5 jurisdictions', accent: 'green' },
  { value: '6', label: 'Systems shipped, 4 of them used by other people', accent: 'purple' },
];

/** Third-party validation, in descending order of how hard it is to fake. */
export const heroCredentials = [
  'CTO-integrated into the core system',
  'CEO-sponsored',
  'Featured by Workplace Options',
  'Global Hackathon Winner',
] as const;

export type BridgePillar = {
  id: string;
  accent: AccentColor;
  role: string;
  claim: string;
  body: string;
  evidence: string[];
};

export const bridgePillars: BridgePillar[] = [
  {
    id: 'operator',
    accent: 'cyan',
    role: 'Operator',
    claim: 'I have done the work',
    body: "Inside operations since 2017 — clinical referrals, legal intake, B2B sales. I have been the person working the queue, which means I can tell the difference between a step that matters and a step that is only habit. That judgement is not something you get from a requirements doc.",
    evidence: ['In operations since 2017', 'Clinical · Legal · Sales'],
  },
  {
    id: 'engineer',
    accent: 'blue',
    role: 'Engineer',
    claim: 'I build it myself',
    body: 'No specifications thrown over a wall. LLM pipelines, browser automation, scrapers across dozens of inconsistent registries, Postgres with row-level security — and an agent runtime written from scratch on a Raspberry Pi, because I wanted to know what actually happens inside the loop rather than trust the abstraction.',
    evidence: ['Python · TypeScript · Next.js', 'LLM pipelines · Agent runtimes'],
  },
  {
    id: 'product',
    accent: 'green',
    role: 'Product',
    claim: 'I get it adopted',
    body: 'A prototype nobody uses is a hobby. I took CaseWise to the C-suite myself, earned a CEO-sponsored scholarship on the strength of it, and the CTO then directed it into the core case management system alongside a senior architect and the AI team lead.',
    evidence: ['CEO-sponsored', 'CTO-integrated · Publicly featured'],
  },
];

export type FeaturedSystem = {
  id: string;
  name: string;
  /** Why this project is on the homepage — what it proves that the others do not. */
  proves: string;
  accent: AccentColor;
  status: string;
  summary: string;
  /**
   * The decision and its cost. This is the load-bearing field: anyone can name
   * a tool they picked, but stating what you gave up to pick it is the thing
   * that cannot be faked, and it is where business and engineering judgement
   * become visible as one decision rather than two.
   */
  tradeoff: string;
  metrics: { value: string; label: string }[];
  stack: string[];
};

export const featuredSystems: FeaturedSystem[] = [
  {
    id: 'casewise',
    name: 'CaseWise',
    proves: 'The one that got institutionalized',
    accent: 'blue',
    status: 'Confidential · In production',
    summary:
      'A legal team of seven was hand-classifying roughly 2,700 cases a month against 31 issue types, waiting on senior guidance for anything complex. I built an AI pipeline that reads the case straight out of the existing case management system, classifies it, writes the summary, and drafts the attorney outreach — then hands it back for a human to approve.',
    tradeoff:
      'Read the UCMS interface directly instead of waiting for API access. That accepts a brittle integration which breaks whenever the UI changes, in exchange for proving the value in weeks rather than a backend roadmap quarter. Human approval stayed mandatory: the model drafts, the agent commits.',
    metrics: [
      { value: '433h', label: 'Saved monthly, team of 7' },
      { value: '96%', label: '15 min → 30 sec' },
      { value: '31+', label: 'Issue types mapped' },
    ],
    stack: ['LLM pipelines', 'Browser automation', 'Next.js', 'Prompt engineering'],
  },
  {
    id: 'arsens-lab',
    name: "Arsen's Lab",
    proves: 'The one I have to keep running',
    accent: 'cyan',
    status: 'Active · 14 services',
    summary:
      'Six MCP servers, agents, workflows, and a control plane — fourteen services on a Raspberry Pi that give an AI model real hardware to work with: a camera, a microphone, a shell, a browser, a database, an Echo. Building it was the easy half. Being responsible for it after the interesting part finished is where the engineering is.',
    tradeoff:
      'The original plan was a spoken boot announcement, and it cannot work — the thing that would announce readiness is itself one of the services booting. An announcer is a consumer of readiness and therefore races. A dashboard is an observer: it needs nothing from anyone, so the race stops existing rather than being worked around. I gave up the feature I wanted and got a system with no startup race.',
    metrics: [
      { value: '14', label: 'Services supervised' },
      { value: '6', label: 'MCP servers built' },
      { value: '18s', label: 'Boot time removed' },
    ],
    stack: ['MCP', 'systemd', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'genie',
    name: 'Genie',
    proves: 'The one I built to understand the internals',
    accent: 'purple',
    status: 'Active · Open source',
    summary:
      'Building on top of AI APIs teaches you the surface. I wanted the layer underneath, so I wrote a complete voice agent runtime on a Raspberry Pi: a four-stage dispatch pipeline where the LLM is the last resort rather than the first move, per-turn execution traces, and nine models across four hot-swappable provider slots. It runs daily.',
    tradeoff:
      'The LLM sits at stage four of four, not stage one — it is the fallback, not the router. Routing every turn through a model is slow and expensive, so the router caches on (text, model) and most repeated requests never reach it. The honest failure is barge-in: the architecture is correct, but the microphone hears the speaker. That is a physics problem, and V3 fixes it in software with acoustic echo cancellation.',
    metrics: [
      { value: '19+', label: 'Skills, running daily' },
      { value: '9', label: 'Models across 4 slots' },
      { value: '4', label: 'Dispatch stages, LLM last' },
    ],
    stack: ['Python', 'Raspberry Pi', 'Multi-provider LLM', 'Wake word · STT · TTS'],
  },
  {
    id: 'barhunter',
    name: 'BarHunter',
    proves: 'The one that had to survive real data',
    accent: 'green',
    status: 'Live',
    summary:
      'Legal recruiters were opening state bar websites one at a time and copy-pasting attorney records into spreadsheets. Every jurisdiction publishes differently, so the hard part was never the scraping — it was normalization, conflict checking, and making the result something a recruiter would trust before hitting send.',
    tradeoff:
      'Ingestion runs as its own system rather than inside the dashboard. That is more infrastructure to operate, but it means recruiters are never blocked on a public registry that is slow or down. And the output is a plain CSV rather than a new platform — the workflow already existed, so the product had to end where that workflow begins.',
    metrics: [
      { value: '94,363', label: 'Leads, 5 jurisdictions' },
      { value: '16', label: 'Practice areas' },
      { value: '<60s', label: 'Zero to export' },
    ],
    stack: ['Next.js', 'Supabase · RLS', 'Python · Playwright', 'PostgreSQL'],
  },
];

export type ProofPoint = {
  id: string;
  accent: AccentColor;
  label: string;
  attribution: string;
  quote: string;
  /** The action taken, which matters more than the words. */
  consequence: string;
};

export const proofPoints: ProofPoint[] = [
  {
    id: 'ceo',
    accent: 'amber',
    label: 'CEO',
    attribution: 'Alan King · Workplace Options',
    quote:
      'I think it is extraordinary — not just the work, but the dedication to trying to do something better and to make the organisation better.',
    consequence: 'Sponsored a $5,000 Product School scholarship',
  },
  {
    id: 'cto',
    accent: 'blue',
    label: 'CTO',
    attribution: 'Praveen Kodikkambrath · Workplace Options',
    quote:
      'Paired with Senior System Architect and AI Team Lead for production development.',
    consequence: 'Directed CaseWise into the core case management system',
  },
  {
    id: 'public',
    accent: 'green',
    label: 'Public record',
    attribution: 'Workplace Options Blog · July 2025',
    quote:
      'Tousif saw an opportunity to streamline and optimize legal case intake. He leveraged his AI expertise and developed a custom tool that enhances note-taking and categorization.',
    consequence: 'Featured as a company innovation story',
  },
];

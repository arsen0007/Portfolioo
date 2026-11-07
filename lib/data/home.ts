/**
 * Homepage content.
 *
 * The through-line: most AI work fails in the handoff between the people who
 * understand the problem and the people who can build the fix. The whole page
 * is arranged to prove that Tousif closes that gap himself — operator first,
 * engineer second, product third — rather than to claim it.
 */

/** Third-party validation, in descending order of how hard it is to fake. */
export const heroCredentials = [
  'CTO-backed core-system integration',
  'CEO-sponsored',
  'Featured by Workplace Options',
  'Global Hackathon Winner',
  'Company innovation challenge winner',
] as const;

export type BridgePillar = {
  id: string;
  role: string;
  claim: string;
  body: string;
};

export const bridgePillars: BridgePillar[] = [
  {
    id: 'operator',
    role: 'Operator',
    claim: 'I have done the work',
    body: "Inside operations since 2017 — clinical referrals, legal intake, B2B sales. I have been the person working the queue, which means I can tell the difference between a step that matters and a step that is only habit. That judgement is not something you get from a requirements doc.",
  },
  {
    id: 'engineer',
    role: 'Engineer',
    claim: 'I build it myself',
    body: 'No specifications thrown over a wall. LLM pipelines, browser automation, scrapers across dozens of inconsistent registries, Postgres with row-level security — and an agent runtime written from scratch on a Raspberry Pi, because I wanted to know what actually happens inside the loop rather than trust the abstraction.',
  },
  {
    id: 'product',
    role: 'Product',
    claim: 'I get it adopted',
    body: 'A prototype nobody uses is a hobby. I took CaseWise to the C-suite myself, earned a CEO-sponsored scholarship on the strength of it, and the CTO backed folding it into the core case management system — work that is still ongoing, alongside a senior architect and the AI team lead.',
  },
];

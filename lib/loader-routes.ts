/**
 * Case-study slugs the intro loader prefetches. A plain list on purpose:
 * importing lib/data would ship every case study's copy in the loader bundle.
 * Keep in step with `displayOrder` in lib/data/projectCards.ts.
 */
export const caseStudySlugs = [
  'casewise',
  'genie',
  'arsens-lab',
  'barhunter',
  'le-mans-t2',
  'feedback-cascade',
  'mailmerge',
  'fhoneman',
] as const;

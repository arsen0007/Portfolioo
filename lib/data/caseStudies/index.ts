import { arsensLab } from './arsens-lab';
import { barhunter } from './barhunter';
import { casewise } from './casewise';
import { feedbackCascade } from './feedback-cascade';
import { fhoneman } from './fhoneman';
import { genie } from './genie';
import { leMansT2 } from './le-mans-t2';
import { mailmerge } from './mailmerge';
import type { CaseStudyContent } from './types';

export type { CaseStudyBlock, CaseStudyContent, QuoteSource } from './types';

/** Extra content per project id. A project with no entry just uses the standard sections. */
export const caseStudies: Record<string, CaseStudyContent> = {
  casewise,
  genie,
  'arsens-lab': arsensLab,
  barhunter,
  'le-mans-t2': leMansT2,
  'feedback-cascade': feedbackCascade,
  mailmerge,
  fhoneman,
};

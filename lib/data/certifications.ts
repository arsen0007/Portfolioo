import type { AccentColor } from '@/lib/constants/colors';

/**
 * Single source of truth for certifications.
 *
 * Previously this list lived inside the certifications page while
 * `recognition.ts` kept a second hand-maintained copy. They drifted: one said
 * six completed, the other seven, and they disagreed about Go-to-Market. Both
 * pages now derive from here.
 */

export type Cert = {
  id: string;
  title: string;
  subtitle?: string;
  level: 'Intermediate' | 'Advanced' | 'Expert';
  status: 'completed' | 'in-progress';
  color: AccentColor;
  file: string | null;
  issuer: string;
  issued?: string;
  link?: string;
  expectedCompletion?: string;
  /**
   * Where this was actually used. Deliberately absent on the ones that have not
   * fed into shipped work yet — an honest gap is worth more than a stretched
   * claim, and the page headline promises application.
   */
  appliedTo?: { label: string; href?: string };
};

export const certs: Cert[] = [
  {
    id: 'product-manager',
    title: 'Product Manager',
    subtitle: 'Certification™',
    level: 'Intermediate',
    status: 'completed',
    color: 'green',
    file: '/certificates/Product Manager Certification.png',
    issuer: 'Product School',
    appliedTo: { label: "Pitched CaseWise to the C-suite and ran its problem discovery", href: '/projects/casewise' },
    issued: 'January 20, 2026',
    link: 'https://certificate.productschool.com/1c89deea-0560-4b63-812e-f4b0a2193f87',
  },
  {
    id: 'ai-evals',
    title: 'AI Evals',
    level: 'Advanced',
    status: 'completed',
    color: 'cyan',
    file: '/certificates/AI Evals Certification.png',
    issuer: 'Product School',
    appliedTo: { label: "Model selection across Genie's nine LLMs; formal eval work still in progress", href: '/projects/genie' },
    issued: 'February 23, 2026',
    link: 'https://certificate.productschool.com/4830b3f7-45ed-429a-8ada-64513c7f74d3',
  },
  {
    id: 'ai-product-management',
    title: 'AI Product Management',
    level: 'Intermediate',
    status: 'completed',
    color: 'blue',
    file: '/certificates/AI Product Management Certification.png',
    issuer: 'Product School',
    appliedTo: { label: "Shaped the CaseWise pipeline and its human-in-the-loop review step", href: '/projects/casewise' },
    issued: 'February 14, 2026',
    link: 'https://certificate.productschool.com/167b88a5-07be-44b7-baf2-57d7f2618290',
  },
  {
    id: 'advanced-ai-agents',
    title: 'Advanced AI Agents',
    level: 'Advanced',
    status: 'completed',
    color: 'purple',
    file: '/certificates/Advance AI Agents Certification.png',
    issuer: 'Product School',
    appliedTo: { label: "Genie — an agent runtime built from scratch, dispatch pipeline and all", href: '/projects/genie' },
    issued: 'June 1, 2026',
    link: 'https://certificate.productschool.com/1774d978-11d5-443e-a138-3e5e1721f2cf',
  },
  {
    id: 'go-to-market',
    title: 'Go-to-Market',
    level: 'Advanced',
    status: 'completed',
    color: 'amber',
    file: '/certificates/Go-to-Market Certification.png',
    issuer: 'Product School',
    issued: 'July 23, 2026',
    link: 'https://certificate.productschool.com/673c40b2-8c0b-45a9-a7d7-defa4f8db755',
  },
  {
    id: 'vibe-coding',
    title: 'Vibe Coding',
    level: 'Advanced',
    status: 'completed',
    color: 'blue',
    file: '/certificates/Vibe Coding Certification.png',
    issuer: 'Product School',
    issued: 'July 2, 2026',
    link: 'https://certificate.productschool.com/092dbf31-a50b-4ee9-97b2-03a400bc27c1',
  },
  {
    id: 'product-experimentation',
    title: 'Product Experimentation',
    level: 'Advanced',
    status: 'in-progress',
    color: 'cyan',
    file: null,
    issuer: 'Product School',
    expectedCompletion: 'Aug 8 – Aug 23',
  },
  {
    id: 'ai-product-strategy',
    title: 'AI Product Strategy',
    level: 'Expert',
    status: 'in-progress',
    color: 'green',
    file: null,
    issuer: 'Product School',
    expectedCompletion: 'Aug 26 – Sep 11',
  },
  {
    id: 'product-leadership',
    title: 'Product Leadership',
    level: 'Expert',
    status: 'in-progress',
    color: 'purple',
    file: null,
    issuer: 'Product School',
    expectedCompletion: 'Sep 14 – Oct 1',
  },
  {
    id: 'claude-code',
    title: 'Claude Code',
    level: 'Advanced',
    status: 'completed',
    color: 'green',
    file: '/certificates/Claude Code Certification.png',
    issuer: 'Product School',
    appliedTo: { label: "Built Arsen's Lab and this site with it", href: '/projects/arsens-lab' },
    issued: 'June 12, 2026',
    link: 'https://certificate.productschool.com/5b5ccac9-1b8f-4bcc-a1cf-fdd729442ccc',
  },
];

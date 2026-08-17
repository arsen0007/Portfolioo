import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Five systems: CaseWise (AI legal intake, 96% time reduction, CTO-backed for core-system integration), BarHunter (94,363 legal leads sourced), Genie (agent runtime on a Raspberry Pi), Mail Merge Tool, and Fhoneman. Real tools, real users, measurable impact.',
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

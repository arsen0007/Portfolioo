import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Four production systems: BarHunter (100K+ legal leads sourced), CaseWise (96% time reduction, CTO-integrated), Mail Merge Tool, and Fhoneman. Real tools, real users, measurable impact.',
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

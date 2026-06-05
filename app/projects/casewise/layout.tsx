import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CaseWise',
  description: 'AI-powered case brief generator for law students — upload, classify, and summarize legal cases with human review built in.',
};

export default function CasewiseLayout({ children }: { children: React.ReactNode }) {
  return children;
}

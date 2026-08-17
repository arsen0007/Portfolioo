import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CaseWise',
  description: 'An AI pipeline for legal intake — classification, summarization, and attorney outreach drafting, with human review built in. CEO-sponsored, CTO-backed for core-system integration.',
};

export default function CasewiseLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mail Merge Tool',
  description: 'Bulk personalized outreach at scale — upload a CSV, define a template, and send hundreds of tailored messages without manual effort.',
};

export default function MailmergeLayout({ children }: { children: React.ReactNode }) {
  return children;
}

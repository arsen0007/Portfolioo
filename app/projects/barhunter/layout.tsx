import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BarHunter',
  description: 'A full-stack lead sourcing platform built for legal recruiters — attorney profiles, smart filtering, and bulk outreach in one workflow.',
};

export default function BarhunterLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';
import '@xyflow/react/dist/style.css';

export const metadata: Metadata = {
  title: 'Skills',
  description:
    'What I build with, what I reach for, and what I\'m picking up. A curated skill tree backed by real shipped projects.',
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

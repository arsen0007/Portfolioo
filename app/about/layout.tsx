import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Seven years inside real operations. I see what\'s missing — then I build it. AI Product & Systems Builder based in Bengaluru, India.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

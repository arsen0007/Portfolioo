import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Inside operations since 2017, building the AI systems those teams run on. I see what\'s missing — then I build it. Based in Bengaluru, India.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

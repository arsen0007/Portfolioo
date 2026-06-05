import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recognition',
  description: 'Awards, certifications, and credentials earned across product management, AI, and operations.',
};

export default function RecognitionLayout({ children }: { children: React.ReactNode }) {
  return children;
}

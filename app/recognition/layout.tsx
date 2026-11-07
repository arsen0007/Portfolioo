import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recognition and certifications',
  description:
    'What leadership did after seeing the work, the public record, a global hackathon win, and ten Product School certifications with verification links.',
};

export default function RecognitionLayout({ children }: { children: React.ReactNode }) {
  return children;
}

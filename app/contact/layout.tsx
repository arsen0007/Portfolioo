import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Describe a repeated manual task and get an honest read on whether AI is the right answer. Reach out by email, LinkedIn or GitHub.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

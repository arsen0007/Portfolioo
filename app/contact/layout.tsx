import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: "Let's build something. Reach out via email, LinkedIn, or GitHub — or grab my resume.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

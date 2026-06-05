import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fhoneman',
  description: 'AI-driven phone screening tool that automates candidate qualification for recruiting workflows.',
};

export default function FhonemanLayout({ children }: { children: React.ReactNode }) {
  return children;
}

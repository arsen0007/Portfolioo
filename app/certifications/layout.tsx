import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Certifications',
  description: 'Professional certifications in AI, product management, and systems — completed and in progress.',
};

export default function CertificationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

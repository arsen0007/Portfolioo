import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Genie',
  description: 'A complete agent runtime built from scratch — dispatch pipeline, memory, multi-LLM routing, and 19 voice skills running on a Raspberry Pi.',
};

export default function GenieLayout({ children }: { children: React.ReactNode }) {
  return children;
}

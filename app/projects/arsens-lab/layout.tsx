import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Arsen's Lab — self-hosted AI infrastructure",
  description:
    'Fourteen services on a Raspberry Pi: six MCP servers, agents, workflows, and a control plane. The layer that hands an AI model real capability — and the operational discipline to keep it running.',
};

export default function ArsensLabLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';
import '@xyflow/react/dist/style.css';

export const metadata: Metadata = {
  title: 'Architecture',
  description: 'System architecture and technical infrastructure behind the products I build.',
};

export default function ArchitectureLayout({ children }: { children: React.ReactNode }) {
  return children;
}

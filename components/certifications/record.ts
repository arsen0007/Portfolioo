import { certs, type Cert } from '@/lib/data/certifications';

export type Track = 'ai' | 'product' | 'leadership';

export const TRACKS: { id: Track; label: string }[] = [
  { id: 'ai', label: 'AI' },
  { id: 'product', label: 'Product' },
  { id: 'leadership', label: 'Leadership' },
];

/** Track per certificate, keyed by id. Anything unmapped falls back to Product. */
const trackById: Record<string, Track> = {
  'ai-evals': 'ai',
  'ai-product-management': 'ai',
  'advanced-ai-agents': 'ai',
  'vibe-coding': 'ai',
  'claude-code': 'ai',
  'product-manager': 'product',
  'go-to-market': 'product',
  'product-experimentation': 'product',
  'ai-product-strategy': 'leadership',
  'product-leadership': 'leadership',
};

export type RecordItem = Cert & { track: Track; number: number; fullTitle: string };

const time = (cert: Cert) => (cert.issued ? Date.parse(cert.issued) : Number.POSITIVE_INFINITY);

/** Newest first; in-progress (no issue date yet) lead, since they are the live edge. */
export const recordItems: RecordItem[] = [...certs]
  .sort((a, b) => time(b) - time(a))
  .map((cert, index) => ({
    ...cert,
    track: trackById[cert.id] ?? 'product',
    number: index + 1,
    fullTitle: cert.subtitle ? `${cert.title} ${cert.subtitle}` : cert.title,
  }));

export const recordStats = {
  total: certs.length,
  completed: certs.filter((c) => c.status === 'completed').length,
  inProgress: certs.filter((c) => c.status === 'in-progress').length,
  applied: certs.filter((c) => c.appliedTo).length,
  issuers: new Set(certs.map((c) => c.issuer)).size,
};

export const pad = (n: number) => String(n).padStart(2, '0');

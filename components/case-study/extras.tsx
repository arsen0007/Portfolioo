import type { ReactNode } from 'react';
import { Metric } from '@/components/ui/Metric';
import { Split } from '@/components/ui/Split';

// TEMPORARY FALLBACK: remove the literals below once NEXT_PUBLIC_SUPABASE_URL
// and NEXT_PUBLIC_SUPABASE_ANON_KEY are set on Vercel. The anon key is public
// by design (row-level security governs access).
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ttgisyqbfdloplrvnlxn.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Z2lzeXFiZmRsb3BscnZubHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDc0ODQsImV4cCI6MjEwMjM4MzQ4NH0.qsaDH1M0wSY5ZGXGlTGqlVrEStgZLmVzrPsJLXzWmeA';

type MailMergeStats = { files_cleaned: number; rows_processed: number; sessions: number };

async function getMailMergeStats(): Promise<MailMergeStats | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/metrics_totals?select=files_cleaned,rows_processed,sessions`,
      {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        next: { revalidate: 86400 },
      },
    );
    if (!res.ok) return null;
    const rows: MailMergeStats[] = await res.json();
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

async function MailMergeLiveStats(): Promise<ReactNode> {
  const stats = await getMailMergeStats();
  if (!stats) return null;

  const items = [
    { value: String(stats.files_cleaned), label: 'Files cleaned, running total' },
    { value: stats.rows_processed.toLocaleString('en-US'), label: 'Rows processed, running total' },
    { value: String(stats.sessions), label: 'Sessions, running total' },
  ];

  return (
    <Split
      eyebrow="Live from production"
      intro="Read from the production database and refreshed daily."
      title="What it has processed so far"
    >
      <dl className="grid gap-8 border-t border-surfaceBorder pt-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Metric caption={item.label} key={item.label} value={item.value} />
        ))}
      </dl>
    </Split>
  );
}

/**
 * Project-specific content that cannot be plain data, such as figures fetched
 * live from a database. Each entry is a function (it may be async) returning
 * content that is rendered after the project's blocks and before its
 * decisions. Most projects need none.
 */
export const caseStudyExtras: Record<string, () => ReactNode | Promise<ReactNode>> = {
  mailmerge: MailMergeLiveStats,
};

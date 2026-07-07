import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <main className="dot-grid relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 42%, color-mix(in srgb, var(--blue) 14%, transparent), transparent)',
        }}
      />

      <div className="relative text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-textMuted">
          Signal lost · 404
        </p>
        <h1 className="mt-5 font-display text-[44px] font-semibold leading-[1.05] tracking-tight text-textPrimary md:text-[64px]">
          This node doesn&apos;t exist.
        </h1>
        <p className="mx-auto mt-5 max-w-[420px] font-body text-[15px] leading-[1.8] text-textSecondary">
          The page you&apos;re looking for was moved, renamed, or never wired into the system.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] transition-colors duration-200"
            href="/"
            style={{
              borderColor: 'color-mix(in srgb, var(--blue) 32%, transparent)',
              background: 'color-mix(in srgb, var(--blue) 10%, transparent)',
              color: 'var(--blue)',
            }}
          >
            Back to the orbit
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-textSecondary transition-colors duration-200 hover:text-textPrimary"
            href="/projects"
            style={{ borderColor: 'var(--surface-border)' }}
          >
            View projects
          </Link>
        </div>
      </div>
    </main>
  );
}

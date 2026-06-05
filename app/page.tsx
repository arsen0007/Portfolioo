import { Suspense, type CSSProperties } from 'react';
import { OrbitCanvas } from '@/components/orbit/OrbitCanvas';

const proofMetrics = [
  '100K+ leads sourced',
  '96% workflow time reduction',
  '433 hours/month saved',
  'Global Hackathon Winner',
  'Public Company Innovation Feature',
  'CEO Sponsored · CTO Integrated',
] as const;

const STAR_FIELD = [
  { top: '8%', left: '12%', size: 1.5, dur: 7.8, delay: 0, minO: 0.05, maxO: 0.34 },
  { top: '15%', left: '78%', size: 1, dur: 9.2, delay: 0.8, minO: 0.04, maxO: 0.25 },
  { top: '22%', left: '34%', size: 2, dur: 8.4, delay: 1.4, minO: 0.06, maxO: 0.46 },
  { top: '31%', left: '88%', size: 1.5, dur: 8.9, delay: 0.3, minO: 0.04, maxO: 0.28 },
  { top: '42%', left: '6%', size: 1, dur: 10.5, delay: 1.9, minO: 0.05, maxO: 0.3 },
  { top: '55%', left: '92%', size: 1.5, dur: 8.2, delay: 0.6, minO: 0.05, maxO: 0.32 },
  { top: '67%', left: '18%', size: 2, dur: 9.5, delay: 2.1, minO: 0.07, maxO: 0.48 },
  { top: '78%', left: '60%', size: 1, dur: 10.1, delay: 1.1, minO: 0.04, maxO: 0.24 },
  { top: '88%', left: '40%', size: 1.5, dur: 9.7, delay: 0.4, minO: 0.04, maxO: 0.28 },
  { top: '5%', left: '52%', size: 1, dur: 8.7, delay: 1.7, minO: 0.05, maxO: 0.36 },
  { top: '18%', left: '95%', size: 2, dur: 9.1, delay: 0.2, minO: 0.06, maxO: 0.46 },
  { top: '73%', left: '3%', size: 1.5, dur: 10.2, delay: 2.5, minO: 0.05, maxO: 0.29 },
  { top: '48%', left: '47%', size: 1, dur: 8.6, delay: 0.9, minO: 0.04, maxO: 0.22 },
  { top: '91%', left: '82%', size: 2, dur: 9.4, delay: 1.5, minO: 0.06, maxO: 0.44 },
  { top: '36%', left: '24%', size: 1.5, dur: 9.9, delay: 3.0, minO: 0.05, maxO: 0.3 },
  { top: '60%', left: '70%', size: 1, dur: 10.8, delay: 0.7, minO: 0.04, maxO: 0.25 },
  { top: '25%', left: '56%', size: 2, dur: 8.8, delay: 2.0, minO: 0.05, maxO: 0.34 },
  { top: '82%', left: '27%', size: 1, dur: 10.6, delay: 1.3, minO: 0.04, maxO: 0.23 },
  { top: '11%', left: '68%', size: 1.5, dur: 8.5, delay: 0.5, minO: 0.06, maxO: 0.48 },
  { top: '95%', left: '15%', size: 2, dur: 9.8, delay: 1.8, minO: 0.05, maxO: 0.32 },
  { top: '3%', left: '38%', size: 1, dur: 9.3, delay: 2.3, minO: 0.05, maxO: 0.30 },
  { top: '62%', left: '45%', size: 1.5, dur: 8.3, delay: 1.6, minO: 0.05, maxO: 0.32 },
  { top: '44%', left: '73%', size: 2, dur: 9.0, delay: 2.7, minO: 0.06, maxO: 0.44 },
  { top: '28%', left: '8%', size: 1.5, dur: 11.2, delay: 0.4, minO: 0.05, maxO: 0.34 },
  { top: '76%', left: '85%', size: 1, dur: 9.6, delay: 1.0, minO: 0.04, maxO: 0.25 },
  { top: '50%', left: '32%', size: 1, dur: 8.1, delay: 3.2, minO: 0.04, maxO: 0.28 },
  { top: '14%', left: '50%', size: 2, dur: 10.7, delay: 0.9, minO: 0.06, maxO: 0.46 },
  { top: '84%', left: '55%', size: 1, dur: 10.4, delay: 0.2, minO: 0.04, maxO: 0.26 },
];

function ProofItems() {
  return (
    <>
      {proofMetrics.map((metric, index) => (
        <span className="proof-strip-item inline-flex cursor-default items-center whitespace-nowrap" key={metric}>
          <span
            aria-hidden="true"
            className="proof-strip-item__dot"
          />
          <span className="proof-strip-item__text transition-colors duration-200">
            {metric}
          </span>
          {index < proofMetrics.length - 1 ? (
            <span
              aria-hidden="true"
              className="proof-strip-item__divider"
            />
          ) : null}
        </span>
      ))}
    </>
  );
}

function ProofStrip() {
  return (
    <aside
      aria-label="Proof metrics"
      className="proof-strip fixed bottom-3 left-1/2 z-40 h-[50px] w-[calc(100%-2rem)] max-w-[1500px] -translate-x-1/2 overflow-hidden rounded-full border px-4 backdrop-blur-[18px] md:bottom-4 md:w-[calc(100%-6rem)] md:px-6"
      style={{
        background: 'var(--proof-strip-background)',
        borderColor: 'var(--surface-border)',
      }}
    >
      <div className="proof-strip__scan" aria-hidden="true" />
      <div className="orbit-proof-track proof-strip__track mx-auto flex h-full w-max items-center justify-center font-body text-[11px] font-normal text-textSecondary md:w-full">
        <ProofItems />
        <span
          aria-hidden="true"
          className="orbit-proof-copy inline-flex items-center md:hidden"
        >
          <ProofItems />
        </span>
      </div>
    </aside>
  );
}

function StarField() {
  return (
    <div aria-hidden="true" className="star-field pointer-events-none absolute inset-0 z-0">
      {STAR_FIELD.map((s) => (
        <span
          className="star"
          key={s.top + s.left}
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--star-dur': `${s.dur}s`,
            '--star-delay': `${s.delay}s`,
            '--star-min-opacity': s.minO,
            '--star-max-opacity': s.maxO,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <main
        aria-label="Home systems map"
        className="orbit-reference-canvas dot-grid relative min-h-screen overflow-hidden"
      >
        <StarField />
        <Suspense fallback={null}>
          <OrbitCanvas />
        </Suspense>
      </main>
      <ProofStrip />
    </>
  );
}

'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap';
import { cn } from '@/lib/utils';

export type Chapter = { id: string; label: string };

/**
 * Desktop-only sticky rail: the chapter index (02 / 05), a progress hairline
 * driven by ScrollTrigger, and real anchor links to each chapter. Mobile gets
 * the plain document flow; the chapter numbers are repeated in each heading.
 */
export function ChapterRail({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const pad = (n: number) => String(n).padStart(2, '0');

  useGSAP(
    () => {
      const triggers: ScrollTrigger[] = [];
      chapters.forEach((chapter, i) => {
        const el = document.getElementById(chapter.id);
        if (!el) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: 'top 45%',
            end: 'bottom 45%',
            onToggle: (self) => {
              if (self.isActive) setActive(i);
            },
          }),
        );
      });

      const first = document.getElementById(chapters[0]?.id ?? '');
      const last = document.getElementById(chapters[chapters.length - 1]?.id ?? '');
      if (first && last && bar.current) {
        gsap.set(bar.current, { scaleY: 0, transformOrigin: 'top' });
        triggers.push(
          ScrollTrigger.create({
            trigger: first,
            endTrigger: last,
            start: 'top 60%',
            end: 'bottom 60%',
            onUpdate: (self) => gsap.set(bar.current, { scaleY: self.progress }),
          }),
        );
      }
      return () => triggers.forEach((t) => t.kill());
    },
    { scope: root, dependencies: [chapters] },
  );

  return (
    <nav aria-label="Chapters" className="sticky top-[calc(var(--header-h)+2.5rem)]" ref={root}>
      <p className="label text-textMuted">Chapter</p>
      <p className="mt-3 font-display text-h2 font-medium tabular-nums leading-none tracking-[-0.05em] text-textPrimary">
        {pad(active + 1)}
        <span className="text-textMuted"> / {pad(chapters.length)}</span>
      </p>

      <div className="relative mt-10 pl-5">
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-surfaceBorderStrong" />
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-accent" ref={bar} />
        <ol className="space-y-1">
          {chapters.map((chapter, i) => (
            <li key={chapter.id}>
              <a
                aria-current={active === i ? 'location' : undefined}
                className={cn(
                  'label flex min-h-9 items-center gap-3 transition-colors duration-300 hover:text-textPrimary',
                  active === i ? 'text-textPrimary' : 'text-textMuted',
                )}
                href={`#${chapter.id}`}
              >
                <span className="tabular-nums">{pad(i + 1)}</span>
                {chapter.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

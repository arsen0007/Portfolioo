'use client';

import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { SpecCard } from '@/components/work/SpecCard';
import { WorkPreview } from '@/components/work/WorkPreview';
import type { WorkItem } from '@/components/work/workItems';
import { dur, ease } from '@/lib/motion/tokens';
import { gsap, motionAllowed, useGSAP } from '@/lib/motion/gsap';
import { useScene } from '@/lib/store/scene';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'live' | 'shipped' | 'competition';
type View = 'list' | 'grid';

const FILTERS: { id: Filter; label: string; test: (item: WorkItem) => boolean }[] = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'live', label: 'Live', test: (item) => item.live },
  { id: 'shipped', label: 'Shipped', test: (item) => item.kind === 'system' },
  { id: 'competition', label: 'Competition', test: (item) => item.kind === 'competition' },
];

const VIEW_KEY = 'work-view';
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const pad = (n: number) => String(n).padStart(2, '0');

function setHovered(slug: string | null) {
  useScene.getState().setHoveredProject(slug);
}

function StatusDot({ live }: { live: boolean }) {
  return live ? (
    <span aria-hidden="true" className="live-dot shrink-0" />
  ) : (
    <span aria-hidden="true" className="h-[7px] w-[7px] shrink-0 rounded-full border border-textMuted" />
  );
}

export function WorkIndex({ items }: { items: WorkItem[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [view, setView] = useState<View>('list');
  const [active, setActive] = useState<string | null>(null);
  const [pointerActive, setPointerActive] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const prevRects = useRef<Map<string, DOMRect> | null>(null);
  const firstRun = useRef(true);

  const total = items.length;
  const visible = items.filter(FILTERS.find((f) => f.id === filter)!.test);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(VIEW_KEY);
      if (saved === 'grid' || saved === 'list') setView(saved);
    } catch {
      /* storage unavailable: stay on the list */
    }
    return () => setHovered(null);
  }, []);

  const capture = useCallback(() => {
    const map = new Map<string, DOMRect>();
    rootRef.current?.querySelectorAll<HTMLElement>('[data-flip]').forEach((el) => {
      map.set(el.dataset.slug ?? '', el.getBoundingClientRect());
    });
    prevRects.current = map;
  }, []);

  const clearActive = useCallback(() => {
    setActive(null);
    setPointerActive(null);
    setHovered(null);
  }, []);

  const changeFilter = (next: Filter) => {
    if (next === filter) return;
    capture();
    clearActive();
    setFilter(next);
  };

  const changeView = (next: View) => {
    if (next === view) return;
    prevRects.current = null;
    clearActive();
    setView(next);
    try {
      window.localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* ignore */
    }
  };

  // FLIP: rows that persist glide from their old position; new ones rise in.
  useIsoLayoutEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const root = rootRef.current;
    if (!root || !motionAllowed()) return;
    const prev = prevRects.current;
    prevRects.current = null;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-flip]'));
    const entering: HTMLElement[] = [];

    els.forEach((el) => {
      const before = prev?.get(el.dataset.slug ?? '');
      if (before) {
        const dy = before.top - el.getBoundingClientRect().top;
        if (Math.abs(dy) > 1) {
          gsap.fromTo(el, { y: dy }, { y: 0, duration: dur.md * 0.8, ease: ease.out, clearProps: 'transform' });
        }
      } else {
        entering.push(el);
      }
    });
    if (entering.length) {
      gsap.fromTo(
        entering,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: dur.md * 0.8, ease: ease.out, stagger: 0.05, clearProps: 'transform,opacity,visibility' },
      );
    }
  }, [filter, view]);

  // Grid: a subtle transform-only parallax on images.
  useGSAP(
    () => {
      if (view !== 'grid' || !motionAllowed()) return;
      const root = rootRef.current;
      if (!root) return;
      root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    },
    { scope: rootRef, dependencies: [view, filter] },
  );

  const enter = (slug: string, pointer: boolean) => {
    setActive(slug);
    if (pointer) setPointerActive(slug);
    setHovered(slug);
  };
  const leave = () => clearActive();

  const linkHandlers = (slug: string) => ({
    onPointerEnter: (event: React.PointerEvent) => {
      if (event.pointerType === 'mouse') enter(slug, true);
    },
    onPointerLeave: (event: React.PointerEvent) => {
      if (event.pointerType === 'mouse') leave();
    },
    onFocus: () => enter(slug, false),
    onBlur: leave,
  });

  return (
    <div ref={rootRef}>
      <div className="flex flex-col gap-4 border-y border-surfaceBorder py-4 sm:flex-row sm:items-center sm:justify-between">
        <div aria-label="Filter case studies" className="flex flex-wrap gap-2" role="group">
          {FILTERS.map((f) => {
            const count = items.filter(f.test).length;
            return (
              <button
                aria-pressed={filter === f.id}
                className="label inline-flex min-h-11 items-center gap-2 rounded-full border border-surfaceBorderStrong px-4 text-textSecondary transition-colors duration-300 hover:border-textPrimary hover:text-textPrimary aria-pressed:border-textPrimary aria-pressed:bg-textPrimary aria-pressed:text-canvas"
                data-track="filter_use"
                data-track-filter={f.id}
                data-track-page="work"
                key={f.id}
                onClick={() => changeFilter(f.id)}
                type="button"
              >
                {f.label}
                <span className="tabular-nums opacity-80">{pad(count)}</span>
              </button>
            );
          })}
        </div>

        <div aria-label="Layout" className="flex gap-2" role="group">
          {(['list', 'grid'] as const).map((v) => (
            <button
              aria-pressed={view === v}
              className="label inline-flex min-h-11 items-center gap-2 rounded-full border border-transparent px-4 text-textMuted transition-colors duration-300 hover:text-textPrimary aria-pressed:border-surfaceBorderStrong aria-pressed:text-textPrimary"
              data-track="filter_use"
              data-track-filter={`view:${v}`}
              data-track-page="work"
              key={v}
              onClick={() => changeView(v)}
              type="button"
            >
              <span aria-hidden="true" className="inline-block w-3 text-center">
                {v === 'list' ? '≡' : '▦'}
              </span>
              {v === 'list' ? 'List' : 'Grid'}
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {visible.length} of {total} case studies
      </p>
      {filter === 'competition' ? (
        <p className="mt-6 max-w-xl text-small text-textMuted">
          A winning entry in a time-boxed competition or challenge is a different kind of thing from a production
          system, so these are shown on their own.
        </p>
      ) : null}

      {view === 'list' ? (
        <ol className="mt-2">
          {visible.map((item) => (
            <li
              className="group/row border-t border-surfaceBorder transition-opacity duration-500 last:border-b data-[dim=true]:opacity-30"
              data-active={active === item.slug}
              data-dim={active !== null && active !== item.slug}
              data-flip=""
              data-slug={item.slug}
              key={item.slug}
            >
              <TransitionLink
                className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 py-7 md:py-9 lg:grid-cols-[4rem_minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,0.9fr)_2.5rem] lg:items-center lg:gap-x-8"
                data-cursor="view"
                data-cursor-label="View"
                href={`/projects/${item.slug}`}
                {...linkHandlers(item.slug)}
              >
                <span className="label pt-2 tabular-nums text-textMuted transition-colors duration-300 group-data-[active=true]/row:text-accent lg:col-start-1 lg:row-start-1 lg:pt-0">
                  {pad(item.index)}
                </span>

                <span
                  className="relative block overflow-hidden pb-[0.12em] -mb-[0.12em] lg:col-start-2 lg:row-start-1 font-display text-[clamp(2.1rem,5.2vw,5rem)] font-medium leading-[1.02] tracking-[-0.045em] text-textPrimary"
                  style={{ viewTransitionName: `project-title-${item.slug}` }}
                >
                  <span className="block transition-[transform,opacity] duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[active=true]/row:-translate-y-[108%] group-data-[active=true]/row:opacity-0">
                    {item.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 block translate-y-[108%] font-serif font-normal italic text-accent opacity-0 transition-[transform,opacity] duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[active=true]/row:translate-y-0 group-data-[active=true]/row:opacity-100"
                  >
                    {item.name}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="col-start-3 row-start-1 pt-2 text-xl text-textMuted transition-[transform,color] duration-500 ease-out group-data-[active=true]/row:translate-x-1.5 group-data-[active=true]/row:text-accent lg:col-start-5 lg:row-start-auto lg:pt-0 lg:text-right lg:text-2xl"
                >
                  →
                </span>

                <p className="col-start-2 col-span-2 line-clamp-2 max-w-[44ch] text-small text-textMuted lg:col-auto lg:col-span-1 lg:col-start-3 lg:row-start-1">
                  {item.tagline}
                </p>

                <div className="col-start-2 col-span-2 flex flex-wrap items-center gap-x-6 gap-y-2 lg:col-auto lg:col-span-1 lg:col-start-4 lg:row-start-1 lg:flex-col lg:items-start lg:gap-2">
                  <span className="label inline-flex items-center gap-2 text-textSecondary">
                    <StatusDot live={item.live} />
                    {item.kind === 'competition' ? 'Competition' : item.statusLabel}
                  </span>
                  <span className="flex items-baseline gap-2">
                    <span className="whitespace-nowrap font-display text-xl font-medium tabular-nums tracking-[-0.03em] text-textPrimary">
                      {item.metric.value}
                    </span>
                    <span className="label text-textMuted">{item.metric.label}</span>
                  </span>
                </div>
              </TransitionLink>
            </li>
          ))}
        </ol>
      ) : (
        <ol className="mt-10 grid grid-cols-1 gap-x-[var(--gutter)] gap-y-14 md:grid-cols-12 md:gap-y-20">
          {visible.map((item, i) => {
            const pair = Math.floor(i / 2);
            const second = i % 2 === 1;
            const span =
              pair % 2 === 0
                ? second
                  ? 'md:col-span-5 md:col-start-8 md:mt-32'
                  : 'md:col-span-7'
                : second
                  ? 'md:col-span-6 md:col-start-7 md:mt-24'
                  : 'md:col-span-5 md:col-start-2';
            return (
              <li
                className={cn('group/card transition-opacity duration-500 data-[dim=true]:opacity-40', span)}
                data-active={active === item.slug}
                data-dim={active !== null && active !== item.slug}
                data-flip=""
                data-slug={item.slug}
                key={item.slug}
              >
                <TransitionLink
                  className="block"
                  data-cursor="view"
                  data-cursor-label="View"
                  href={`/projects/${item.slug}`}
                  {...linkHandlers(item.slug)}
                >
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-media border border-surfaceBorder bg-surface">
                    {item.image ? (
                      <span
                        className="absolute -inset-y-[9%] inset-x-0 block will-change-transform"
                        data-parallax=""
                      >
                        <Image
                          alt=""
                          className="h-full w-full object-cover object-[0%_0%] transition-transform duration-[1.2s] ease-out group-data-[active=true]/card:scale-[1.04]"
                          fill
                          sizes="(min-width: 768px) 55vw, 100vw"
                          src={item.image.src}
                        />
                      </span>
                    ) : (
                      <SpecCard className="transition-transform duration-[1.2s] ease-out group-data-[active=true]/card:scale-[1.02]" item={item} total={total} />
                    )}
                  </span>

                  <span className="mt-5 grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-4">
                    <span className="label tabular-nums text-textMuted transition-colors duration-300 group-data-[active=true]/card:text-accent">
                      {pad(item.index)}
                    </span>
                    <span
                      className="block font-display text-h2 font-medium text-textPrimary"
                      style={{ viewTransitionName: `project-title-${item.slug}` }}
                    >
                      {item.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-xl text-textMuted transition-[transform,color] duration-500 group-data-[active=true]/card:translate-x-1.5 group-data-[active=true]/card:text-accent"
                    >
                      →
                    </span>
                  </span>
                  <span className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 pl-[3.25rem]">
                    <span className="label inline-flex items-center gap-2 text-textSecondary">
                      <StatusDot live={item.live} />
                      {item.kind === 'competition' ? 'Competition' : item.statusLabel}
                    </span>
                    <span className="flex items-baseline gap-2">
                      <span className="whitespace-nowrap font-display text-lg font-medium tabular-nums tracking-[-0.03em] text-textPrimary">
                        {item.metric.value}
                      </span>
                      <span className="label text-textMuted">{item.metric.label}</span>
                    </span>
                  </span>
                </TransitionLink>
              </li>
            );
          })}
        </ol>
      )}

      {view === 'list' ? <WorkPreview active={pointerActive} items={items} /> : null}
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { gsap, motionAllowed, useGSAP } from '@/lib/motion/gsap';
import { useScene } from '@/lib/store/scene';
import { cn } from '@/lib/utils';

export type WorkItem = {
  slug: string;
  name: string;
  role: string;
  statusLabel: string;
  live: boolean;
  metric: { value: string; label: string };
  image?: { src: string; width: number; height: number; alt: string };
};

const pad = (n: number) => String(n).padStart(2, '0');

export function WorkIndex({ items }: { items: WorkItem[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const followRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const list = listRef.current;
      const follow = followRef.current;
      const cards = cardsRef.current;
      if (!list || !follow || !cards || !motionAllowed()) return;
      const mm = gsap.matchMedia();
      mm.add('(hover: hover) and (pointer: fine)', () => {
        const pos = { x: 0, y: 0 };
        const cur = { x: 0, y: 0 };
        let vx = 0;
        let skew = 0;
        let active = false;
        let first = true;
        const setX = gsap.quickSetter(follow, 'x', 'px');
        const setY = gsap.quickSetter(follow, 'y', 'px');
        const setSkew = gsap.quickSetter(follow, 'skewX', 'deg');
        
        const H = 240;

        const show = (idx: number) => {
          Array.from(cards.children).forEach((c, i) => {
            gsap.to(c, {
              autoAlpha: i === idx ? 1 : 0,
              clipPath: i === idx ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
              duration: 0.55,
              ease: 'expo.out',
              overwrite: true,
            });
          });
        };

        const tick = () => {
          const px = cur.x;
          cur.x += (pos.x - cur.x) * 0.14;
          cur.y += (pos.y - cur.y) * 0.14;
          vx = cur.x - px;
          skew += (Math.max(-9, Math.min(9, vx * 0.35)) - skew) * 0.2;
          setX(cur.x + 56);
          setY(cur.y - H / 2);
          setSkew(skew);
        };

        const onMove = (e: PointerEvent) => {
          pos.x = e.clientX;
          pos.y = e.clientY;
          if (first && active) {
            cur.x = pos.x;
            cur.y = pos.y;
            first = false;
          }
        };

        const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-row]'));
        const enter = (i: number, e: PointerEvent) => {
          pos.x = e.clientX;
          pos.y = e.clientY;
          if (!active) {
            cur.x = pos.x;
            cur.y = pos.y;
            active = true;
            gsap.ticker.add(tick);
          }
          first = false;
          show(i);
          gsap.to(follow, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'expo.out', overwrite: 'auto' });
        };
        const leave = () => {
          gsap.to(follow, { autoAlpha: 0, scale: 0.92, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
        };
        const leaveList = () => {
          active = false;
          first = true;
          gsap.ticker.remove(tick);
          leave();
        };

        const handlers = rows.map((row, i) => {
          const h = (e: PointerEvent) => enter(i, e);
          row.addEventListener('pointerenter', h);
          return h;
        });
        list.addEventListener('pointermove', onMove);
        list.addEventListener('pointerleave', leaveList);
        gsap.set(follow, { autoAlpha: 0, scale: 0.92 });

        return () => {
          rows.forEach((row, i) => row.removeEventListener('pointerenter', handlers[i]));
          list.removeEventListener('pointermove', onMove);
          list.removeEventListener('pointerleave', leaveList);
          gsap.ticker.remove(tick);
        };
      });
      return () => mm.revert();
    },
    { scope: listRef },
  );

  const set = (slug: string | null) => useScene.getState().setHoveredProject(slug);

  return (
    <>
      <ol
        className="work-list border-t border-surfaceBorder"
        onPointerLeave={() => set(null)}
        ref={listRef}
      >
        {items.map((item, i) => (
          <li
            className="work-row border-b border-surfaceBorder"
            data-row=""
            key={item.slug}
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') set(item.slug);
            }}
          >
            <TransitionLink
              className="group grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-4 gap-y-2 py-6 md:grid-cols-[4.5rem_minmax(0,1fr)_18rem_3rem] md:items-center md:gap-x-8 md:py-8"
              data-cursor="view"
              data-cursor-label="Open"
              href={`/projects/${item.slug}`}
              onBlur={() => set(null)}
              onFocus={() => set(item.slug)}
            >
              <span className="label tabular-nums text-textMuted">{pad(i + 1)}</span>

              <span className="work-name font-display text-[clamp(2.4rem,1rem+6.4vw,8rem)] font-medium leading-[0.98] tracking-[-0.05em] text-textPrimary">
                <span className="work-name__a">{item.name}</span>
                <span aria-hidden="true" className="work-name__b">
                  {item.name}
                </span>
              </span>

              <span className="work-arrow text-2xl text-textMuted md:order-last md:justify-self-end" aria-hidden="true">
                →
              </span>

              <span className="col-start-2 col-span-2 flex flex-col gap-1.5 md:col-span-1 md:col-start-auto">
                <span className="label flex items-center gap-2 text-textSecondary">
                  {item.live ? <span aria-hidden="true" className="live-dot" /> : null}
                  <span className={cn(item.live && 'ml-1')}>{item.statusLabel}</span>
                </span>
                <span className="label text-textMuted">
                  <span className="tabular-nums text-textPrimary">{item.metric.value}</span> {item.metric.label}
                </span>
              </span>
            </TransitionLink>
          </li>
        ))}
      </ol>

      {/* Cursor-following preview (fine pointers + motion only). */}
      <div aria-hidden="true" className="work-preview" ref={followRef} style={{ width: 352 }}>
        <div className="relative h-[240px] w-full" ref={cardsRef}>
          {items.map((item, i) => (
            <div
              className="absolute inset-0 overflow-hidden rounded-media border border-surfaceBorderStrong bg-surface"
              key={item.slug}
              style={{ visibility: 'hidden', opacity: 0 }}
            >
              {item.image ? (
                <Image
                  alt=""
                  className="h-full w-full object-cover object-top"
                  height={item.image.height}
                  sizes="800px"
                  src={item.image.src}
                  width={item.image.width}
                />
              ) : (
                <div className="flex h-full flex-col justify-between bg-surfaceRaised p-5">
                  <div className="label flex justify-between text-textMuted">
                    <span>{pad(i + 1)}</span>
                    <span>{item.role}</span>
                  </div>
                  <div>
                    <p className="font-display text-4xl font-medium tracking-[-0.04em] text-textPrimary">
                      {item.metric.value}
                    </p>
                    <p className="label mt-2 text-textSecondary">{item.metric.label}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

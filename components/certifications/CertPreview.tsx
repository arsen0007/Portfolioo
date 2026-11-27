'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { RecordItem } from '@/components/certifications/record';
import { dur, ease } from '@/lib/motion/tokens';
import { gsap, motionAllowed } from '@/lib/motion/gsap';

const W = 384;
const H = 270;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Cursor-following certificate preview (the work-index pattern): one fixed
 * element, lerped toward the pointer, velocity as skew, clip-path reveal.
 * Fine-pointer devices with motion enabled only; decorative, since every row
 * already opens the certificate.
 */
export function CertPreview({ active, items }: { active: string | null; items: RecordItem[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -999, y: -999, seen: false });
  const state = useRef({ x: -999, y: -999, visible: false });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (!motionAllowed() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const onMove = (event: PointerEvent) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      if (!target.current.seen) {
        target.current.seen = true;
        state.current.x = event.clientX;
        state.current.y = event.clientY;
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const tick = () => {
      const s = state.current;
      const t = target.current;
      const dx = t.x - s.x;
      s.x += dx * 0.13;
      s.y += (t.y - s.y) * 0.13;
      const skew = clamp(dx * 0.045, -9, 9);
      wrap.style.transform = `translate3d(${s.x + 28}px, ${s.y - H / 2}px, 0) skewX(${-skew}deg) rotate(${skew * 0.25}deg)`;
    };
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.ticker.remove(tick);
    };
  }, []);

  useEffect(() => {
    const clip = clipRef.current;
    if (!clip || !motionAllowed()) return;
    const show = active !== null;
    if (show === state.current.visible) return;
    state.current.visible = show;
    gsap.killTweensOf(clip);
    gsap.to(clip, {
      clipPath: show ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
      duration: show ? dur.md * 0.7 : dur.sm,
      ease: show ? ease.out : 'power3.inOut',
    });
  }, [active]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 hidden will-change-transform [@media(hover:hover)_and_(pointer:fine)]:block"
      ref={wrapRef}
      style={{ width: W, height: H }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-media border border-surfaceBorderStrong bg-canvas"
        ref={clipRef}
        style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      >
        {items.map((item) =>
          item.file ? (
            <div
              className="absolute inset-0 transition-opacity duration-300"
              key={item.id}
              style={{ opacity: active === item.id ? 1 : 0 }}
            >
              <Image alt="" className="object-cover" fill sizes="384px" src={item.file} />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

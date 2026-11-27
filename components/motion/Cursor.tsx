'use client';

import { useEffect, useRef, useState } from 'react';
import { lerp } from '@/lib/motion/tokens';

/**
 * Custom cursor: an 8px dot plus a ring that trails it. Any element (or
 * ancestor) with `data-cursor="view|drag|link|hide"` changes its state;
 * `data-cursor-label` sets the text shown inside the expanded ring.
 *
 * Fine pointers only, and the native cursor is never hidden (we layer on top
 * of it with mix-blend so text inputs and links keep their native affordance).
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<{ mode: string; label: string }>({ mode: 'default', label: '' });

  useEffect(() => {
    const ok =
      window.matchMedia('(pointer: fine)').matches &&
      document.documentElement.classList.contains('motion-ok');
    setEnabled(ok);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const pos = { x: -100, y: -100 };
    const dot = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      pos.x = event.clientX;
      pos.y = event.clientY;
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor], a, button');
      if (!target) {
        setState((s) => (s.mode === 'default' ? s : { mode: 'default', label: '' }));
        return;
      }
      const mode = target.dataset.cursor ?? 'link';
      const label = target.dataset.cursorLabel ?? (mode === 'view' ? 'View' : mode === 'drag' ? 'Drag' : '');
      setState((s) => (s.mode === mode && s.label === label ? s : { mode, label }));
    };
    const onLeave = () => {
      pos.x = -100;
      pos.y = -100;
    };

    const loop = () => {
      dot.x += (pos.x - dot.x) * lerp.cursor * 2.4;
      dot.y += (pos.y - dot.y) * lerp.cursor * 2.4;
      ring.x += (pos.x - ring.x) * lerp.ring;
      ring.y += (pos.y - ring.y) * lerp.ring;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  const expanded = state.mode === 'view' || state.mode === 'drag';
  const hidden = state.mode === 'hide';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[150]">
      <div className="absolute left-0 top-0" ref={ringRef}>
        <div
          className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition-[width,height,background-color,border-color,opacity] duration-500 ease-out"
          style={{
            width: expanded ? 96 : state.mode === 'link' ? 52 : 34,
            height: expanded ? 96 : state.mode === 'link' ? 52 : 34,
            borderColor: expanded ? 'transparent' : 'var(--surface-border-strong)',
            backgroundColor: expanded ? 'var(--accent)' : 'transparent',
            opacity: hidden ? 0 : 1,
          }}
        >
          <span
            className="label text-[0.68rem] text-accentFg transition-opacity duration-300"
            style={{ opacity: expanded ? 1 : 0 }}
          >
            {state.label}
          </span>
        </div>
      </div>
      <div className="absolute left-0 top-0" ref={dotRef}>
        <div
          className="h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-opacity duration-300"
          style={{ opacity: expanded || hidden ? 0 : 1 }}
        />
      </div>
    </div>
  );
}

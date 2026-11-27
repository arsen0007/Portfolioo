'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { caseStudySlugs } from '@/lib/loader-routes';
import { INTRO_KEY, loaderWillRun, signalLoaderExit } from '@/lib/loader';
import { navigationItems } from '@/lib/constants/navigation';
import { useScene } from '@/lib/store/scene';
import { cn } from '@/lib/utils';

/*
 * "Sort the queue."
 *
 * The first screen of a session is the site's idea, played by the visitor:
 * drifting, unsorted dots (the manual queue) that snap into ordered rows and
 * turn signal-orange wherever the cursor or finger passes. Meanwhile, the real
 * work happens behind it: fonts, route prefetch, the WebGL engine compiling,
 * measuring this device's frame rate and pre-building every particle shape.
 * The boot log only ticks when that work has actually finished.
 *
 * It never "ends": a handful of dots sort themselves into the TA mark and fly
 * onto the header logo, and every other dot is handed to the WebGL field as
 * its starting position, so the field you scroll through grows out of the
 * dots you just touched.
 */

const MIN_MS = 1600;
const SOFT_MS = 2700; // stop waiting on optional work (shape pre-build)
const MAX_MS = 3500;

// Must match components/layout/Wordmark.tsx
const GLYPHS = [
  '#####..###.',
  '..#...#...#',
  '..#...#...#',
  '..#...#####',
  '..#...#...#',
  '..#...#...#',
  '..#...#...#',
];
const COLS = 11;
const ROWS = 7;

type Cell = { col: number; row: number; lit: boolean; signal: boolean };
const CELLS: Cell[] = GLYPHS.flatMap((row, r) =>
  row.split('').map((ch, c) => ({ col: c, row: r, lit: ch === '#', signal: ch === '#' && r === 3 && c >= 6 })),
).sort((a, b) => Number(b.lit) - Number(a.lit));

type Line = { key: string; label: string; value: string | null };

function pad(n: number): string {
  const s = String(Math.round(n)).padStart(6, '0');
  return `${s.slice(0, 3)},${s.slice(3)}`;
}

function readVar(name: string, fallback: string): string {
  try {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  } catch {
    return fallback;
  }
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const expoInOut = (t: number) =>
  t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;

export function Loader() {
  const router = useRouter();
  const [running, setRunning] = useState(true); // matches the SSR cover; corrected on mount
  const [phase, setPhase] = useState<'boot' | 'resolve' | 'handoff'>('boot');
  const [lines, setLines] = useState<Line[]>([
    { key: 'type', label: 'type', value: null },
    { key: 'routes', label: 'routes', value: null },
    { key: 'scene', label: 'scene', value: null },
    { key: 'shapes', label: 'shapes', value: null },
    { key: 'device', label: 'device', value: null },
  ]);
  const [touch, setTouch] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!loaderWillRun()) {
      setRunning(false);
      return;
    }
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* private mode: it simply shows again next visit */
    }
    setTouch(window.matchMedia('(pointer: coarse)').matches);

    const html = document.documentElement;
    const scene = useScene.getState();
    scene.setLoaderActive(true);
    const stopLenis = () => window.__lenis?.stop();
    stopLenis();
    const lenisRetry = window.setTimeout(stopLenis, 80);
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';

    const setLine = (key: string, value: string) =>
      setLines((ls) => ls.map((l) => (l.key === key ? { ...l, value } : l)));

    /* ---------------- real work ---------------- */
    const t0 = performance.now();
    const done = { fonts: false, routes: false, scene: false, shapes: false };

    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      done.fonts = true;
      setLine('type', 'ok');
    });

    // Prefetch every destination so first clicks open instantly.
    const routes = [...navigationItems.map((n) => n.href), ...caseStudySlugs.map((s) => `/projects/${s}`)];
    routes.forEach((href) => {
      try {
        router.prefetch(href);
      } catch {
        /* prefetch is best-effort */
      }
    });
    done.routes = true;
    setLine('routes', `${routes.length} prefetched`);

    const fmtTier = (tier: string) =>
      tier === 'high' ? 'high · 94,363 pts' : tier === 'mid' ? 'mid · 32,768 pts' : 'static poster';
    const onScene = (s: ReturnType<typeof useScene.getState>) => {
      const staticTier = s.tier === 'none' || s.tier === 'low';
      if ((s.ready || staticTier) && s.tier !== 'unknown') {
        if (!done.scene) setLine('scene', fmtTier(s.tier));
        done.scene = true;
      } else if (done.scene && !s.ready) {
        // re-tiering behind the cover
        done.scene = false;
        setLine('scene', `re-tiering → ${s.tier}`);
      }
      if (staticTier) {
        if (!done.shapes) setLine('shapes', 'not needed');
        done.shapes = true;
      } else if (s.prewarm.total > 0) {
        setLine('shapes', `${s.prewarm.done}/${s.prewarm.total}`);
        if (s.prewarm.done >= s.prewarm.total) done.shapes = true;
      }
      if (s.fps !== null) setLine('device', `${s.fps} fps`);
      else if (staticTier) setLine('device', 'static field');
    };
    onScene(useScene.getState());
    const unsub = useScene.subscribe(onScene);

    /* ---------------- canvas ---------------- */
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let raf = 0;
    let W = window.innerWidth;
    let H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      if (!canvas) return;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    const bone = readVar('--text-primary', '#edeae3');
    const accent = readVar('--accent', '#ff5a1f');
    const line = readVar('--surface-border-strong', 'rgba(237,234,227,.18)');
    const mobile = W < 768;
    const N = Math.round(Math.min(1900, Math.max(560, (W * H) / (mobile ? 600 : 720))));
    const G = mobile ? 12 : 14; // sort grid
    const R = mobile ? 74 : 96; // sorting lens radius

    const x = new Float32Array(N);
    const y = new Float32Array(N);
    const hx = new Float32Array(N);
    const hy = new Float32Array(N);
    const tx = new Float32Array(N);
    const ty = new Float32Array(N);
    const sorted = new Uint8Array(N);
    const mix = new Float32Array(N); // 0 bone -> 1 signal
    const seed = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      // a soft, slightly clumped spread: a queue, not a texture
      const a = Math.random() * Math.PI * 2;
      const rr = Math.pow(Math.random(), 0.6);
      hx[i] = W / 2 + Math.cos(a) * rr * W * 0.62 + (Math.random() - 0.5) * W * 0.3;
      hy[i] = H / 2 + Math.sin(a) * rr * H * 0.62 + (Math.random() - 0.5) * H * 0.3;
      x[i] = hx[i];
      y[i] = hy[i];
      seed[i] = Math.random() * 1000;
    }

    /* ---------------- pointer / invisible hand ---------------- */
    const ptr = { x: -9999, y: -9999, last: -1e9 };
    const onMove = (e: PointerEvent) => {
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.last = performance.now();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });

    /* ---------------- exit choreography ---------------- */
    let exitAt = 0; // when the resolve phase started
    let fast = false;
    let handedOff = false;
    let finished = false;
    const assigned = new Int32Array(CELLS.length).fill(-1);
    const isCell = new Int16Array(N).fill(-1);
    const from = new Float32Array(N * 2);
    let bigCell = 0;
    let bigX = 0;
    let bigY = 0;
    let mark: DOMRect | null = null;
    const RESOLVE_MS = () => (fast ? 420 : 780);
    const HANDOFF_MS = () => (fast ? 700 : 1000);

    const beginResolve = () => {
      if (exitAt) return;
      exitAt = performance.now();
      setPhase('resolve');
      bigCell = Math.min(mobile ? W * 0.072 : W * 0.04, mobile ? 26 : 30);
      bigX = W / 2 - (COLS * bigCell) / 2 + bigCell / 2;
      bigY = H / 2 - (ROWS * bigCell) / 2 + bigCell / 2;
      // nearest free dot for each TA cell (lit cells choose first)
      CELLS.forEach((cell, ci) => {
        const cx = bigX + cell.col * bigCell;
        const cy = bigY + cell.row * bigCell;
        let best = -1;
        let bd = Infinity;
        for (let i = 0; i < N; i++) {
          if (isCell[i] >= 0) continue;
          const d = (x[i] - cx) ** 2 + (y[i] - cy) ** 2;
          if (d < bd) {
            bd = d;
            best = i;
          }
        }
        if (best >= 0) {
          assigned[ci] = best;
          isCell[best] = ci;
          from[best * 2] = x[best];
          from[best * 2 + 1] = y[best];
        }
      });
    };

    const beginHandoff = () => {
      if (handedOff) return;
      handedOff = true;
      setPhase('handoff');
      signalLoaderExit();
      const header = document.querySelector<SVGSVGElement>('header [data-mark]');
      const r = header?.getBoundingClientRect();
      mark = r && r.width > 0 && r.top < H ? r : null;
      // Hand every non-mark dot to the WebGL field as its starting point.
      const s = useScene.getState();
      if (s.ready && (s.tier === 'high' || s.tier === 'mid')) {
        const pts = new Float32Array((N - CELLS.length) * 2);
        let k = 0;
        for (let i = 0; i < N && k < pts.length; i++) {
          if (isCell[i] >= 0) continue;
          pts[k++] = x[i];
          pts[k++] = y[i];
        }
        s.setHandoff({ points: pts, width: W, height: H });
      }
      for (let i = 0; i < N; i++) {
        if (isCell[i] >= 0) {
          from[i * 2] = x[i];
          from[i * 2 + 1] = y[i];
        }
      }
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      html.classList.remove('ta-intro');
      html.style.overflow = prevOverflow;
      window.__lenis?.start();
      useScene.getState().setLoaderActive(false);
      signalLoaderExit();
      setRunning(false);
    };

    skipRef.current = () => {
      fast = true;
      beginResolve();
    };

    let shown = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const t = now - t0;

      /* progress (honest: weighted by finished work) */
      const sp = useScene.getState().prewarm;
      const shapesFrac = done.shapes ? 1 : sp.total ? sp.done / sp.total : 0;
      let target =
        (done.fonts ? 0.15 : 0) + (done.routes ? 0.1 : 0) + (done.scene ? 0.35 : 0) + shapesFrac * 0.4;
      target = Math.max(target, Math.min(0.25, t / 5000));
      if (exitAt) target = 1;
      shown += (target - shown) * (exitAt ? 0.2 : 0.06);
      if (countRef.current) countRef.current.textContent = pad(shown * 94363);
      if (barRef.current) barRef.current.style.transform = `scaleX(${shown})`;

      /* readiness */
      if (!exitAt) {
        const required = done.fonts && done.scene;
        const optional = done.shapes || t > SOFT_MS;
        if ((t > MIN_MS && required && optional) || t > MAX_MS) beginResolve();
      }
      const re = exitAt ? Math.min(1, (now - exitAt) / RESOLVE_MS()) : 0;
      if (exitAt && re >= 1 && !handedOff) beginHandoff();
      const hoStart = exitAt + RESOLVE_MS();
      const ho = handedOff ? Math.min(1, (now - hoStart) / HANDOFF_MS()) : 0;
      if (handedOff && ho >= 1) {
        finish();
        return;
      }

      /* the invisible hand: sorts on its own when nobody is touching */
      const idle = now - ptr.last > 1400;
      let px = ptr.x;
      let py = ptr.y;
      if (idle && t > 450 && !exitAt) {
        const k = t / 1000;
        px = W / 2 + Math.sin(k * 0.9) * W * 0.34 + Math.sin(k * 2.3) * W * 0.06;
        py = H / 2 + Math.sin(k * 1.3 + 1) * H * 0.26;
      }

      /* simulate */
      const k = t * 0.001;
      for (let i = 0; i < N; i++) {
        if (isCell[i] >= 0 && exitAt) continue;
        if (sorted[i]) {
          x[i] += (tx[i] - x[i]) * 0.2;
          y[i] += (ty[i] - y[i]) * 0.2;
          mix[i] += (1 - mix[i]) * 0.08;
        } else {
          const s = seed[i];
          const a = Math.sin(x[i] * 0.004 + k * 0.6 + s) + Math.cos(y[i] * 0.005 - k * 0.5 + s * 0.3);
          x[i] += Math.cos(a * 2.2) * 0.42 + (hx[i] - x[i]) * 0.004;
          y[i] += Math.sin(a * 2.2) * 0.42 + (hy[i] - y[i]) * 0.004;
          if (!exitAt) {
            const dx = x[i] - px;
            const dy = y[i] - py;
            if (dx * dx + dy * dy < R * R) {
              sorted[i] = 1;
              tx[i] = Math.round(x[i] / G) * G;
              ty[i] = Math.round(y[i] / G) * G;
            }
          }
        }
      }

      /* draw */
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const othersAlpha = handedOff ? Math.max(0, 1 - ho * 2.6) : 1;

      // unsorted queue
      if (othersAlpha > 0) {
        ctx.globalAlpha = 0.58 * othersAlpha;
        ctx.fillStyle = bone;
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          if (sorted[i] || (exitAt && isCell[i] >= 0)) continue;
          ctx.moveTo(x[i] + 1.3, y[i]);
          ctx.arc(x[i], y[i], 1.3, 0, Math.PI * 2);
        }
        ctx.fill();
        // sorted rows
        ctx.globalAlpha = othersAlpha;
        ctx.fillStyle = accent;
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          if (!sorted[i] || (exitAt && isCell[i] >= 0)) continue;
          const r = 1.3 + mix[i] * 0.9;
          ctx.moveTo(x[i] + r, y[i]);
          ctx.arc(x[i], y[i], r, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // the sorting lens
      if (!exitAt && px > -999) {
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = line;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, R, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        for (const [ax, ay] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          ctx.moveTo(px + ax * (R - 6), py + ay * (R - 6));
          ctx.lineTo(px + ax * (R + 6), py + ay * (R + 6));
        }
        ctx.stroke();
      }

      // the TA mark: forms at centre, then flies onto the header logo
      if (exitAt) {
        const e1 = easeInOut(re);
        const e2 = expoInOut(ho);
        const toCell = mark ? mark.width / COLS : bigCell;
        const toX = mark ? mark.left + toCell / 2 : bigX;
        const toY = mark ? mark.top + mark.height / 2 - ((ROWS - 1) * toCell) / 2 : bigY;
        CELLS.forEach((cell, ci) => {
          const i = assigned[ci];
          if (i < 0) return;
          const bx = bigX + cell.col * bigCell;
          const by = bigY + cell.row * bigCell;
          let cx: number;
          let cy: number;
          let size: number;
          if (!handedOff) {
            cx = from[i * 2] + (bx - from[i * 2]) * e1;
            cy = from[i * 2 + 1] + (by - from[i * 2 + 1]) * e1;
            size = bigCell;
          } else {
            const sx = toX + cell.col * toCell;
            const sy = toY + cell.row * toCell;
            cx = bx + (sx - bx) * e2;
            cy = by + (sy - by) * e2;
            size = bigCell + (toCell - bigCell) * e2;
          }
          const lit = cell.lit;
          const r = (lit ? 0.4 : 0.19) * size * (handedOff ? 1 : 0.35 + 0.65 * e1);
          ctx.globalAlpha = (lit ? 1 : 0.16) * (handedOff && !mark ? 1 - ho : 1);
          ctx.fillStyle = cell.signal ? accent : bone;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(0.6, r), 0, Math.PI * 2);
          ctx.fill();
        });
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(frame);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skipRef.current();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(lenisRetry);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      window.removeEventListener('keydown', onKey);
      unsub();
      if (!finished) {
        html.classList.remove('ta-intro');
        html.style.overflow = prevOverflow;
        window.__lenis?.start();
        useScene.getState().setLoaderActive(false);
        signalLoaderExit();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!running) return null;

  const leaving = phase !== 'boot';

  return (
    <div className="ta-intro-cover fixed inset-0 z-[300]" data-phase={phase}>
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 bg-canvas transition-opacity ease-in-out',
          phase === 'handoff' ? 'opacity-0 duration-1000' : 'opacity-100 duration-0',
        )}
      />
      <canvas aria-hidden="true" className="absolute inset-0 h-full w-full" ref={canvasRef} />

      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 flex flex-col justify-between px-[var(--gutter)] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] transition-[opacity,transform] duration-500 ease-out',
          leaving && 'translate-y-[-8px] opacity-0',
        )}
      >
        <div className="label space-y-1.5 text-textMuted">
          <p className="text-textSecondary">
            <span className="text-accent">●</span> signal/26 · cold start
          </p>
          {lines.map((l) => (
            <p className="flex gap-3" key={l.key}>
              <span className="w-16">{l.label}</span>
              <span className={l.value ? 'text-textPrimary' : 'animate-pulse'}>{l.value ?? '···'}</span>
            </p>
          ))}
        </div>

        <div>
          <p className="label mb-3 text-textMuted">{touch ? 'Touch to sort the queue' : 'Move to sort the queue'}</p>
          <p className="font-display text-[clamp(3.25rem,12vw,10rem)] font-medium leading-[0.85] tracking-[-0.055em] tabular-nums text-textPrimary">
            <span ref={countRef}>000,000</span>
          </p>
          <div className="mt-5 h-px w-full bg-surfaceBorder">
            <span className="block h-px origin-left scale-x-0 bg-accent" ref={barRef} />
          </div>
          <div className="label mt-3 flex items-center justify-between text-textMuted">
            <span>Records sorted</span>
            <span>094,363</span>
          </div>
        </div>
      </div>

      <button
        className={cn(
          'label absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[var(--gutter)] inline-flex min-h-11 translate-y-[-4.25rem] items-center gap-2 rounded-full border border-surfaceBorderStrong px-4 text-textSecondary transition-opacity duration-300 hover:text-textPrimary sm:translate-y-[-4.75rem]',
          leaving && 'pointer-events-none opacity-0',
        )}
        onClick={() => skipRef.current()}
        type="button"
      >
        Skip intro <span aria-hidden="true">↵</span>
      </button>
    </div>
  );
}

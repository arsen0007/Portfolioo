'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, type KeyboardEvent, type FocusEvent } from 'react';
import { buttonClasses } from '@/components/ui/Button';
import { certs, type Cert } from '@/lib/data/certifications';
import { gsap, motionAllowed, useGSAP } from '@/lib/motion/gsap';

/** Newest first; anything not yet issued goes last. */
function byIssueDate(a: Cert, b: Cert): number {
  const time = (cert: Cert) => (cert.issued ? Date.parse(cert.issued) : Number.NEGATIVE_INFINITY);
  return time(b) - time(a);
}

const sorted = [...certs].sort(byIssueDate);

function fullTitle(cert: Cert): string {
  return cert.subtitle ? `${cert.title} ${cert.subtitle}` : cert.title;
}

const two = (n: number) => String(n).padStart(2, '0');

type StripControls = {
  /** Move by one card (-1 / +1), or jump to an end (-Infinity / Infinity). */
  nudge: (direction: number) => void;
  /** Bring a focused card fully into view. */
  reveal: (card: HTMLElement) => void;
};

/**
 * Every certificate as a card on one horizontal strip.
 *
 * Desktop with motion: the strip is moved with transforms only. Drag it with
 * the pointer, push it with a horizontal wheel, or use the arrow keys; it
 * glides with momentum and each card tilts a little with the strip's speed.
 * Touch and reduced motion: the same strip is a native scroll-snap scroller.
 * Cards are real buttons and links in DOM order, so it works with a keyboard
 * and with scripts off. "View" opens the certificate in a native modal dialog
 * (focus trap, Esc to close and focus return come from the platform).
 */
export function CertificateGallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const controls = useRef<StripControls | null>(null);

  const active = sorted.find((cert) => cert.id === activeId) ?? null;

  function open(cert: Cert, trigger: HTMLElement) {
    triggerRef.current = trigger;
    setActiveId(cert.id);
    dialogRef.current?.showModal();
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const vp = viewport.current;
        const tr = track.current;
        if (!vp || !tr || !motionAllowed()) return;

        vp.dataset.drag = 'on';
        const cards = Array.from(tr.children) as HTMLElement[];
        const tilt = cards.map((card) => ({
          rotate: gsap.quickSetter(card, 'rotation', 'deg') as (v: number) => void,
          skew: gsap.quickSetter(card, 'skewX', 'deg') as (v: number) => void,
        }));

        let x = 0;
        let target = 0;
        let min = 0;
        let dragging = false;
        let captured = false;
        let suppressClick = false;
        let startX = 0;
        let startTarget = 0;
        let lastX = 0;
        let lastT = 0;
        let velocity = 0; // px per ms, smoothed
        let lastTilt = 0;

        const measure = () => {
          min = Math.min(0, vp.clientWidth - tr.offsetWidth);
          target = Math.max(min, Math.min(0, target));
        };
        const clamp = (v: number) => Math.max(min, Math.min(0, v));
        measure();

        const tick = (_: number, deltaTime: number) => {
          const ease = 1 - Math.pow(1 - 0.1, (deltaTime / 1000) * 60);
          const next = x + (target - x) * ease;
          const speed = next - x;
          x = Math.abs(target - next) < 0.05 ? target : next;
          const t = Math.max(-5, Math.min(5, speed * 0.16));
          if (x === target && t === 0 && lastTilt === 0) return;
          tr.style.transform = `translate3d(${x}px,0,0)`;
          if (bar.current) bar.current.style.transform = `scaleX(${min === 0 ? 0 : Math.max(0.02, x / min)})`;
          if (Math.abs(t - lastTilt) > 0.01 || t === 0) {
            tilt.forEach((q) => {
              q.rotate(t * 0.6);
              q.skew(t * -0.8);
            });
            lastTilt = Math.abs(t) < 0.02 ? 0 : t;
          }
        };
        gsap.ticker.add(tick);

        const onDown = (event: PointerEvent) => {
          if (event.button !== 0) return;
          dragging = true;
          captured = false;
          startX = lastX = event.clientX;
          lastT = performance.now();
          startTarget = target;
          velocity = 0;
        };
        const onMove = (event: PointerEvent) => {
          if (!dragging) return;
          const dx = event.clientX - startX;
          if (!captured && Math.abs(dx) > 6) {
            captured = true;
            vp.setPointerCapture(event.pointerId);
            vp.dataset.dragging = 'true';
          }
          if (!captured) return;
          const raw = startTarget + dx;
          // Rubber band past either end.
          target = raw > 0 ? raw * 0.35 : raw < min ? min + (raw - min) * 0.35 : raw;
          const now = performance.now();
          const dt = Math.max(1, now - lastT);
          velocity = velocity * 0.6 + ((event.clientX - lastX) / dt) * 0.4;
          lastX = event.clientX;
          lastT = now;
        };
        const onUp = (event: PointerEvent) => {
          if (!dragging) return;
          dragging = false;
          if (captured) {
            suppressClick = true;
            window.setTimeout(() => (suppressClick = false), 0);
            if (vp.hasPointerCapture(event.pointerId)) vp.releasePointerCapture(event.pointerId);
            delete vp.dataset.dragging;
            target = clamp(target + velocity * 320);
          }
        };
        const onClick = (event: MouseEvent) => {
          if (!suppressClick) return;
          event.preventDefault();
          event.stopPropagation();
        };
        const onWheel = (event: WheelEvent) => {
          const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.shiftKey ? event.deltaY : 0;
          if (!delta) return;
          event.preventDefault();
          target = clamp(target - delta);
        };
        const onResize = () => measure();

        vp.addEventListener('pointerdown', onDown);
        vp.addEventListener('pointermove', onMove);
        vp.addEventListener('pointerup', onUp);
        vp.addEventListener('pointercancel', onUp);
        vp.addEventListener('click', onClick, true);
        vp.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('resize', onResize);

        controls.current = {
          nudge: (direction) => {
            const step = (cards[0]?.offsetWidth ?? 360) + 24;
            target = clamp(Number.isFinite(direction) ? target - direction * step : direction > 0 ? min : 0);
          },
          reveal: (card) => {
            const gutter = parseFloat(getComputedStyle(tr).paddingLeft) || 0;
            const left = card.offsetLeft + x;
            if (left < gutter) target = clamp(target + (gutter - left));
            else if (left + card.offsetWidth > vp.clientWidth - gutter) {
              target = clamp(target - (left + card.offsetWidth - (vp.clientWidth - gutter)));
            }
          },
        };

        return () => {
          controls.current = null;
          gsap.ticker.remove(tick);
          vp.removeEventListener('pointerdown', onDown);
          vp.removeEventListener('pointermove', onMove);
          vp.removeEventListener('pointerup', onUp);
          vp.removeEventListener('pointercancel', onUp);
          vp.removeEventListener('click', onClick, true);
          vp.removeEventListener('wheel', onWheel);
          window.removeEventListener('resize', onResize);
          delete vp.dataset.drag;
          delete vp.dataset.dragging;
          tr.style.transform = '';
          gsap.set(cards, { clearProps: 'rotation,skewX,transform' });
        };
      });
      return () => mm.revert();
    },
    { scope: viewport },
  );

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, End: Infinity, Home: -Infinity };
    const direction = keys[event.key];
    if (direction === undefined) return;
    if ((event.target as HTMLElement).closest('input, textarea, select')) return;
    event.preventDefault();
    if (controls.current) {
      controls.current.nudge(direction);
      return;
    }
    const vp = viewport.current;
    if (!vp) return;
    const card = track.current?.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 320) + 24;
    if (Number.isFinite(direction)) vp.scrollBy({ left: direction * step, behavior: 'smooth' });
    else vp.scrollTo({ left: direction > 0 ? vp.scrollWidth : 0, behavior: 'smooth' });
  }

  function onFocus(event: FocusEvent<HTMLDivElement>) {
    const card = (event.target as HTMLElement).closest<HTMLElement>('[data-card]');
    if (card) controls.current?.reveal(card);
  }

  function onNativeScroll() {
    const vp = viewport.current;
    if (!vp || controls.current || !bar.current) return;
    const max = vp.scrollWidth - vp.clientWidth;
    bar.current.style.transform = `scaleX(${max > 0 ? Math.max(0.02, vp.scrollLeft / max) : 1})`;
  }

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div onFocus={onFocus} onKeyDown={onKeyDown}>
        <div
          aria-label="Certificates. Use the left and right arrow keys to move along the strip."
          className="snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-6 [scroll-padding-inline:max(var(--gutter),calc((100vw_-_90rem)/2_+_var(--gutter)))] data-[drag=on]:cursor-grab data-[drag=on]:touch-pan-y data-[drag=on]:select-none data-[drag=on]:snap-none data-[drag=on]:overflow-x-clip data-[dragging=true]:cursor-grabbing"
          data-cursor="drag"
          data-lenis-prevent-wheel=""
          onScroll={onNativeScroll}
          ref={viewport}
          role="region"
          tabIndex={-1}
        >
          <ul className="flex w-max gap-6 px-[max(var(--gutter),calc((100vw_-_90rem)/2_+_var(--gutter)))] will-change-transform" ref={track}>
            {sorted.map((cert, index) => (
              <li
                className="w-[min(82vw,24rem)] shrink-0 snap-start"
                data-card=""
                key={cert.id}
              >
                {cert.file ? (
                  <button
                    aria-haspopup="dialog"
                    aria-label={`View ${fullTitle(cert)} certificate`}
                    className="group relative block aspect-[1.42/1] w-full overflow-hidden border border-surfaceBorderStrong bg-surface"
                    data-cursor="drag"
                    onClick={(event) => open(cert, event.currentTarget)}
                    type="button"
                  >
                    <Image
                      alt=""
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                      draggable={false}
                      fill
                      sizes="(min-width: 1024px) 384px, 82vw"
                      src={cert.file}
                    />
                  </button>
                ) : (
                  <div className="flex aspect-[1.42/1] w-full items-center justify-center border border-dashed border-surfaceBorderStrong">
                    <span className="label text-textMuted">In progress</span>
                  </div>
                )}

                <div className="mt-5">
                  <p className="label flex items-center justify-between gap-4 text-textMuted">
                    <span>
                      <span className="text-accent">{two(index + 1)}</span> / {two(sorted.length)}
                    </span>
                    <span>{cert.level}</span>
                  </p>
                  <h3 className="mt-3 font-display text-h3 font-medium text-textPrimary">{fullTitle(cert)}</h3>
                  <p className="label mt-2 text-textMuted">
                    {cert.issuer} ·{' '}
                    {cert.issued ?? `In progress${cert.expectedCompletion ? ` · est. ${cert.expectedCompletion}` : ''}`}
                  </p>
                  {cert.appliedTo ? (
                    cert.appliedTo.href ? (
                      <Link
                        className="group/link mt-3 flex min-h-11 items-start gap-2 py-1 text-small text-textSecondary hover:text-textPrimary"
                        href={cert.appliedTo.href}
                      >
                        <span>
                          Used in:{' '}
                          <span className="underline decoration-surfaceBorderStrong underline-offset-4 group-hover/link:decoration-accent">
                            {cert.appliedTo.label}
                          </span>
                        </span>
                        <span aria-hidden="true" className="text-textMuted">
                          →
                        </span>
                      </Link>
                    ) : (
                      <p className="mt-3 text-small text-textSecondary">Used in: {cert.appliedTo.label}</p>
                    )
                  ) : null}
                  {cert.link ? (
                    <a
                      className={buttonClasses('link', 'md', 'mt-1 justify-start text-small')}
                      href={cert.link}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Verify with issuer ↗
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto flex w-full max-w-page items-center gap-6 px-[var(--gutter)]">
          <div aria-hidden="true" className="h-px flex-1 bg-surfaceBorder">
            <span className="block h-px origin-left bg-accent" ref={bar} style={{ transform: 'scaleX(0.05)' }} />
          </div>
          <p aria-hidden="true" className="label shrink-0 text-textMuted">
            <span className="hidden lg:inline">Drag · Scroll · ← →</span>
            <span className="lg:hidden">Swipe →</span>
          </p>
        </div>
      </div>

      <dialog
        aria-label={active ? `${fullTitle(active)} certificate` : 'Certificate'}
        className="m-auto max-h-[92dvh] w-[min(92vw,64rem)] overflow-y-auto rounded-media border border-surfaceBorder bg-surface p-0 text-textPrimary backdrop:bg-black/60"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        onClose={() => {
          setActiveId(null);
          triggerRef.current?.focus();
        }}
        ref={dialogRef}
      >
        {active ? (
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-h3 text-textPrimary">{fullTitle(active)}</h2>
                <p className="mt-1 text-small text-textMuted">
                  {active.issuer}
                  {active.issued ? ` · Issued ${active.issued}` : ''}
                </p>
              </div>
              <button
                autoFocus
                className={buttonClasses('secondary', 'md')}
                onClick={() => dialogRef.current?.close()}
                type="button"
              >
                Close
              </button>
            </div>

            {active.file ? (
              <div className="relative mt-5 aspect-[1.42/1] w-full overflow-hidden rounded-control bg-surfaceRaised">
                <Image
                  alt={`${fullTitle(active)} certificate issued to Tousif Ali by ${active.issuer}`}
                  className="object-contain"
                  fill
                  sizes="(min-width: 1024px) 960px, 92vw"
                  src={active.file}
                />
              </div>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-x-6">
              {active.file ? (
                <a
                  className={buttonClasses('link', 'md')}
                  href={active.file}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Open full size ↗
                </a>
              ) : null}
              {active.link ? (
                <a
                  className={buttonClasses('link', 'md')}
                  href={active.link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Verify with issuer ↗
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

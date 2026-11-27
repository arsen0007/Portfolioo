'use client';

import Image from 'next/image';
import { useEffect, useRef, type KeyboardEvent } from 'react';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { buttonClasses } from '@/components/ui/Button';
import { pad, type RecordItem } from '@/components/certifications/record';

type Props = {
  items: RecordItem[];
  activeId: string | null;
  onChange: (id: string | null) => void;
  /** Where focus returns when the dialog closes. */
  returnTo: React.MutableRefObject<HTMLElement | null>;
};

/**
 * Native modal dialog: focus trap, Esc and inert background come from the
 * platform. Adds prev/next (buttons and arrow keys), focus return and a
 * verify link.
 */
export function CertLightbox({ activeId, items, onChange, returnTo }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const index = items.findIndex((item) => item.id === activeId);
  const active = index >= 0 ? items[index] : null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (active && !dialog.open) dialog.showModal();
    if (!active && dialog.open) dialog.close();
  }, [active]);

  const go = (step: number) => {
    if (!items.length) return;
    const next = items[(index + step + items.length) % items.length];
    returnTo.current = document.querySelector<HTMLElement>(`[data-cert-open="${next.id}"]`) ?? returnTo.current;
    onChange(next.id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    }
  };

  return (
    <dialog
      aria-label={active ? `${active.fullTitle} certificate` : 'Certificate'}
      className="m-auto max-h-[94dvh] w-[min(94vw,62rem)] overflow-y-auto overscroll-contain border border-surfaceBorderStrong bg-canvas p-0 text-textPrimary backdrop:bg-black/70"
      data-lenis-prevent=""
      onClick={(event) => {
        if (event.target === event.currentTarget) onChange(null);
      }}
      onClose={() => {
        onChange(null);
        returnTo.current?.focus({ preventScroll: true });
      }}
      onKeyDown={onKeyDown}
      ref={ref}
    >
      {active ? (
        <div className="p-4 sm:p-7">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="label text-textMuted">
                <span className="text-accent tabular-nums">{pad(active.number)}</span> / {pad(items.length)} ·{' '}
                {active.level}
              </p>
              <h2 className="mt-3 font-display text-h3 font-medium text-textPrimary">{active.fullTitle}</h2>
              <p className="label mt-2 text-textMuted">
                {active.issuer} ·{' '}
                {active.issued
                  ? `Issued ${active.issued}`
                  : `In progress${active.expectedCompletion ? ` · expected ${active.expectedCompletion}` : ''}`}
              </p>
            </div>
            <button
              autoFocus
              className={buttonClasses('secondary', 'md', 'shrink-0')}
              onClick={() => onChange(null)}
              type="button"
            >
              Close
            </button>
          </div>

          {active.file ? (
            <div className="relative mt-6 h-[clamp(13rem,50dvh,40rem)] w-full overflow-hidden border border-surfaceBorder bg-surface">
              <Image
                alt={`${active.fullTitle} certificate issued to Tousif Ali by ${active.issuer}`}
                className="object-contain"
                fill
                key={active.id}
                sizes="(min-width: 1024px) 940px, 94vw"
                src={active.file}
              />
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-4 border-t border-surfaceBorder pt-5 md:flex-row md:items-start md:justify-between">
            <div className="max-w-[52ch]">
              <p className="label text-textMuted">Applied to</p>
              {active.appliedTo ? (
                active.appliedTo.href ? (
                  <TransitionLink
                    className="mt-1 inline-flex min-h-11 items-center text-small text-textPrimary underline decoration-surfaceBorderStrong underline-offset-4 hover:decoration-accent"
                    href={active.appliedTo.href}
                  >
                    {active.appliedTo.label}&nbsp;→
                  </TransitionLink>
                ) : (
                  <p className="mt-2 text-small text-textPrimary">{active.appliedTo.label}</p>
                )
              ) : (
                <p className="label mt-3 text-textSecondary">Not yet applied</p>
              )}
            </div>
            <div className="flex flex-wrap gap-x-6">
              {active.file ? (
                <a className={buttonClasses('link', 'md')} href={active.file} rel="noopener noreferrer" target="_blank">
                  Open full size ↗
                </a>
              ) : null}
              {active.link ? (
                <a className={buttonClasses('link', 'md')} href={active.link} rel="noopener noreferrer" target="_blank">
                  Verify with issuer ↗
                </a>
              ) : null}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-surfaceBorder pt-4">
            <button
              className="label inline-flex min-h-11 items-center gap-2 pr-4 text-textSecondary hover:text-textPrimary"
              onClick={() => go(-1)}
              type="button"
            >
              <span aria-hidden="true">←</span> Previous
            </button>
            <p aria-hidden="true" className="label hidden text-textMuted sm:block">
              ← → to browse · Esc to close
            </p>
            <button
              className="label inline-flex min-h-11 items-center gap-2 pl-4 text-textSecondary hover:text-textPrimary"
              onClick={() => go(1)}
              type="button"
            >
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

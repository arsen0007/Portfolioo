'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CertLightbox } from '@/components/certifications/CertLightbox';
import { CertPreview } from '@/components/certifications/CertPreview';
import { pad, recordItems, TRACKS, type RecordItem, type Track } from '@/components/certifications/record';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { gsap, motionAllowed } from '@/lib/motion/gsap';
import { dur, ease } from '@/lib/motion/tokens';

type TrackFilter = 'all' | Track;
type StatusFilter = 'all' | 'completed' | 'in-progress';

const pill =
  'label inline-flex min-h-11 items-center gap-2 rounded-full border border-surfaceBorderStrong px-4 text-textSecondary transition-colors duration-300 hover:border-textPrimary hover:text-textPrimary aria-pressed:border-textPrimary aria-pressed:bg-textPrimary aria-pressed:text-canvas';

function StatusMark({ done }: { done: boolean }) {
  return done ? (
    <span aria-hidden="true" className="h-[7px] w-[7px] shrink-0 rounded-full bg-accent" />
  ) : (
    <span aria-hidden="true" className="h-[7px] w-[7px] shrink-0 rounded-full border border-textMuted" />
  );
}

function Applied({ item }: { item: RecordItem }) {
  if (!item.appliedTo) {
    return (
      <div>
        <p className="label text-textMuted">Applied to</p>
        <p className="label mt-1.5 inline-flex items-center gap-2 text-textSecondary">
          <span aria-hidden="true" className="h-px w-3 bg-textMuted" />
          Not yet applied
        </p>
      </div>
    );
  }
  return (
    <div>
      <p className="label text-textMuted">Applied to</p>
      {item.appliedTo.href ? (
        <TransitionLink
          className="group/link relative z-10 mt-0.5 inline-flex min-h-11 items-start gap-2 py-2 text-small text-textPrimary lg:min-h-0 lg:py-1"
          href={item.appliedTo.href}
        >
          <span className="max-w-[40ch] underline decoration-surfaceBorderStrong underline-offset-4 transition-colors group-hover/link:decoration-accent">
            {item.appliedTo.label}
          </span>
          <span
            aria-hidden="true"
            className="text-textMuted transition-[transform,color] duration-500 group-hover/link:translate-x-1 group-hover/link:text-accent"
          >
            →
          </span>
        </TransitionLink>
      ) : (
        <p className="mt-1.5 max-w-[40ch] text-small text-textPrimary">{item.appliedTo.label}</p>
      )}
    </div>
  );
}

export function CertificateRecord() {
  const [track, setTrack] = useState<TrackFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [hover, setHover] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  const visible = useMemo(
    () =>
      recordItems.filter(
        (item) => (track === 'all' || item.track === track) && (status === 'all' || item.status === status),
      ),
    [track, status],
  );
  const hasInProgress = recordItems.some((item) => item.status === 'in-progress');

  // Rows rise in when the filter changes.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const list = listRef.current;
    if (!list || !motionAllowed()) return;
    gsap.fromTo(
      list.children,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: dur.md * 0.7, ease: ease.out, stagger: 0.04, clearProps: 'transform,opacity,visibility' },
    );
  }, [track, status]);

  const open = useCallback((id: string, trigger: HTMLElement) => {
    returnTo.current = trigger;
    setHover(null);
    setOpenId(id);
  }, []);

  const trackCount = (id: TrackFilter) =>
    recordItems.filter((i) => (id === 'all' || i.track === id) && (status === 'all' || i.status === status)).length;

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-surfaceBorder py-4 lg:flex-row lg:items-center lg:justify-between">
        <div aria-label="Filter by track" className="flex flex-wrap gap-2" role="group">
          {([{ id: 'all', label: 'All' }, ...TRACKS] as { id: TrackFilter; label: string }[]).map((t) => (
            <button
              aria-pressed={track === t.id}
              className={pill}
              key={t.id}
              onClick={() => {
                setHover(null);
                setTrack(t.id);
              }}
              type="button"
            >
              {t.label}
              <span className="tabular-nums opacity-60">{pad(trackCount(t.id))}</span>
            </button>
          ))}
        </div>
        {hasInProgress ? (
          <div aria-label="Filter by status" className="flex flex-wrap gap-2" role="group">
            {(
              [
                { id: 'all', label: 'Any status' },
                { id: 'completed', label: 'Completed' },
                { id: 'in-progress', label: 'In progress' },
              ] as { id: StatusFilter; label: string }[]
            ).map((s) => (
              <button
                aria-pressed={status === s.id}
                className="label inline-flex min-h-11 items-center rounded-full border border-transparent px-4 text-textMuted transition-colors hover:text-textPrimary aria-pressed:border-surfaceBorderStrong aria-pressed:text-textPrimary"
                key={s.id}
                onClick={() => {
                  setHover(null);
                  setStatus(s.id);
                }}
                type="button"
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {visible.length} of {recordItems.length} certificates
      </p>

      <ol className="mt-2" ref={listRef}>
        {visible.map((item) => {
          const done = item.status === 'completed';
          const on = hover === item.id;
          return (
            <li
              className="group/row relative border-t border-surfaceBorder transition-opacity duration-500 last:border-b lg:data-[dim=true]:opacity-30"
              data-active={on}
              data-cursor="view"
              data-cursor-label="View"
              data-dim={hover !== null && !on}
              key={item.id}
              onBlur={() => setHover(null)}
              onFocus={() => setHover(item.id)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(item.id)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(null)}
            >
              <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-x-5 gap-y-4 py-6 sm:grid-cols-[9rem_minmax(0,1fr)] md:py-8 lg:grid-cols-[3.5rem_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.8fr)] lg:items-center lg:gap-x-8 lg:py-9">
                {/* Mobile thumbnail */}
                <div className="relative col-start-1 row-start-1 aspect-[1.42/1] overflow-hidden border border-surfaceBorder bg-surface lg:hidden">
                  {item.file ? (
                    <Image
                      alt=""
                      className="object-cover"
                      fill
                      sizes="(min-width: 640px) 144px, 104px"
                      src={item.file}
                    />
                  ) : null}
                </div>

                <span className="label hidden tabular-nums text-textMuted transition-colors duration-300 group-data-[active=true]/row:text-accent lg:block">
                  {pad(item.number)}
                </span>

                <div className="col-start-2 min-w-0 lg:col-start-2">
                  <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-textMuted">
                    <span className="tabular-nums lg:hidden">{pad(item.number)}</span>
                    <span>{item.level}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.issuer}</span>
                  </p>
                  <h3 className="mt-2 font-display text-[clamp(1.35rem,4.6vw,1.9rem)] font-medium leading-[1.08] tracking-[-0.035em] text-textPrimary lg:mt-3 lg:text-[clamp(2rem,3.9vw,3.6rem)] lg:leading-[1.02]">
                    <button
                      aria-haspopup="dialog"
                      className="block text-left after:absolute after:inset-0 after:content-['']"
                      data-cert-open={item.id}
                      onClick={(e) => open(item.id, e.currentTarget)}
                      type="button"
                    >
                      <span className="relative block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                        <span className="block transition-[transform,opacity] duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:group-data-[active=true]/row:-translate-y-[108%] lg:group-data-[active=true]/row:opacity-0">
                          {item.title}
                        </span>
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 hidden translate-y-[108%] font-serif font-normal italic text-accent opacity-0 transition-[transform,opacity] duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:block lg:group-data-[active=true]/row:translate-y-0 lg:group-data-[active=true]/row:opacity-100"
                        >
                          {item.title}
                        </span>
                      </span>
                      {item.subtitle ? <span className="sr-only"> {item.subtitle}</span> : null}
                    </button>
                  </h3>
                  {item.subtitle ? (
                    <p aria-hidden="true" className="label mt-2 text-textMuted">
                      {item.subtitle}
                    </p>
                  ) : null}
                  <p className="label mt-3 inline-flex items-center gap-2 text-textSecondary lg:hidden">
                    <StatusMark done={done} />
                    {done ? item.issued : `Expected ${item.expectedCompletion ?? 'soon'}`}
                  </p>
                </div>

                <div className="col-span-2 col-start-1 lg:col-span-1 lg:col-start-3">
                  <Applied item={item} />
                </div>

                <div className="hidden lg:col-start-4 lg:flex lg:flex-col lg:gap-2">
                  <span className="label inline-flex items-center gap-2 text-textSecondary">
                    <StatusMark done={done} />
                    {done ? 'Completed' : 'In progress'}
                  </span>
                  <span className="label tabular-nums text-textMuted">
                    {done ? item.issued : `Expected ${item.expectedCompletion ?? 'soon'}`}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <CertPreview active={hover} items={recordItems} />
      <CertLightbox activeId={openId} items={visible} onChange={setOpenId} returnTo={returnTo} />
    </div>
  );
}

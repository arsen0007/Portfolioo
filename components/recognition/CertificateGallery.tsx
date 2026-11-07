'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { buttonClasses } from '@/components/ui/Button';
import { certs, type Cert } from '@/lib/data/certifications';

/** Newest first; anything not yet issued goes last. */
function byIssueDate(a: Cert, b: Cert): number {
  const time = (cert: Cert) => (cert.issued ? Date.parse(cert.issued) : Number.NEGATIVE_INFINITY);
  return time(b) - time(a);
}

const sorted = [...certs].sort(byIssueDate);

function fullTitle(cert: Cert): string {
  return cert.subtitle ? `${cert.title} ${cert.subtitle}` : cert.title;
}

/**
 * Every certificate as a scannable row. "View" opens the certificate in a
 * native modal dialog (focus trap, Esc to close and focus return come from the
 * platform); "Verify" is a plain link to the issuer's page so it also works
 * without JavaScript.
 */
export function CertificateGallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = sorted.find((cert) => cert.id === activeId) ?? null;

  function open(cert: Cert, trigger: HTMLElement) {
    triggerRef.current = trigger;
    setActiveId(cert.id);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <ul className="border-t border-surfaceBorder">
        {sorted.map((cert) => (
          <li
            className="grid gap-x-8 gap-y-4 border-b border-surfaceBorder py-6 sm:grid-cols-[9rem_1fr_auto]"
            key={cert.id}
          >
            <p className="text-small text-textMuted">
              {cert.issued ?? `In progress${cert.expectedCompletion ? ` · est. ${cert.expectedCompletion}` : ''}`}
            </p>

            <div>
              <h3 className="font-display text-h3 text-textPrimary">{fullTitle(cert)}</h3>
              <p className="mt-1 text-small text-textMuted">
                {cert.issuer} · {cert.level}
              </p>
              {cert.appliedTo ? (
                cert.appliedTo.href ? (
                  <Link
                    className="group mt-2 flex min-h-11 max-w-prose items-center gap-2 py-2 text-small text-textSecondary hover:text-textPrimary"
                    href={cert.appliedTo.href}
                  >
                    <span>
                      Used in:{' '}
                      <span className="underline decoration-surfaceBorderStrong underline-offset-4 group-hover:decoration-accent">
                        {cert.appliedTo.label}
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-textMuted">
                      →
                    </span>
                  </Link>
                ) : (
                  <p className="mt-3 max-w-prose text-small text-textSecondary">
                    Used in: {cert.appliedTo.label}
                  </p>
                )
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-stretch">
              {cert.file ? (
                <button
                  aria-haspopup="dialog"
                  className={buttonClasses('secondary', 'md')}
                  onClick={(event) => open(cert, event.currentTarget)}
                  type="button"
                >
                  View certificate
                </button>
              ) : null}
              {cert.link ? (
                <a
                  className={buttonClasses('link', 'md', 'justify-start sm:justify-center')}
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

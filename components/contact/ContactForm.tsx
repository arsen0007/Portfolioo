'use client';

import { useState, type FormEvent } from 'react';
import { Magnetic } from '@/components/motion/Magnetic';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type FieldName = 'name' | 'email' | 'message';

const EMAIL = 'tousifarsen@gmail.com';

// The sentence is the interface. Everything shares one size so the inputs read
// as words in the line. 16px minimum keeps iOS from zooming on focus.
const sentence = 'font-display text-[clamp(1.5rem,1rem+2.6vw,3.4rem)] font-medium leading-[1.4] tracking-[-0.03em]';

const inline =
  'inline-block max-w-full border-0 border-b-2 border-surfaceBorderStrong bg-transparent px-1 pb-0.5 align-baseline font-serif font-normal italic tracking-[-0.01em] text-textPrimary transition-colors duration-300 placeholder:text-textMuted aria-[invalid=true]:border-danger focus:border-accent';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [invalid, setInvalid] = useState<FieldName[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setError(null);
    setInvalid([]);

    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
          company: data.get('company'),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        const message = payload?.error ?? 'Something went wrong.';
        setError(message);
        // Mark whichever fields the server is complaining about.
        const flagged = (['name', 'email', 'message'] as const).filter((field) => {
          const value = data.get(field);
          return typeof value !== 'string' || value.trim() === '' || (field === 'email' && /email address/i.test(message));
        });
        setInvalid(response.status === 400 ? [...flagged] : []);
        setStatus('error');
        return;
      }

      trackEvent('contact_form_submit', { location: 'contact_page' });
      setStatus('sent');
    } catch {
      setError('Could not reach the server.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div aria-live="polite" className="border-t border-surfaceBorderStrong pt-10" role="status">
        <p className="flex items-center gap-3 label text-textMuted">
          <span aria-hidden="true" className="live-dot" /> Delivered
        </p>
        <p className="mt-5 font-display text-h1 font-medium text-textPrimary">
          Message <em className="font-serif font-normal italic tracking-[-0.02em]">sent.</em>
        </p>
        <p className="mt-6 max-w-md text-lead text-textSecondary">
          I read everything that comes through here. You should hear back within a day or so.
        </p>
      </div>
    );
  }

  const aria = (field: FieldName) => ({
    'aria-describedby': status === 'error' && error ? 'contact-error' : undefined,
    'aria-invalid': invalid.includes(field) ? (true as const) : undefined,
  });

  return (
    <form className="grid gap-10" noValidate onSubmit={handleSubmit}>
      {/* Honeypot: hidden from real users and from assistive technology. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="company">Company</label>
        <input autoComplete="off" id="company" name="company" tabIndex={-1} type="text" />
      </div>

      <div className={`${sentence} text-textSecondary`}>
        <label htmlFor="name">
          Hi Tousif, I&apos;m<span className="sr-only"> (your name)</span>
        </label>{' '}
        <input
          autoComplete="name"
          className={`${inline} w-[min(100%,9em)]`}
          id="name"
          name="name"
          placeholder="your name"
          required
          type="text"
          {...aria('name')}
        />
        <span aria-hidden="true">. </span>
        <label htmlFor="email">
          You can reach me at<span className="sr-only"> (your email)</span>
        </label>{' '}
        <input
          autoComplete="email"
          className={`${inline} w-[min(100%,13em)]`}
          id="email"
          inputMode="email"
          name="email"
          placeholder="you@company.com"
          required
          type="email"
          {...aria('email')}
        />
        <span aria-hidden="true">.</span>
      </div>

      <div className={`${sentence} text-textSecondary`}>
        <label htmlFor="message">
          Here&apos;s what we&apos;re doing by hand
          <span className="sr-only"> (the manual process, roughly how much time it eats, and who does it today)</span>:
        </label>
        <textarea
          className={`${inline} mt-4 block min-h-[9em] w-full resize-y border-2 px-4 py-3 text-[0.62em] leading-[1.5] tracking-[-0.01em] sm:min-h-[7em]`}
          id="message"
          name="message"
          placeholder="The manual process, roughly how much time it eats, and who does it today."
          required
          {...aria('message')}
        />
      </div>

      {status === 'error' && error ? (
        <p
          className="border-l-2 border-danger py-1 pl-4 text-base text-textPrimary"
          id="contact-error"
          role="alert"
        >
          {error}{' '}
          <a className="underline underline-offset-2" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <Magnetic>
          <Button className="min-h-16 px-10 text-lg" disabled={status === 'sending'} size="lg" type="submit">
            {status === 'sending' ? 'Sending…' : 'Send message'}
            <span aria-hidden="true">→</span>
          </Button>
        </Magnetic>
        <p className="label text-textMuted">Replies within a day or so.</p>
      </div>
    </form>
  );
}

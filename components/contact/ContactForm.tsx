'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMAIL = 'tousifarsen@gmail.com';

// 16px text stops iOS Safari zooming the page on focus; 48px keeps a comfortable target.
const fieldClass =
  'w-full rounded-control border border-surfaceBorderStrong bg-surface px-4 text-base text-textPrimary transition-colors duration-200 placeholder:text-textMuted';
const labelClass = 'text-small font-medium text-textPrimary';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setError(null);

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
        setError(payload?.error ?? 'Something went wrong.');
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
      <div aria-live="polite" className="rounded-media border border-success p-8" role="status">
        <p className="font-display text-h3 text-textPrimary">Message sent.</p>
        <p className="mt-3 max-w-md text-textSecondary">
          I read everything that comes through here. You should hear back within a day or so.
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-6" noValidate onSubmit={handleSubmit}>
      {/* Honeypot: hidden from real users and from assistive technology. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="company">Company</label>
        <input autoComplete="off" id="company" name="company" tabIndex={-1} type="text" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className={labelClass} htmlFor="name">
            Name
          </label>
          <input
            autoComplete="name"
            className={`${fieldClass} min-h-12`}
            id="name"
            name="name"
            required
            type="text"
          />
        </div>

        <div className="grid gap-2">
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className={`${fieldClass} min-h-12`}
            id="email"
            inputMode="email"
            name="email"
            required
            type="email"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className={labelClass} htmlFor="message">
          What does the work look like today?
        </label>
        <textarea
          className={`${fieldClass} min-h-40 resize-y py-3 leading-relaxed`}
          id="message"
          name="message"
          placeholder="The manual process, roughly how much time it eats, and who does it today."
          required
        />
      </div>

      {status === 'error' && error ? (
        <p className="rounded-control border border-danger px-4 py-3 text-small text-textPrimary" role="alert">
          {error}{' '}
          <a className="underline underline-offset-2" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </p>
      ) : null}

      <div>
        <Button className="w-full sm:w-auto" disabled={status === 'sending'} size="lg" type="submit">
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}

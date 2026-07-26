'use client';

import { useState, type FormEvent } from 'react';
import { colorMix, themeColors } from '@/lib/constants/colors';
import { trackEvent } from '@/lib/analytics';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMAIL = 'tousifarsen@gmail.com';

const fieldStyle = {
  background: 'var(--surface-raised)',
  borderColor: 'var(--surface-border-strong)',
} as const;

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
      <div
        aria-live="polite"
        className="rounded-[18px] border p-8 text-center"
        style={{
          borderColor: colorMix(themeColors.green, 32),
          background: colorMix(themeColors.green, 8),
        }}
      >
        <p className="font-display text-[20px] font-semibold text-textPrimary">
          Message sent.
        </p>
        <p className="mx-auto mt-3 max-w-[380px] font-body text-[14px] leading-[1.7] text-textSecondary">
          I read everything that comes through here. You should hear back within a day or
          so.
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-4 text-left" noValidate onSubmit={handleSubmit}>
      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="company">Company</label>
        <input autoComplete="off" id="company" name="company" tabIndex={-1} type="text" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label
            className="font-body text-[13px] font-medium text-textSecondary"
            htmlFor="name"
          >
            Name
          </label>
          <input
            autoComplete="name"
            className="rounded-[12px] border px-4 py-3 font-body text-[14px] text-textPrimary outline-none transition-colors duration-200"
            id="name"
            name="name"
            required
            style={fieldStyle}
            type="text"
          />
        </div>

        <div className="grid gap-2">
          <label
            className="font-body text-[13px] font-medium text-textSecondary"
            htmlFor="email"
          >
            Email
          </label>
          <input
            autoComplete="email"
            className="rounded-[12px] border px-4 py-3 font-body text-[14px] text-textPrimary outline-none transition-colors duration-200"
            id="email"
            name="email"
            required
            style={fieldStyle}
            type="email"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label
          className="font-body text-[13px] font-medium text-textSecondary"
          htmlFor="message"
        >
          What does the work look like today?
        </label>
        <textarea
          className="min-h-[140px] resize-y rounded-[12px] border px-4 py-3 font-body text-[14px] leading-[1.7] text-textPrimary outline-none transition-colors duration-200"
          id="message"
          name="message"
          placeholder="The manual process, roughly how much time it eats, and who does it today."
          required
          style={fieldStyle}
        />
      </div>

      {status === 'error' && error ? (
        <p
          aria-live="assertive"
          className="rounded-[12px] border px-4 py-3 font-body text-[13.5px] leading-[1.6]"
          style={{
            borderColor: colorMix(themeColors.amber, 34),
            background: colorMix(themeColors.amber, 8),
            color: themeColors.amber,
          }}
        >
          {error}{' '}
          <a className="underline underline-offset-2" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </p>
      ) : null}

      <div className="mt-1 flex flex-wrap items-center gap-4">
        <button
          className="inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 font-body text-[15px] font-semibold transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          disabled={status === 'sending'}
          style={{
            background: themeColors.blue,
            color: '#ffffff',
            boxShadow: `0 10px 30px ${colorMix(themeColors.blue, 30)}`,
          }}
          type="submit"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>

        <p className="font-body text-[13px] text-textMuted">
          Or email{' '}
          <a
            className="text-textSecondary underline underline-offset-2 transition-colors duration-200 hover:text-textPrimary"
            href={`mailto:${EMAIL}`}
          >
            {EMAIL}
          </a>
        </p>
      </div>
    </form>
  );
}

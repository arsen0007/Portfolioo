import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Contact form handler.
 *
 * Requires two environment variables to be live:
 *   RESEND_API_KEY   — from resend.com
 *   CONTACT_TO_EMAIL — where submissions are delivered
 *
 * Without them this returns 503 and the client surfaces the direct email
 * address instead. That is deliberate: a form that accepts a message and
 * quietly drops it is worse than no form, so an unconfigured deployment fails
 * loudly rather than pretending to work.
 */

const MAX_LENGTHS = { name: 100, email: 200, message: 4000 } as const;

type Payload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot — real users never fill this; bots usually do. */
  company?: unknown;
};

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: Request) {
  let body: Payload;

  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  // Honeypot: accept silently so a bot gets no signal it was caught.
  if (clean(body.company, 100)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, MAX_LENGTHS.name);
  const email = clean(body.email, MAX_LENGTHS.email);
  const message = clean(body.message, MAX_LENGTHS.message);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email, and message are all required.' },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'That email address looks wrong.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    return NextResponse.json(
      { error: 'The form is not connected yet. Please email me directly.' },
      { status: 503 },
    );
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>',
        to: [to],
        reply_to: email,
        subject: `Portfolio enquiry — ${name}`,
        html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Could not send that. Please email me directly.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Could not send that. Please email me directly.' },
      { status: 502 },
    );
  }
}

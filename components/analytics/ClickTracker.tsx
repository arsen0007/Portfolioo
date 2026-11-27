'use client';

import { useEffect } from 'react';
import { locationOf, trackEvent } from '@/lib/analytics';

const SOCIAL: Array<[RegExp, string]> = [
  [/linkedin\.com/i, 'linkedin'],
  [/github\.com/i, 'github'],
];

function pageName(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname === '/projects') return 'work';
  if (pathname.startsWith('/projects/')) return 'case_study';
  return pathname.slice(1) || 'home';
}

/**
 * One delegated listener instead of instrumenting every component.
 *
 *  - Any element with `data-track="event_name"` sends that event, with every
 *    `data-track-<key>` attribute as a parameter.
 *  - Otherwise links are classified by where they go: case studies, /contact,
 *    mailto:, LinkedIn/GitHub, certificate verification.
 */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;

      const explicit = target.closest<HTMLElement>('[data-track]');
      if (explicit?.dataset.track) {
        const params: Record<string, string> = {};
        for (const [key, value] of Object.entries(explicit.dataset)) {
          if (key.startsWith('track') && key !== 'track' && key !== 'trackLocation' && value) {
            const name = key.slice(5).replace(/^./, (c) => c.toLowerCase()).replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
            params[name] = value;
          }
        }
        trackEvent(explicit.dataset.track, { ...params, location: locationOf(explicit) });
        return;
      }

      const link = target.closest<HTMLAnchorElement>('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      const location = locationOf(link);

      if (href.startsWith('mailto:')) {
        trackEvent('email_click', { location });
        return;
      }
      for (const [pattern, network] of SOCIAL) {
        if (pattern.test(href)) {
          trackEvent('social_click', { network, location });
          return;
        }
      }
      if (/certificate\.productschool\.com/i.test(href)) {
        trackEvent('certificate_verify', { certificate: link.dataset.certificate ?? href.split('/').pop() ?? '' });
        return;
      }
      const project = href.match(/^\/projects\/([\w-]+)/)?.[1];
      if (project) {
        trackEvent('project_open', { project, from: pageName(window.location.pathname), location });
        return;
      }
      if (href === '/contact') {
        trackEvent('cta_click', { cta: (link.textContent ?? '').trim().slice(0, 40), location });
      }
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}

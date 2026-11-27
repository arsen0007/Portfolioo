/**
 * Analytics events (Google Analytics 4 via gtag).
 *
 * The event vocabulary is small on purpose: each one answers a question
 * about what the portfolio is doing for its owner.
 *
 *  cta_click              { cta, location }            which "let's talk" actually gets used
 *  project_open           { project, from }            which work pulls people in, and from where
 *  case_study_view        { project }                  a case study was opened
 *  case_study_complete    { project }                  …and read to the end
 *  email_copy|email_click { location }                 contact intent outside the form
 *  social_click           { network, location }
 *  certificate_open       { certificate }              do recruiters look at credentials
 *  certificate_verify     { certificate }              …and verify them with the issuer
 *  filter_use             { page, filter }
 *  theme_change           { theme }
 *  intro_complete         { tier, fps, skipped, duration_ms, sorted }
 *                                                     real-device performance from every visit
 *  contact_form_submit    { location }
 *
 * Events fired before gtag has loaded (the intro runs that early) are queued
 * and flushed once it is available, rather than dropped.
 */

type Params = Record<string, string | number | boolean>;

const queue: Array<[string, Params | undefined]> = [];
let flushTimer = 0;

function flush(): boolean {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return false;
  while (queue.length) {
    const [name, params] = queue.shift()!;
    window.gtag('event', name, params);
  }
  return true;
}

export function trackEvent(name: string, params?: Params) {
  if (typeof window === 'undefined') return;
  queue.push([name, params]);
  if (flush()) return;
  if (flushTimer) return;
  let tries = 0;
  flushTimer = window.setInterval(() => {
    tries += 1;
    if (flush() || tries > 30) {
      window.clearInterval(flushTimer);
      flushTimer = 0;
    }
  }, 500);
}

/** Where on the page an element sits, for the `location` parameter. */
export function locationOf(el: Element): string {
  const tagged = el.closest<HTMLElement>('[data-track-location]');
  if (tagged?.dataset.trackLocation) return tagged.dataset.trackLocation;
  if (el.closest('#site-menu')) return 'menu';
  if (el.closest('header')) return 'header';
  if (el.closest('footer')) return 'footer';
  const section = el.closest<HTMLElement>('section[id]');
  const page = window.location.pathname === '/' ? 'home' : window.location.pathname.slice(1).replace(/\//g, ':');
  return section?.id ? `${page}#${section.id}` : page;
}

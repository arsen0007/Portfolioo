/**
 * Intro loader state, shared by the loader, the wordmark, the hero reveal and
 * the scene root. Whether the loader runs is decided before first paint by the
 * inline script in app/layout.tsx, which adds `ta-intro` to <html> on the first
 * visit of a session when motion is allowed (`?intro=1` forces it, `?intro=0`
 * skips it). Everything here only reads that decision.
 */

export const INTRO_KEY = 'ta:intro';

export function loaderWillRun(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('ta-intro');
}

let resolveExit: (() => void) | null = null;
const exited = new Promise<void>((resolve) => {
  resolveExit = resolve;
});

/** Resolves when the loader starts handing the screen over (or at once if there is none). */
export function whenLoaderDone(): Promise<void> {
  return loaderWillRun() ? exited : Promise.resolve();
}

export function signalLoaderExit(): void {
  resolveExit?.();
  resolveExit = null;
}

/** The inline <head> script. Kept here so the rule lives next to its readers. */
export const INTRO_DECISION_SCRIPT = `
  try {
    var q = new URLSearchParams(location.search).get('intro');
    var motion = document.documentElement.classList.contains('motion-ok');
    var seen = false;
    try { seen = !!sessionStorage.getItem('${INTRO_KEY}'); } catch (e) {}
    if (q !== '0' && motion && (q === '1' || !seen)) {
      document.documentElement.classList.add('ta-intro');
    }
  } catch (e) {}
`;

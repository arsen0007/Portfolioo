'use client';

import { useEffect } from 'react';

type ThemeMode = 'dark' | 'light';

function readStoredTheme(): ThemeMode | null {
  try {
    const saved = window.localStorage.getItem('theme');
    return saved === 'dark' || saved === 'light' ? saved : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: ThemeMode): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 12 12"
    >
      <path d="M9.8 7.8A4.6 4.6 0 0 1 4.2 2.2a4.8 4.8 0 1 0 5.6 5.6z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 12 12"
    >
      <circle cx="6" cy="6" r="2.1" />
      <path d="M6 1.3v1.1M6 9.6v1.1M1.3 6h1.1M9.6 6h1.1M2.7 2.7l.8.8M8.5 8.5l.8.8M9.3 2.7l-.8.8M3.5 8.5l-.8.8" />
    </svg>
  );
}

/**
 * The theme is set before first paint by the inline script in app/layout.tsx:
 * a stored choice wins, otherwise the device setting. This button only flips
 * it, and the icon is chosen by CSS from the `dark` class, so there is no
 * wrong-icon flash and no hydration mismatch.
 */
export function ThemeToggle() {
  // Follow the device setting live, but only until the visitor picks a theme.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      if (readStoredTheme() === null) {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  function toggleTheme(): void {
    const next: ThemeMode = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
    try {
      window.localStorage.setItem('theme', next);
    } catch {
      // Storage unavailable (private mode): the choice simply lasts this visit.
    }
  }

  return (
    <button
      aria-label="Switch between light and dark theme"
      className="grid h-11 w-11 place-items-center rounded-control border border-surfaceBorder text-textSecondary transition-colors duration-200 hover:border-surfaceBorderStrong hover:text-textPrimary"
      onClick={toggleTheme}
      type="button"
    >
      <span className="dark:hidden">
        <MoonIcon />
      </span>
      <span className="hidden dark:block">
        <SunIcon />
      </span>
    </button>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type ThemeMode = 'dark' | 'light';

function getPreferredTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  // Matches the inline script in layout.tsx: dark by default unless
  // the user has explicitly chosen light.
  return window.localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
}

function applyTheme(theme: ThemeMode): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
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
      className="h-4 w-4"
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

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
    applyTheme(preferredTheme);
  }, []);

  function toggleTheme(): void {
    setTheme((current) => {
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem('theme', nextTheme);
      applyTheme(nextTheme);

      return nextTheme;
    });
  }

  const isDark = theme === 'dark';

  return (
    <button
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      className="theme-toggle relative grid h-9 w-9 place-items-center rounded-full border outline-none transition-all duration-200 ease-in-out hover:text-textPrimary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      onClick={toggleTheme}
      suppressHydrationWarning
      type="button"
    >
      <span
        className={cn('grid h-full w-full place-items-center rounded-full text-textPrimary')}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}

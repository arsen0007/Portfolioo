'use client';

import { useEffect, useState } from 'react';

function bengaluruTime(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
}

/** Live local time in Bengaluru. Renders nothing on the server (no mismatch). */
export function LocalTime({ className, prefix = 'BLR' }: { className?: string; prefix?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(bengaluruTime());
    const id = window.setInterval(() => setTime(bengaluruTime()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className}>
      <span className="sr-only">Local time in Bengaluru: </span>
      {prefix} <span className="ml-1.5 tabular-nums text-textSecondary">{time ?? '--:--'}</span>
      <span aria-hidden="true" className="ml-1.5">IST</span>
    </span>
  );
}

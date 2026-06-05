import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'active' | 'live' | 'completed' | 'upcoming';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

const badgeClasses: Record<BadgeVariant, string> = {
  active: 'border-greenDim bg-greenGlow text-green',
  live: 'border-blueDim bg-blueGlow text-blue',
  completed: 'border-amberDim bg-amberGlow text-amber',
  upcoming: 'border-purpleDim bg-purpleGlow text-purple',
};

const dotClasses: Record<BadgeVariant, string> = {
  active: 'bg-green animate-status-pulse',
  live: 'bg-blue',
  completed: 'bg-amber',
  upcoming: 'bg-purple opacity-60',
};

export function Badge({
  children,
  className,
  variant = 'live',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] leading-none',
        badgeClasses[variant],
        className,
      )}
      {...props}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[variant])} />
      {children}
    </span>
  );
}

import type { HTMLAttributes, ReactNode } from 'react';
import type { AccentColor } from '@/lib/constants/colors';
import { cn } from '@/lib/utils';

export type TagProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  color?: AccentColor;
};

const colorClasses: Record<AccentColor, string> = {
  blue: 'border-blue text-blue',
  green: 'border-green text-green',
  cyan: 'border-cyan text-cyan',
  amber: 'border-amber text-amber',
  purple: 'border-purple text-purple',
};

export function Tag({
  children,
  className,
  color = 'blue',
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-tag border-[0.5px] bg-surfaceRaised px-2.5 py-1 font-mono text-[11px] font-normal leading-none',
        colorClasses[color],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

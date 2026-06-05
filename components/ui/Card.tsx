import type { HTMLAttributes, ReactNode } from 'react';
import type { AccentColor } from '@/lib/constants/colors';
import { cn } from '@/lib/utils';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  color?: AccentColor;
};

const colorClasses: Record<AccentColor, string> = {
  blue: 'hover:border-blue hover:bg-blueGlow',
  green: 'hover:border-green hover:bg-greenGlow',
  cyan: 'hover:border-cyan hover:bg-cyanGlow',
  amber: 'hover:border-amber hover:bg-amberGlow',
  purple: 'hover:border-purple hover:bg-purpleGlow',
};

export function Card({
  children,
  className,
  color = 'blue',
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'panel-shadow rounded-panel border-[0.5px] border-surfaceBorder bg-surface p-6 transition-all duration-300 ease-in-out',
        colorClasses[color],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

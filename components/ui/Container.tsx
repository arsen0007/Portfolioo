import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ContainerProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Narrow reading column for long copy. */
  narrow?: boolean;
};

/** Page width and the fluid gutter (var(--gutter)) in one place. */
export function Container({ as: Tag = 'div', children, className, narrow = false }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-[var(--gutter)]', narrow ? 'max-w-4xl' : 'max-w-page', className)}>
      {children}
    </Tag>
  );
}

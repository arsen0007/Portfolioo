import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ContainerProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Narrow reading column for long copy. */
  narrow?: boolean;
};

/**
 * Page width and gutters in one place: 20px gutters on phones, 32px from 640px.
 */
export function Container({ as: Tag = 'div', children, className, narrow = false }: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full px-5 sm:px-8',
        narrow ? 'max-w-3xl' : 'max-w-6xl',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

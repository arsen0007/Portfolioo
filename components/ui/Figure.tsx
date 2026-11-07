import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FigureProps = {
  src: string;
  alt: string;
  /** Intrinsic size of the source, so the browser reserves space (no layout shift). */
  width: number;
  height: number;
  caption?: ReactNode;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Crop the image to its box instead of showing it whole. */
  cover?: boolean;
};

/** An image in a hairline frame with an optional caption. */
export function Figure({
  alt,
  caption,
  className,
  cover = false,
  height,
  priority,
  sizes = '(min-width: 1152px) 1088px, 100vw',
  src,
  width,
}: FigureProps) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-media border border-surfaceBorder bg-surface">
        <Image
          alt={alt}
          className={cn('h-auto w-full', cover && 'h-full object-cover')}
          height={height}
          priority={priority}
          sizes={sizes}
          src={src}
          width={width}
        />
      </div>
      {caption ? <figcaption className="mt-3 text-small text-textMuted">{caption}</figcaption> : null}
    </figure>
  );
}

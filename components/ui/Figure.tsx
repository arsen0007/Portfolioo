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
      <div className="group overflow-hidden rounded-media border border-surfaceBorder bg-surface">
        <Image
          alt={alt}
          className={cn(
            'h-auto w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.015]',
            cover && 'h-full object-cover',
          )}
          height={height}
          priority={priority}
          sizes={sizes}
          src={src}
          width={width}
        />
      </div>
      {caption ? <figcaption className="mt-4 flex gap-3 text-small text-textMuted">
          <span aria-hidden="true" className="label pt-0.5 text-accent">Fig.</span>
          <span>{caption}</span>
        </figcaption> : null}
    </figure>
  );
}

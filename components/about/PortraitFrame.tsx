'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap, motionAllowed, useGSAP } from '@/lib/motion/gsap';

/**
 * The real photo in a hairline frame. As it scrolls in, a clip-path inset
 * opens from the bottom while the image settles from a slight scale: the same
 * face, assembled. Without motion the photo is simply there.
 */
export function PortraitFrame({ className }: { className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!motionAllowed() || !frame.current || !img.current) return;
      gsap.fromTo(
        img.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: { trigger: frame.current, start: 'top 85%', once: true },
        },
      );
      gsap.fromTo(
        img.current.firstElementChild,
        { scale: 1.25 },
        {
          scale: 1,
          duration: 2,
          ease: 'expo.out',
          scrollTrigger: { trigger: frame.current, start: 'top 85%', once: true },
        },
      );
    },
    { scope: frame },
  );

  return (
    <figure className={className}>
      <div className="border border-surfaceBorderStrong p-2" ref={frame}>
        <div className="aspect-[3/4] overflow-hidden bg-surface" ref={img}>
          <Image
            alt="Portrait of Tousif Ali"
            className="h-full w-full object-cover"
            height={1280}
            priority
            sizes="(min-width: 1024px) 28vw, 80vw"
            src="/profile.webp"
            width={960}
          />
        </div>
      </div>
      <figcaption className="label mt-4 flex gap-3 text-textMuted">
        <span className="text-accent">Fig. 01</span>
        <span>Tousif Ali, Bengaluru. The same face, drawn as points.</span>
      </figcaption>
    </figure>
  );
}

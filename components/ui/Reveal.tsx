'use client';

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

/**
 * Drop-in replacement for the small slice of Framer Motion this site actually
 * used: fade-and-rise-on-scroll. Nothing here animates layout, springs, or
 * gestures — it was always one effect.
 *
 * Framer Motion costs ~34 kB gzipped and forces every page importing it to be a
 * Client Component. This is ~1 kB, and because the pages themselves no longer
 * need `'use client'`, their markup is server-rendered — which also means the
 * text is in the HTML rather than arriving after hydration.
 *
 * The API deliberately matches `motion.*` so the migration was an import swap.
 * Framer's animation props are accepted and ignored; only `transition.delay`
 * is read, since that is the only one that was doing visible work.
 *
 * Still using real Framer Motion: the certifications carousel and the BarHunter
 * pipeline, which animate on state rather than on scroll, and the header
 * drawer. Those earn the weight.
 */

type Framerish = {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  whileInView?: unknown;
  whileHover?: unknown;
  whileTap?: unknown;
  viewport?: unknown;
  transition?: { delay?: number } & Record<string, unknown>;
  custom?: unknown;
  variants?: unknown;
  layoutId?: unknown;
};

type RevealProps = Framerish & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
};

/** Framer props accepted for API compatibility and dropped before render. */
const FRAMER_PROPS = [
  'initial',
  'animate',
  'exit',
  'whileInView',
  'whileHover',
  'whileTap',
  'viewport',
  'transition',
  'custom',
  'variants',
  'layoutId',
] as const;

function createReveal(tag: 'div' | 'article' | 'section') {
  return function Reveal(props: RevealProps) {
    const { children, className, style, transition } = props;
    const rest = { ...props };

    delete rest.children;
    delete rest.className;
    delete rest.style;
    for (const key of FRAMER_PROPS) {
      delete rest[key];
    }

    const ref = useRef<HTMLElement>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
      const element = ref.current;

      if (!element) {
        return undefined;
      }

      if (typeof IntersectionObserver === 'undefined') {
        setShown(true);
        return undefined;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
      );

      observer.observe(element);

      return () => observer.disconnect();
    }, []);

    const delay = typeof transition?.delay === 'number' ? transition.delay : 0;

    return createElement(
      tag,
      {
        ...rest,
        className: cn('fade-in', shown && 'fade-in--shown', className),
        ref,
        style: delay ? { ...style, transitionDelay: `${delay}s` } : style,
      },
      children,
    );
  };
}

/**
 * Exported individually rather than as a `motion`-style object: React Server
 * Components resolve client components through a manifest keyed on the export
 * name, and a component nested inside an object literal has no resolvable key.
 * `motion.div` across the server/client boundary fails to build.
 */
export const RevealArticle = createReveal('article');
export const RevealDiv = createReveal('div');
export const RevealSection = createReveal('section');

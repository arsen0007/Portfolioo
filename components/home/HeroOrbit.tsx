'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { OrbitNodeIcon, type OrbitIconName } from '@/components/orbit/OrbitNode';
import type { AccentColor } from '@/lib/constants/colors';
import { colorMix, themeColors } from '@/lib/constants/colors';

type HeroOrbitItem = {
  accent: AccentColor;
  angle: number;
  href: string;
  icon: OrbitIconName;
  label: string;
  sublabel: string;
};

/**
 * The five destinations, at the same angles the original full-screen orbit
 * used so the shape stays recognisable.
 */
function buildItems(projectCount: number): HeroOrbitItem[] {
  return [
  { accent: 'cyan', angle: 270, href: '/about', icon: 'about', label: 'About', sublabel: 'The path' },
  { accent: 'amber', angle: 342, href: '/certifications', icon: 'cert', label: 'Certifications', sublabel: '7 earned' },
  { accent: 'green', angle: 54, href: '/projects', icon: 'projects', label: 'Projects', sublabel: `${projectCount} case studies` },
  { accent: 'purple', angle: 126, href: '/recognition', icon: 'recognition', label: 'Recognition', sublabel: 'The receipts' },
  { accent: 'blue', angle: 198, href: '/contact', icon: 'contact', label: 'Contact', sublabel: "Let's talk" },
  ];
}

function useSquareSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    let frame = 0;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setSize(width));
    });

    setSize(element.getBoundingClientRect().width);
    observer.observe(element);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return [ref, size] as const;
}

export function HeroOrbit({ projectCount }: { projectCount: number }) {
  const [ref, size] = useSquareSize<HTMLDivElement>();
  const items = buildItems(projectCount);

  const center = size / 2;
  // Leave room for the node circle and its two-line label at every size.
  const radius = size * 0.34;
  const nodeSize = Math.max(46, Math.min(66, size * 0.15));
  const ready = size > 0;

  return (
    <div
      className="hero-orbit relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[460px]"
      ref={ref}
    >
      {ready ? (
        <>
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${size} ${size}`}
          >
            <defs>
              <radialGradient cx="50%" cy="50%" id="hero-orbit-haze" r="50%">
                <stop offset="0%" stopColor={colorMix(themeColors.blue, 26)} />
                <stop offset="46%" stopColor={colorMix(themeColors.blue, 10)} />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            <circle cx={center} cy={center} fill="url(#hero-orbit-haze)" r={radius * 0.98} />

            {/* Spokes: centre out to each destination. */}
            {items.map((item) => {
              const radians = (item.angle * Math.PI) / 180;

              return (
                <line
                  key={`spoke-${item.href}`}
                  opacity={0.4}
                  stroke={`var(--${item.accent})`}
                  strokeDasharray="3 5"
                  strokeWidth="0.8"
                  x1={center}
                  x2={center + Math.cos(radians) * radius}
                  y1={center}
                  y2={center + Math.sin(radians) * radius}
                />
              );
            })}

            <circle
              cx={center}
              cy={center}
              fill="none"
              opacity={0.26}
              r={radius}
              stroke={themeColors.blue}
              strokeDasharray="4 3"
              strokeWidth="0.8"
            />
            <circle
              className="orbit-ring-rotate"
              cx={center}
              cy={center}
              fill="none"
              opacity={0.2}
              r={radius * 0.62}
              stroke={themeColors.blue}
              strokeDasharray="1 12"
              strokeLinecap="round"
              strokeWidth="0.8"
              style={{ transformOrigin: `${center}px ${center}px` }}
            />
          </svg>

          {/* The HUD from the original orbit — sized so its tick ring lands on
              the destination ring. Purely decorative. */}
          <div
            aria-hidden="true"
            className="orbit-core-hud absolute"
            style={{
              height: size * 0.66,
              left: center,
              top: center,
              transform: 'translate(-50%, -50%)',
              width: size * 0.66,
            }}
          >
            <span className="orbit-core-hud__halo" />
            <span className="orbit-core-hud__outer" />
            <span className="orbit-core-hud__ticks" />
            <span className="orbit-core-hud__scan" />
            <span className="orbit-core-hud__pulse" />
          </div>

          {/* Centre: the identity mark, not a control. */}
          <div
            aria-hidden="true"
            className="hero-orbit__core absolute grid place-items-center rounded-full border text-center"
            style={{
              background: 'var(--surface)',
              borderColor: colorMix(themeColors.blue, 44),
              boxShadow: 'var(--center-blue-shadow)',
              height: size * 0.34,
              left: center,
              top: center,
              transform: 'translate(-50%, -50%)',
              width: size * 0.34,
            }}
          >
            <span
              className="font-display text-[15px] font-semibold tracking-[0.14em]"
              style={{ color: themeColors.blue }}
            >
              TA
            </span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-textMuted">
              Systems map
            </span>
          </div>

          {items.map((item) => {
            const radians = (item.angle * Math.PI) / 180;
            const x = center + Math.cos(radians) * radius;
            const y = center + Math.sin(radians) * radius;
            const accent = themeColors[item.accent];
            // The top node reads better with its label outside the ring.
            const labelAbove = item.angle === 270;

            return (
              <Link
                className={`hero-orbit__node group absolute flex w-[96px] items-center gap-1.5 text-center ${
                  labelAbove ? 'flex-col-reverse' : 'flex-col'
                }`}
                href={item.href}
                key={item.href}
                style={
                  {
                    '--hero-node-accent': accent,
                    left: x,
                    top: y,
                    transform: 'translate(-50%, -50%)',
                  } as CSSProperties
                }
              >
                <span
                  className="grid shrink-0 place-items-center rounded-full border transition-transform duration-200 group-hover:scale-105"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${colorMix(accent, 18)}, transparent 66%), var(--node-surface)`,
                    borderColor: colorMix(accent, 56),
                    boxShadow: `0 0 20px ${colorMix(accent, 22)}`,
                    height: nodeSize,
                    width: nodeSize,
                  }}
                >
                  <OrbitNodeIcon className="h-5 w-5" color={accent} icon={item.icon} />
                </span>

                <span className="grid gap-0.5">
                  <span className="font-display text-[13px] font-semibold leading-tight text-textPrimary transition-colors duration-200 group-hover:text-[var(--hero-node-accent)]">
                    {item.label}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-textMuted">
                    {item.sublabel}
                  </span>
                </span>
              </Link>
            );
          })}
        </>
      ) : null}
    </div>
  );
}

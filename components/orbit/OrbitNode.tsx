'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AccentColor } from '@/lib/constants/colors';
import { colorMix, themeColors } from '@/lib/constants/colors';
import { cn } from '@/lib/utils';

export type OrbitIconName =
  | 'about'
  | 'projects'
  | 'recognition'
  | 'contact'
  | 'pipeline'
  | 'casewise'
  | 'mail'
  | 'site'
  | 'agent';

export type OrbitNodeProps = {
  accent: AccentColor;
  icon: OrbitIconName;
  label: string;
  sublabel: string;
  tooltip: string;
  entryX: number;
  entryY: number;
  exitX: number;
  exitY: number;
  x: number;
  y: number;
  entranceDelay: number;
  hover: boolean;
  layoutId?: string;
  onClick: () => void;
  onHoverChange: (hovered: boolean) => void;
  reducedMotion?: boolean;
};

const iconViews: Record<OrbitIconName, ReactNode> = {
  about: (
    <>
      <circle cx="10" cy="7" r="3" />
      <path d="M4 18c.8-3.7 3-5.5 6-5.5s5.2 1.8 6 5.5" />
    </>
  ),
  projects: (
    <>
      <rect x="4" y="4" width="4.5" height="4.5" rx="0.8" />
      <rect x="11.5" y="4" width="4.5" height="4.5" rx="0.8" />
      <rect x="4" y="11.5" width="4.5" height="4.5" rx="0.8" />
      <rect x="11.5" y="11.5" width="4.5" height="4.5" rx="0.8" />
    </>
  ),
  recognition: (
    <>
      <path d="M10 3.5l1.9 3.8 4.1.6-3 2.9.7 4.1-3.7-2-3.7 2 .7-4.1-3-2.9 4.1-.6L10 3.5z" />
      <path d="M7 16.5v2l3-1.3 3 1.3v-2" />
    </>
  ),
  contact: (
    <>
      <path d="M3.5 6.5h13v9h-13z" />
      <path d="M4.5 7.5l5.5 4 5.5-4" />
    </>
  ),
  pipeline: (
    <>
      <path d="M4 5h4v4H4z" />
      <path d="M12 11h4v4h-4z" />
      <path d="M8 7h3.2c1.5 0 2.8 1.3 2.8 2.8V11" />
    </>
  ),
  casewise: (
    <>
      <path d="M5 4.5h10v13H5z" />
      <path d="M7.5 8h5" />
      <path d="M7.5 11h5" />
      <path d="M7.5 14h3" />
    </>
  ),
  mail: (
    <>
      <path d="M3.5 6h13v9.5h-13z" />
      <path d="M4.5 7l5.5 4.2L15.5 7" />
      <path d="M6 4.5h8" />
    </>
  ),
  site: (
    <>
      <rect x="3.5" y="5" width="13" height="10.5" rx="1.5" />
      <path d="M3.5 8h13" />
      <path d="M7 12h6" />
    </>
  ),
  agent: (
    <>
      <rect x="5.5" y="5.5" width="9" height="9" rx="1.5" />
      <path d="M5.5 8.5H3.5M5.5 11.5H3.5M14.5 8.5H16.5M14.5 11.5H16.5M8.5 5.5V3.5M11.5 5.5V3.5M8.5 14.5V16.5M11.5 14.5V16.5" />
      <circle cx="10" cy="10" r="2" />
    </>
  ),
};

export function OrbitNodeIcon({
  color,
  icon,
  className,
}: {
  color: string;
  icon: OrbitIconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn('h-7 w-7 shrink-0', className)}
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.4"
      viewBox="0 0 20 20"
    >
      {iconViews[icon]}
    </svg>
  );
}

export function OrbitNode({
  accent,
  icon,
  label,
  sublabel,
  tooltip,
  entryX,
  entryY,
  exitX,
  exitY,
  x,
  y,
  entranceDelay,
  hover,
  layoutId,
  onClick,
  onHoverChange,
  reducedMotion = false,
}: OrbitNodeProps) {
  const accentColor = themeColors[accent];
  const positionTransition = reducedMotion
    ? { duration: 0 }
    : {
        x: { damping: 30, mass: 0.65, stiffness: 130, type: 'spring' as const },
        y: { damping: 30, mass: 0.65, stiffness: 130, type: 'spring' as const },
        opacity: { delay: entranceDelay, duration: 0.26, ease: 'easeOut' as const },
      };

  return (
    <motion.div
      animate={{
        opacity: 1,
        x,
        y,
      }}
      className="absolute left-0 top-0 z-20"
      exit={{
        opacity: 0,
        transition: { duration: 0.25, ease: 'easeOut' },
        x: exitX,
        y: exitY,
      }}
      initial={{
        opacity: 0,
        x: entryX,
        y: entryY,
      }}
      layoutId={layoutId}
      transition={positionTransition}
    >
      <div className="flex w-[112px] flex-col items-center gap-3">
        <motion.button
          animate={{
            scale: hover ? 1.025 : 1,
          }}
          aria-label={`${label}: ${sublabel}`}
          className={cn(
            'orbit-icon-node panel-shadow theme-node-border relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border bg-nodeSurface p-0 text-left outline-none transition-all duration-200 ease-in-out',
          )}
          data-testid={`orbit-node-${label.toLowerCase().replaceAll(' ', '-')}`}
          onBlur={() => onHoverChange(false)}
          onClick={onClick}
          onFocus={() => onHoverChange(true)}
          onMouseEnter={() => onHoverChange(true)}
          onMouseLeave={() => onHoverChange(false)}
          style={{
            background: `radial-gradient(circle at 50% 0%, ${colorMix(accentColor, 12)}, transparent 62%), var(--node-surface)`,
            borderColor: hover ? accentColor : colorMix(accentColor, 46),
            boxShadow: hover
              ? `0 0 26px ${colorMix(accentColor, 44)}, inset 0 0 26px ${colorMix(accentColor, 13)}`
              : `0 0 0 1px ${colorMix(accentColor, 28)}, 0 0 24px ${colorMix(accentColor, 12)}, var(--orbit-node-base-shadow)`,
          }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { damping: 28, mass: 0.45, stiffness: 220, type: 'spring' }
          }
          type="button"
          whileTap={{ scale: 0.96 }}
        >
          <OrbitNodeIcon color={accentColor} icon={icon} />

          <AnimatePresence>
            {hover ? (
              <motion.span
                animate={{ opacity: 1, y: 0 }}
                className="pointer-events-none absolute left-1/2 top-[-42px] z-30 w-max -translate-x-1/2 rounded-lg border-[0.5px] border-surfaceBorder bg-surfaceRaised px-3 py-1.5 font-body text-[11px] font-normal leading-none text-textSecondary"
                exit={{ opacity: 0, y: 4 }}
                initial={{ opacity: 0, y: 4 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.14,
                  ease: 'easeOut',
                }}
              >
                {tooltip}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.button>
        <span className="max-w-[120px] text-center font-body text-[16px] font-medium leading-tight text-textPrimary">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

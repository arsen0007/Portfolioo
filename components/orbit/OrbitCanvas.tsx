'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { type RefObject, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { OrbitConnection } from '@/components/orbit/OrbitConnection';
import { OrbitNode, OrbitNodeIcon, type OrbitIconName } from '@/components/orbit/OrbitNode';
import type { AccentColor } from '@/lib/constants/colors';
import { colorMix, themeColors } from '@/lib/constants/colors';
import { cn } from '@/lib/utils';

type OrbitMode = 'home' | 'projects';
type HomeNodeId = 'about' | 'projects' | 'recognition' | 'contact' | 'certifications';
type ProjectNodeId = 'barhunter' | 'casewise' | 'mailmerge' | 'fhoneman' | 'genie';
type OrbitNodeId = HomeNodeId | ProjectNodeId;

type OrbitRouteAction = {
  href: string;
  type: 'route';
};

type OrbitProjectsAction = {
  type: 'projects';
};

type OrbitItem = {
  action: OrbitRouteAction | OrbitProjectsAction;
  angle: number;
  color: AccentColor;
  icon: OrbitIconName;
  id: OrbitNodeId;
  label: string;
  sublabel: string;
  tooltip: string;
};

type PositionedOrbitItem = OrbitItem & {
  x: number;
  y: number;
};

type StageSize = {
  height: number;
  width: number;
};

type OrbitCenter = {
  x: number;
  y: number;
};

type OrbitState = {
  expanded: boolean;
  hoveredId: OrbitNodeId | null;
  mode: OrbitMode;
};

type OrbitAction =
  | { type: 'toggle-home' }
  | { type: 'show-projects' }
  | { type: 'show-home' }
  | { id: OrbitNodeId | null; type: 'hover' };

export type OrbitCanvasProps = {
  className?: string;
};

const BASE_ORBIT_RADIUS = 300;
const ORBIT_NODE_HEIGHT = 112;
const ORBIT_NODE_WIDTH = 112;

const archLabels: Partial<Record<OrbitNodeId, string>> = {
  about: 'context',
  projects: 'output',
  recognition: 'eval.',
  contact: 'deploy',
  certifications: 'certs',
  barhunter: 'leads',
  casewise: 'intake',
  mailmerge: 'batch',
  fhoneman: 'render',
  genie: 'runtime',
};

const homeItems: OrbitItem[] = [
  {
    action: { href: '/about', type: 'route' },
    angle: 270,
    color: 'cyan',
    icon: 'about',
    id: 'about',
    label: 'About',
    sublabel: 'Journey',
    tooltip: 'My story and journey',
  },
  {
    action: { href: '/certifications', type: 'route' },
    angle: 342,
    color: 'amber',
    icon: 'cert',
    id: 'certifications',
    label: 'Certifications',
    sublabel: 'Credentials',
    tooltip: 'Verified credentials',
  },
  {
    action: { type: 'projects' },
    angle: 54,
    color: 'green',
    icon: 'projects',
    id: 'projects',
    label: 'Projects',
    sublabel: 'Systems',
    tooltip: 'Systems I have built',
  },
  {
    action: { href: '/recognition', type: 'route' },
    angle: 126,
    color: 'purple',
    icon: 'recognition',
    id: 'recognition',
    label: 'Recognition',
    sublabel: 'Proof',
    tooltip: 'Proof and validation',
  },
  {
    action: { href: '/contact', type: 'route' },
    angle: 198,
    color: 'blue',
    icon: 'contact',
    id: 'contact',
    label: 'Contact',
    sublabel: 'Connect',
    tooltip: "Let's build something",
  },
];

const projectItems: OrbitItem[] = [
  {
    action: { href: '/projects/barhunter', type: 'route' },
    angle: 270,
    color: 'green',
    icon: 'pipeline',
    id: 'barhunter',
    label: 'BarHunter',
    sublabel: 'Lead engine',
    tooltip: '100K+ leads - Live',
  },
  {
    action: { href: '/projects/casewise', type: 'route' },
    angle: 342,
    color: 'blue',
    icon: 'casewise',
    id: 'casewise',
    label: 'CaseWise',
    sublabel: 'Legal intake',
    tooltip: '96% time reduction - Confidential',
  },
  {
    action: { href: '/projects/fhoneman', type: 'route' },
    angle: 54,
    color: 'amber',
    icon: 'site',
    id: 'fhoneman',
    label: 'Fhoneman',
    sublabel: 'Client site',
    tooltip: 'Live client website',
  },
  {
    action: { href: '/projects/mailmerge', type: 'route' },
    angle: 126,
    color: 'cyan',
    icon: 'mail',
    id: 'mailmerge',
    label: 'Mail Merge Tool',
    sublabel: 'Outreach prep',
    tooltip: 'Bulk data automation',
  },
  {
    action: { href: '/projects/genie', type: 'route' },
    angle: 198,
    color: 'purple',
    icon: 'agent',
    id: 'genie',
    label: 'Genie',
    sublabel: 'Agent runtime',
    tooltip: 'Custom AI agent on Raspberry Pi',
  },
];

function orbitReducer(state: OrbitState, action: OrbitAction): OrbitState {
  switch (action.type) {
    case 'toggle-home':
      return state.mode === 'home'
        ? { ...state, expanded: !state.expanded, hoveredId: null }
        : state;
    case 'show-projects':
      return { expanded: true, hoveredId: null, mode: 'projects' };
    case 'show-home':
      return { expanded: true, hoveredId: null, mode: 'home' };
    case 'hover':
      return { ...state, hoveredId: action.id };
    default:
      return state;
  }
}

function createInitialOrbitState(startsInProjects: boolean): OrbitState {
  return startsInProjects
    ? { expanded: true, hoveredId: null, mode: 'projects' }
    : { expanded: false, hoveredId: null, mode: 'home' };
}

function getOrbitPosition(angle: number, radius: number): { x: number; y: number } {
  const radians = (angle * Math.PI) / 180;

  return {
    x: Math.cos(radians) * radius,
    y: Math.sin(radians) * radius,
  };
}

function getPositionedItems(items: OrbitItem[], radius: number): PositionedOrbitItem[] {
  return items.map((item) => ({
    ...item,
    ...getOrbitPosition(item.angle, radius),
  }));
}

function getOrbitCenter({ height, width }: StageSize): OrbitCenter {
  return {
    x: width / 2,
    y: height / 2,
  };
}

function getOrbitRadius({ height, width }: StageSize): number {
  const verticalLimit = (height - ORBIT_NODE_HEIGHT - 32) / 2;
  const horizontalLimit = (width - ORBIT_NODE_WIDTH - 80) / 2;

  return Math.max(190, Math.min(BASE_ORBIT_RADIUS, verticalLimit, horizontalLimit));
}

function useElementSize<T extends HTMLElement>(): readonly [
  RefObject<T>,
  StageSize,
] {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<StageSize>({ height: 0, width: 0 });

  useEffect(() => {
    const element = ref.current;
    let frameId = 0;

    if (!element) {
      return undefined;
    }

    const observedElement = element;

    function updateSize(rect: DOMRectReadOnly): void {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        setSize({
          height: rect.height,
          width: rect.width,
        });
      });
    }

    updateSize(observedElement.getBoundingClientRect());

    const observer = new ResizeObserver((entries) => {
      const [entry] = entries;

      if (entry) {
        updateSize(entry.contentRect);
      }
    });

    observer.observe(observedElement);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  return [ref, size] as const;
}

function useViewportReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setReady(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return ready;
}

function cssAccentMix(accent: AccentColor, percentage: number): string {
  return `color-mix(in srgb, var(--${accent}) ${percentage}%, transparent)`;
}

function pointOnCircle(center: OrbitCenter, radius: number, angle: number): OrbitCenter {
  const radians = (angle * Math.PI) / 180;

  return {
    x: center.x + Math.cos(radians) * radius,
    y: center.y + Math.sin(radians) * radius,
  };
}

function OrbitFlowParticles({
  center,
  positionedItems,
}: {
  center: OrbitCenter;
  positionedItems: PositionedOrbitItem[];
}) {
  const startDelay = 0.96;

  return (
    <motion.g
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ delay: 1, duration: 0.45 }}
    >
      {positionedItems.flatMap((item) => {
        const pathD = `M 0 0 L ${item.x} ${item.y}`;
        return [0, 0.9, 1.8].map((offset, i) => (
          <g
            key={`fp-${item.id}-${i}`}
            transform={`translate(${center.x} ${center.y})`}
          >
            <circle fill={`var(--${item.color})`} opacity={0} r={1.6}>
              <animate
                attributeName="opacity"
                begin={`${startDelay + offset}s`}
                dur="2.6s"
                keyTimes="0;0.08;0.74;1"
                repeatCount="indefinite"
                values="0;0.82;0.72;0"
              />
              <animateMotion
                begin={`${startDelay + offset}s`}
                dur="2.6s"
                path={pathD}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ));
      })}
    </motion.g>
  );
}

function OrbitAtmosphere({
  center,
  expanded,
  mode,
  positionedItems,
  radius,
  reducedMotion,
  stageSize,
}: {
  center: OrbitCenter;
  expanded: boolean;
  mode: OrbitMode;
  positionedItems: PositionedOrbitItem[];
  radius: number;
  reducedMotion: boolean;
  stageSize: StageSize;
}) {
  const accent: AccentColor = mode === 'projects' ? 'green' : 'blue';
  const ringScales = expanded
    ? [0.42, 0.54, 0.66, 0.78, 0.9, 1]
    : [0.48, 0.64, 0.8];
  const radialAngles = [0, 90, 180, 270];
  const anchorAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  const innerAnchorAngles = [0, 90, 180, 270];

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg
        aria-hidden="true"
        className="orbit-atmosphere absolute inset-0 h-full w-full"
        viewBox={`0 0 ${stageSize.width} ${stageSize.height}`}
      >
        <defs>
          <radialGradient id="orbit-center-haze" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={cssAccentMix(accent, 34)} />
            <stop offset="42%" stopColor={cssAccentMix(accent, 14)} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <circle cx={center.x} cy={center.y} fill="url(#orbit-center-haze)" r={radius * 0.86} />

        <motion.g
          animate={{ opacity: expanded ? 1 : 0.56 }}
          transition={{ duration: reducedMotion ? 0 : 0.35, ease: 'easeOut' }}
        >
          {ringScales.map((scale, index) => (
            <circle
              cx={center.x}
              cy={center.y}
              fill="none"
              key={`ambient-ring-${scale}`}
              opacity={expanded ? 0.2 - index * 0.018 : 0.06 - index * 0.012}
              r={radius * scale}
              stroke={cssAccentMix(accent, expanded ? 62 : 34)}
              strokeDasharray={index % 2 === 0 ? '1 10' : '2 16'}
              strokeLinecap="round"
              strokeWidth={index === 5 ? '0.8' : '0.5'}
            />
          ))}
        </motion.g>

        {/* outer breath ring — always visible, breathes on expand */}
        <circle
          className="orbit-ring-rotate"
          cx={center.x}
          cy={center.y}
          fill="none"
          opacity={expanded ? 0.26 : 0.1}
          r={radius * 1.18}
          stroke={cssAccentMix(accent, 30)}
          strokeDasharray="1 22"
          strokeLinecap="round"
          strokeWidth="0.7"
          style={{ transformOrigin: `${center.x}px ${center.y}px`, transition: 'opacity 0.6s' }}
        />

        {expanded ? (
          <>
            <g opacity="0.5">
              {radialAngles.map((angle) => {
                const end = pointOnCircle(center, radius * 1.02, angle);

                return (
                  <line
                    key={`radial-${angle}`}
                    stroke={cssAccentMix(accent, 52)}
                    strokeDasharray="2 5"
                    strokeWidth="0.6"
                    x1={center.x}
                    x2={end.x}
                    y1={center.y}
                    y2={end.y}
                  />
                );
              })}
            </g>
            <g className="orbit-anchor-points">
              {anchorAngles.map((angle) => {
                const point = pointOnCircle(center, radius, angle);

                return (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    fill={`var(--${accent})`}
                    key={`anchor-${angle}`}
                    r={angle % 90 === 0 ? 3.2 : 2.4}
                  />
                );
              })}
              {innerAnchorAngles.map((angle) => {
                const point = pointOnCircle(center, radius * 0.54, angle);

                return (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    fill={`var(--${accent})`}
                    key={`inner-anchor-${angle}`}
                    r="2.6"
                  />
                );
              })}
            </g>

            {/* architecture labels on spoke midpoints */}
            {positionedItems.map((item) => {
              const len = Math.sqrt(item.x ** 2 + item.y ** 2);
              const nx = -item.y / len;
              const ny = item.x / len;
              const lx = center.x + item.x * 0.5 + nx * 13;
              const ly = center.y + item.y * 0.5 + ny * 13;
              const label = archLabels[item.id] ?? item.id;

              return (
                <motion.text
                  animate={{ opacity: 0.42 }}
                  dominantBaseline="middle"
                  fill={`var(--${item.color})`}
                  fontSize="7.5"
                  fontFamily="var(--font-mono, 'JetBrains Mono', monospace)"
                  initial={{ opacity: 0 }}
                  key={`arch-label-${item.id}`}
                  letterSpacing="0.07em"
                  className="pointer-events-none select-none"
                  textAnchor="middle"
                  transition={{ delay: 1.3, duration: reducedMotion ? 0 : 0.45 }}
                  x={lx}
                  y={ly}
                >
                  {label}
                </motion.text>
              );
            })}
          </>
        ) : null}
      </svg>
    </div>
  );
}

function CenterHud({
  center,
  size,
  mode,
  reducedMotion,
}: {
  center: OrbitCenter;
  size?: number;
  mode: OrbitMode;
  reducedMotion: boolean;
}) {
  const hudSize = size ?? 336;

  return (
    <motion.div
      aria-hidden="true"
      animate={{
        height: hudSize,
        width: hudSize,
      }}
      className={cn(
        'orbit-core-hud absolute z-20 h-[336px] w-[336px]',
        reducedMotion ? 'orbit-core-hud--still' : undefined,
      )}
      data-orbit-mode={mode}
      style={{
        left: center.x,
        top: center.y,
        transform: 'translate(-50%, -50%)',
      }}
      transition={{ duration: reducedMotion ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="orbit-core-hud__halo" />
      <span className="orbit-core-hud__outer" />
      <span className="orbit-core-hud__ticks" />
      <span className="orbit-core-hud__scan" />
      <span className="orbit-core-hud__pulse" />
      <span className="orbit-core-hud__spark-ring" />
    </motion.div>
  );
}

function GridIcon() {
  return (
    <span
      className="grid h-7 w-7 place-items-center rounded-full border"
      style={{
        background: colorMix(themeColors.green, 8),
        borderColor: colorMix(themeColors.green, 18),
      }}
    >
      <svg
        aria-hidden="true"
        className="h-3.5 w-3.5"
        fill="none"
        stroke={themeColors.green}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
        viewBox="0 0 14 14"
      >
        <rect height="4" rx="0.8" width="4" x="2" y="2" />
        <rect height="4" rx="0.8" width="4" x="8" y="2" />
        <rect height="4" rx="0.8" width="4" x="2" y="8" />
        <rect height="4" rx="0.8" width="4" x="8" y="8" />
      </svg>
    </span>
  );
}

function TAOrbitalMark({
  accentColor,
  variant = 'nav',
}: {
  accentColor: string;
  variant?: 'intro' | 'nav' | 'mobile-intro' | 'mobile-nav';
}) {
  const isSmall = variant === 'mobile-nav';
  const glowSize = variant === 'intro' ? 26 : isSmall ? 12 : 18;

  return (
    <span
      className={cn(
        'orbit-ta-mark',
        `orbit-ta-mark--${variant}`,
      )}
      style={{
        background: colorMix(accentColor, isSmall ? 10 : 12),
        borderColor: colorMix(accentColor, isSmall ? 34 : 42),
        boxShadow: `0 0 ${glowSize}px ${colorMix(accentColor, variant === 'intro' ? 38 : 30)}, inset 0 0 ${glowSize}px ${colorMix(accentColor, 10)}`,
        color: accentColor,
      }}
    >
      <span className="orbit-ta-mark__ring" />
      <span className="orbit-ta-mark__dot orbit-ta-mark__dot--top" />
      <span className="orbit-ta-mark__dot orbit-ta-mark__dot--right" />
      <span className="orbit-ta-mark__dot orbit-ta-mark__dot--bottom" />
      <span className="orbit-ta-mark__dot orbit-ta-mark__dot--left" />
      <span className="orbit-ta-mark__text">TA</span>
    </span>
  );
}

function HomeCenterIdentity({
  accentColor,
  variant = 'nav',
  reducedMotion = false,
}: {
  accentColor: string;
  variant?: 'intro' | 'nav' | 'mobile-intro' | 'mobile-nav';
  reducedMotion?: boolean;
}) {
  const showExtended = variant === 'intro' || variant === 'mobile-intro';
  const isIntro = variant === 'intro' || variant === 'mobile-intro';
  const introDelay = variant === 'mobile-intro' ? 0.1 : 0.18;
  const introTransition = (delay: number) => ({
    delay: reducedMotion || !isIntro ? 0 : delay,
    duration: reducedMotion ? 0 : isIntro ? 0.48 : 0.24,
    ease: [0.16, 1, 0.3, 1] as const,
  });

  return (
    <span className={cn('orbit-identity-lockup', `orbit-identity-lockup--${variant}`)}>
      <motion.span
        animate={{ opacity: 1, scale: 1, y: 0 }}
        initial={isIntro ? { opacity: 0, scale: 0.72, y: 8 } : { opacity: 1, scale: 1, y: 0 }}
        transition={introTransition(introDelay)}
      >
        <TAOrbitalMark accentColor={accentColor} variant={variant} />
      </motion.span>
      <motion.span
        animate={{ opacity: 1, y: 0 }}
        className="orbit-identity-lockup__name text-textPrimary"
        initial={isIntro ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        transition={introTransition(introDelay + 0.18)}
      >
        Tousif Ali
      </motion.span>
      <motion.span
        animate={{ opacity: 1, y: 0 }}
        className="orbit-identity-lockup__role text-textSecondary"
        initial={isIntro ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
        transition={introTransition(introDelay + 0.3)}
      >
        AI Product & Systems Builder
      </motion.span>
      <AnimatePresence>
        {showExtended ? (
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className="orbit-identity-lockup__extended"
            exit={{ opacity: 0, y: -4 }}
            initial={{ opacity: 0, y: 4 }}
            key="identity-extended"
            transition={{
              delay: reducedMotion ? 0 : introDelay + 0.46,
              duration: reducedMotion ? 0 : 0.42,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span aria-hidden="true" className="orbit-identity-lockup__divider">
              <span />
              <span />
              <span />
            </span>
            <span className="orbit-identity-lockup__domains">
              Workflows
              <span>Automation</span>
              <span>AI</span>
            </span>
            <span
              className="orbit-live-status"
              style={{
                borderColor: colorMix(accentColor, variant === 'mobile-intro' ? 24 : 32),
                background: colorMix(accentColor, variant === 'mobile-intro' ? 7 : 9),
                color: accentColor,
              }}
            >
              <span
                className="orbit-live-status__dot"
                style={{
                  background: accentColor,
                  boxShadow: `0 0 ${variant === 'mobile-intro' ? 8 : 12}px ${accentColor}`,
                }}
              />
              Building live systems
            </span>
            {variant === 'intro' ? (
              <motion.span
                animate={{ opacity: 0.5, y: 0 }}
                className="mt-3.5 font-mono text-[8px] uppercase tracking-[0.16em] text-textMuted"
                initial={{ opacity: 0, y: 4 }}
                transition={{
                  delay: reducedMotion ? 0 : introDelay + 0.82,
                  duration: reducedMotion ? 0 : 0.36,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                click to explore →
              </motion.span>
            ) : null}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

function SimpleTAMark({
  accentColor,
  small = false,
}: {
  accentColor: string;
  small?: boolean;
}) {
  return (
    <span
      className={cn(
        'grid place-items-center rounded-full border font-display font-semibold',
        small ? 'h-8 w-8 text-[11px]' : 'h-11 w-11 text-sm',
      )}
      style={{
        background: colorMix(accentColor, small ? 10 : 12),
        borderColor: colorMix(accentColor, small ? 28 : 34),
        boxShadow: `0 0 ${small ? 12 : 18}px ${colorMix(accentColor, small ? 18 : 24)}`,
        color: accentColor,
      }}
    >
      TA
    </span>
  );
}

function HomeNavIdentity({
  accentColor,
  mobile = false,
}: {
  accentColor: string;
  mobile?: boolean;
}) {
  return (
    <span className={cn('orbit-nav-identity', mobile ? 'orbit-nav-identity--mobile' : undefined)}>
      <SimpleTAMark accentColor={accentColor} small={mobile} />
      <span className="orbit-nav-identity__name text-textPrimary">
        Tousif Ali
      </span>
      <span className="orbit-nav-identity__role text-textSecondary">
        AI Product & Systems Builder
      </span>
    </span>
  );
}

function ProjectsCenterIdentity({
  accentColor,
}: {
  accentColor: string;
}) {
  return (
    <span className="grid place-items-center gap-1.5">
      <GridIcon />
      <span className="font-display text-[28px] font-medium leading-none text-textPrimary">
        Projects
      </span>
      <span
        className="font-body text-[10px] font-normal leading-[1.4]"
        style={{ color: accentColor }}
      >
        5 case studies
      </span>
    </span>
  );
}

function CenterNode({
  center,
  expanded,
  mode,
  introNodeSize,
  onToggleHome,
  reducedMotion,
}: {
  center: OrbitCenter;
  expanded: boolean;
  mode: OrbitMode;
  introNodeSize: number;
  onToggleHome: () => void;
  reducedMotion: boolean;
}) {
  const isProjects = mode === 'projects';
  const canReveal = mode === 'home' && !expanded;
  const canToggleHome = mode === 'home';
  const nodeSize = isProjects ? 190 : canReveal ? introNodeSize : 220;
  const accentColor = isProjects ? themeColors.green : themeColors.blue;
  const glowColor = isProjects
    ? 'var(--center-green-shadow)'
    : 'var(--center-blue-shadow)';

  return (
    <motion.button
      aria-label={
        canToggleHome
          ? expanded
            ? 'Return to intro orbit'
            : 'Open orbit navigation'
          : 'Projects hub — select a project to explore'
      }
      animate={{
        borderColor: accentColor,
        boxShadow: glowColor,
        height: nodeSize,
        opacity: 1,
        scale: 1,
        width: nodeSize,
      }}
      className={cn(
        'orbit-center-node absolute z-30 flex items-center justify-center rounded-full border-2 bg-surface text-center outline-none transition-colors duration-200',
        canToggleHome ? 'cursor-pointer hover:bg-surfaceRaised' : 'cursor-default',
      )}
      data-orbit-mode={mode}
      data-testid="orbit-center-node"
      initial={{ opacity: 0, scale: 0.8 }}
      onClick={canToggleHome ? onToggleHome : undefined}
      style={{
        left: center.x,
        top: center.y,
        translateX: '-50%',
        translateY: '-50%',
      }}
      transition={{
        duration: reducedMotion ? 0 : 0.7,
        ease: [0.16, 1, 0.3, 1],
        opacity: { delay: reducedMotion ? 0 : 0.12 },
      }}
      type="button"
      whileHover={canToggleHome && !reducedMotion ? { scale: 1.025 } : undefined}
      whileTap={canToggleHome && !reducedMotion ? { scale: 0.985 } : undefined}
    >
      <AnimatePresence mode="wait">
        {isProjects ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid place-items-center gap-1.5"
            exit={{ opacity: 0, y: -6 }}
            initial={{ opacity: 0, y: 6 }}
            key="projects-center"
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <ProjectsCenterIdentity accentColor={themeColors.green} />
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid place-items-center"
            exit={{ opacity: 0, y: -6 }}
            initial={{ opacity: 0, y: 6 }}
            key={canReveal ? 'home-intro-center' : 'home-nav-center'}
            transition={{ duration: reducedMotion ? 0 : 0.28, ease: 'easeOut' }}
          >
            {canReveal ? (
              <HomeCenterIdentity
                accentColor={accentColor}
                reducedMotion={reducedMotion}
                variant="intro"
              />
            ) : (
              <HomeNavIdentity accentColor={accentColor} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      animate={{ opacity: 1, y: 0 }}
      aria-label="Back to home navigation"
      className="absolute left-8 top-20 z-40 inline-flex items-center gap-2 bg-transparent font-body text-[13px] font-normal text-textSecondary outline-none transition-colors duration-200 hover:text-textPrimary"
      exit={{ opacity: 0, y: -6 }}
      initial={{ opacity: 0, y: -6 }}
      onClick={onClick}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      type="button"
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 16 16"
      >
        <path d="M10 3.5 5.5 8l4.5 4.5" />
        <path d="M6 8h7" />
      </svg>
      Back
    </motion.button>
  );
}

function useMobileOrbitStageWidth(): number {
  const [stageWidth, setStageWidth] = useState(360);

  useEffect(() => {
    let frameId = 0;

    function updateStageWidth(): void {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        setStageWidth(Math.min(430, Math.max(340, window.innerWidth - 8)));
      });
    }

    updateStageWidth();
    window.addEventListener('resize', updateStageWidth);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateStageWidth);
    };
  }, []);

  return stageWidth;
}

function useMobileViewportHeight(): number {
  const [viewportHeight, setViewportHeight] = useState(760);

  useEffect(() => {
    let frameId = 0;

    function updateViewportHeight(): void {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        setViewportHeight(window.innerHeight);
      });
    }

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.visualViewport?.addEventListener('resize', updateViewportHeight);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateViewportHeight);
      window.visualViewport?.removeEventListener('resize', updateViewportHeight);
    };
  }, []);

  return viewportHeight;
}

function MobileOrbitStage({
  expanded,
  items,
  mode,
  onBack,
  onCenterClick,
  onNodeClick,
  reducedMotion,
}: {
  expanded: boolean;
  items: OrbitItem[];
  mode: OrbitMode;
  onBack: () => void;
  onCenterClick: () => void;
  onNodeClick: (item: OrbitItem) => void;
  reducedMotion: boolean;
}) {
  const accent: AccentColor = mode === 'projects' ? 'green' : 'blue';
  const accentColor = themeColors[accent];
  const stageWidth = useMobileOrbitStageWidth();
  const viewportHeight = useMobileViewportHeight();
  const mobileTopOffset = 90;
  const mobileBottomOffset = 66;
  const stageHeight = Math.max(460, viewportHeight - mobileTopOffset - mobileBottomOffset);
  const center = { x: stageWidth / 2, y: stageHeight / 2 };
  const nodeSize = Math.min(112, Math.max(100, stageWidth * 0.29));
  const nodeCircleSize = 86;
  const radius = Math.min(176, Math.max(148, (stageWidth - nodeCircleSize) / 2 - 4));
  const isProjects = mode === 'projects';
  const isIntro = mode === 'home' && !expanded;
  const canToggleHome = mode === 'home';
  const hudSize = isIntro
    ? Math.min(390, Math.max(350, stageWidth * 0.96))
    : Math.min(322, Math.max(280, radius * 1.9));
  const centerNodeSize = isProjects ? 164 : isIntro ? Math.min(282, stageWidth * 0.72) : 184;

  const positionedItems = items.map((item) => {
    const point = getOrbitPosition(item.angle, radius);

    return {
      ...item,
      cx: center.x + point.x,
      cy: center.y + point.y,
    };
  });

  return (
    <div
      className="relative overflow-hidden px-3 pb-[66px] pt-[90px] md:hidden"
      style={{ boxSizing: 'border-box', height: '100svh' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 32%, ${colorMix(accentColor, 20)}, transparent 38%)`,
        }}
      />

      <AnimatePresence>
        {isProjects ? (
          <motion.button
            animate={{ opacity: 1, x: 0 }}
            className="absolute left-5 top-[88px] z-30 inline-flex items-center gap-2 rounded-full border px-3 py-2 font-body text-[12px] text-textSecondary backdrop-blur-md"
            exit={{ opacity: 0, x: -8 }}
            initial={{ opacity: 0, x: -8 }}
            onClick={onBack}
            style={{
              background: 'color-mix(in srgb, var(--surface) 70%, transparent)',
              borderColor: 'var(--surface-border)',
            }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: 'easeOut' }}
            type="button"
          >
            <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 16 16">
              <path d="M10 3.5 5.5 8l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
              <path d="M6 8h7" strokeLinecap="round" strokeWidth="1.7" />
            </svg>
            Back
          </motion.button>
        ) : null}
      </AnimatePresence>

      <div
        className="relative mx-auto"
        style={{ height: stageHeight, width: stageWidth }}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          fill="none"
          viewBox={`0 0 ${stageWidth} ${stageHeight}`}
        >
          <defs>
            <radialGradient id="mobile-orbit-haze" cx="50%" cy="42%" r="50%">
              <stop offset="0%" stopColor={colorMix(accentColor, 24)} />
              <stop offset="58%" stopColor={colorMix(accentColor, 8)} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx={center.x} cy={center.y} fill="url(#mobile-orbit-haze)" r={expanded ? radius * 1.35 : hudSize * 0.62} />
          <circle
            className="orbit-ring-rotate"
            cx={center.x}
            cy={center.y}
            r={expanded ? radius : hudSize * 0.31}
            stroke={colorMix(accentColor, expanded ? 50 : 36)}
            strokeDasharray="2 10"
            strokeLinecap="round"
            strokeWidth="0.8"
            style={{ transformOrigin: `${center.x}px ${center.y}px` }}
          />
          <circle
            cx={center.x}
            cy={center.y}
            r={expanded ? radius * 0.66 : hudSize * 0.43}
            stroke={colorMix(accentColor, 28)}
            strokeDasharray="1 7"
            strokeLinecap="round"
            strokeWidth="0.6"
          />

          <AnimatePresence>
            {expanded
              ? positionedItems.map((item, index) => (
                    <motion.line
                      animate={{ opacity: 0.55, pathLength: 1 }}
                    exit={{ opacity: 0, pathLength: 0 }}
                    initial={{ opacity: 0, pathLength: 0 }}
                    key={`mobile-line-${mode}-${item.id}`}
                    stroke={`var(--${item.color})`}
                    strokeDasharray="4 5"
                    strokeWidth="0.8"
                    transition={{
                      delay: reducedMotion ? 0 : 0.54 + index * 0.07,
                      duration: reducedMotion ? 0 : 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    vectorEffect="non-scaling-stroke"
                    x1={center.x}
                    x2={item.cx}
                    y1={center.y}
                    y2={item.cy}
                  />
                ))
              : null}
          </AnimatePresence>

          {expanded ? (
            <g className="orbit-anchor-points">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                const point = pointOnCircle(center, radius, angle);

                return (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    fill={`var(--${accent})`}
                    key={`mobile-anchor-${angle}`}
                    opacity="0.78"
                    r={angle % 90 === 0 ? 2.6 : 1.9}
                  />
                );
              })}
            </g>
          ) : null}

          {expanded && !reducedMotion ? (
            <motion.g
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ delay: 0.88, duration: 0.34 }}
            >
              {positionedItems.flatMap((item) => {
                const pathD = `M 0 0 L ${item.cx - center.x} ${item.cy - center.y}`;

                return [0, 0.78, 1.56].map((offset, particleIndex) => (
                  <g
                    key={`mobile-particle-${mode}-${item.id}-${particleIndex}`}
                    transform={`translate(${center.x} ${center.y})`}
                  >
                    <circle fill={`var(--${item.color})`} opacity={0} r={1.7}>
                      <animate
                        attributeName="opacity"
                        begin={`${0.9 + offset}s`}
                        dur="2.4s"
                        keyTimes="0;0.08;0.74;1"
                        repeatCount="indefinite"
                        values="0;0.9;0.72;0"
                      />
                      <animateMotion
                        begin={`${0.9 + offset}s`}
                        dur="2.4s"
                        path={pathD}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ));
              })}
            </motion.g>
          ) : null}
        </svg>

        <CenterHud
          center={center}
          mode={mode}
          reducedMotion={reducedMotion}
          size={hudSize}
        />

        <motion.button
          animate={{
            borderColor: accentColor,
            boxShadow: isProjects ? 'var(--center-green-shadow)' : 'var(--center-blue-shadow)',
            height: centerNodeSize,
            opacity: 1,
            scale: 1,
            width: centerNodeSize,
            x: '-50%',
            y: '-50%',
          }}
          aria-label={
            canToggleHome
              ? expanded
                ? 'Return to intro orbit'
                : 'Open orbit navigation'
              : 'Projects hub — select a project to explore'
          }
          className="orbit-center-node absolute z-20 grid place-items-center rounded-full border-2 bg-surface text-center outline-none"
          data-orbit-mode={mode}
          data-testid="orbit-center-node"
          initial={{ opacity: 0, scale: 0.86, x: '-50%', y: '-50%' }}
          onClick={canToggleHome ? onCenterClick : undefined}
          style={{ left: center.x, top: center.y }}
          transition={{ duration: reducedMotion ? 0 : 0.38, ease: [0.16, 1, 0.3, 1] }}
          type="button"
          whileTap={canToggleHome && !reducedMotion ? { scale: 0.98 } : undefined}
        >
          {isProjects ? (
            <span className="grid place-items-center gap-1.5">
              <span
                className="grid h-8 w-8 place-items-center rounded-full border font-display text-[11px] font-medium"
                style={{
                  background: colorMix(accentColor, 12),
                  borderColor: colorMix(accentColor, 28),
                  color: accentColor,
                }}
              >
                <GridIcon />
              </span>
              <span className="font-display text-[22px] font-medium leading-none text-textPrimary">
                Projects
              </span>
              <span className="max-w-[116px] font-body text-[10px] uppercase tracking-[0.14em] text-textSecondary">
                5 case studies
              </span>
            </span>
          ) : isIntro ? (
            <HomeCenterIdentity
              accentColor={accentColor}
              reducedMotion={reducedMotion}
              variant="mobile-intro"
            />
          ) : (
            <HomeNavIdentity accentColor={accentColor} mobile />
          )}
        </motion.button>

        <AnimatePresence>
          {expanded
            ? positionedItems.map((item, index) => {
                const labelBlock = (
                  <span className="grid min-h-[31px] place-items-center gap-1">
                    <span className="font-display text-[12px] font-medium leading-tight text-textPrimary">
                      {item.label}
                    </span>
                    <span className="font-mono text-[8px] uppercase leading-none tracking-[0.11em] text-textMuted">
                      {item.sublabel}
                    </span>
                  </span>
                );
                const labelAbove = item.angle === 270;

                return (
                  <motion.button
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    className="absolute z-30 flex flex-col items-center text-center outline-none"
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    initial={{
                      opacity: 0,
                      scale: 0.88,
                    }}
                    key={`${mode}-${item.id}-mobile-node`}
                    onClick={() => onNodeClick(item)}
                    style={{
                      left: item.cx - nodeSize / 2,
                      top: item.cy - nodeCircleSize / 2 - (labelAbove ? 42 : 0),
                      width: nodeSize,
                    }}
                    transition={{
                      delay: reducedMotion ? 0 : 0.34 + index * 0.07,
                      duration: reducedMotion ? 0 : 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    type="button"
                    whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                  >
                    {labelAbove ? <span className="mb-2">{labelBlock}</span> : null}
                    <span
                      className="grid place-items-center rounded-full border bg-nodeSurface backdrop-blur-md"
                      style={{
                        height: nodeCircleSize,
                        width: nodeCircleSize,
                        background: `radial-gradient(circle at 50% 0%, ${colorMix(themeColors[item.color], 16)}, transparent 64%), var(--node-surface)`,
                        borderColor: colorMix(themeColors[item.color], 58),
                        boxShadow: `0 0 0 1px ${colorMix(themeColors[item.color], 24)}, 0 0 22px ${colorMix(themeColors[item.color], 24)}`,
                      }}
                    >
                      <OrbitNodeIcon className="h-6 w-6" color={themeColors[item.color]} icon={item.icon} />
                    </span>
                    {labelAbove ? null : <span className="mt-2.5">{labelBlock}</span>}
                  </motion.button>
                );
              })
            : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function OrbitCanvas({ className }: OrbitCanvasProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = Boolean(useReducedMotion());
  const viewportReady = useViewportReady();
  const [stageRef, stageSize] = useElementSize<HTMLDivElement>();
  const startsInProjects = searchParams.get('orbit') === 'projects';
  const [state, dispatch] = useReducer(
    orbitReducer,
    startsInProjects,
    createInitialOrbitState,
  );
  const visibleItems = state.mode === 'home' ? homeItems : projectItems;
  const center = useMemo(() => getOrbitCenter(stageSize), [stageSize]);
  const orbitRadius = useMemo(() => getOrbitRadius(stageSize), [stageSize]);
  const positionedItems = useMemo(
    () => getPositionedItems(visibleItems, orbitRadius),
    [visibleItems, orbitRadius],
  );
  const ringColor = state.mode === 'projects' ? themeColors.green : themeColors.blue;
  const hasViewport = viewportReady && stageSize.height > 0 && stageSize.width > 0;
  const isOrbitVisible = state.expanded;
  const isIntroOrbit = state.mode === 'home' && !state.expanded;
  const introHudSize = Math.min(500, Math.max(420, orbitRadius * 1.6));
  const introNodeSize = Math.min(360, Math.max(310, orbitRadius * 1.12));

  useEffect(() => {
    if (searchParams.get('orbit') === 'projects' && state.mode !== 'projects') {
      dispatch({ type: 'show-projects' });
    }
  }, [searchParams, state.mode]);

  function handleNodeClick(item: OrbitItem): void {
    if (item.action.type === 'projects') {
      dispatch({ type: 'show-projects' });
      return;
    }

    router.push(item.action.href);
  }

  return (
    <section
      aria-label="Portfolio orbit navigation"
      className={cn('relative min-h-screen w-full overflow-hidden', className)}
    >
      <motion.div
        animate={{ opacity: 1 }}
        className="hidden min-h-screen md:block"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <AnimatePresence>
          {state.mode === 'projects' ? (
            <BackButton
              key="back"
              onClick={() => dispatch({ type: 'show-home' })}
            />
          ) : null}
        </AnimatePresence>

        <div
          className="absolute inset-x-0 bottom-[72px] top-[92px]"
          data-testid="orbit-stage"
          ref={stageRef}
        >
          {hasViewport ? (
            <>
              <OrbitAtmosphere
                center={center}
                expanded={isOrbitVisible}
                mode={state.mode}
                positionedItems={positionedItems}
                radius={orbitRadius}
                reducedMotion={shouldReduceMotion}
                stageSize={stageSize}
              />

              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                viewBox={`0 0 ${stageSize.width} ${stageSize.height}`}
              >
                <AnimatePresence>
                  {isOrbitVisible ? (
                    <motion.circle
                      animate={{ opacity: 0.24, stroke: ringColor }}
                      cx={center.x}
                      cy={center.y}
                      exit={{ opacity: 0 }}
                      fill="none"
                      initial={{ opacity: 0 }}
                      key="orbit-ring"
                      r={orbitRadius}
                      stroke={ringColor}
                      strokeDasharray="4 2"
                      strokeWidth="0.7"
                      transition={{
                        delay: shouldReduceMotion ? 0 : 0.42,
                        duration: shouldReduceMotion ? 0 : 0.45,
                        ease: 'easeOut',
                      }}
                      vectorEffect="non-scaling-stroke"
                    />
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {isOrbitVisible
                    ? positionedItems.map((item, index) => (
                        <OrbitConnection
                          accent={item.color}
                          delay={0.58 + index * 0.12}
                          hovered={state.hoveredId === item.id}
                          key={`${state.mode}-${item.id}-line`}
                          reducedMotion={shouldReduceMotion}
                          x1={center.x}
                          x2={center.x + item.x}
                          y1={center.y}
                          y2={center.y + item.y}
                        />
                      ))
                    : null}
                </AnimatePresence>

                <AnimatePresence>
                  {isOrbitVisible && !shouldReduceMotion ? (
                    <OrbitFlowParticles
                      center={center}
                      key={state.mode}
                      positionedItems={positionedItems}
                    />
                  ) : null}
                </AnimatePresence>
              </svg>

              <AnimatePresence>
                {isOrbitVisible ? (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-5 right-7 z-30 flex select-none items-center gap-2"
                    exit={{ opacity: 0, y: 4 }}
                    initial={{ opacity: 0, y: 4 }}
                    key="sys-status"
                    transition={{ delay: shouldReduceMotion ? 0 : 1.25, duration: shouldReduceMotion ? 0 : 0.28, ease: 'easeOut' }}
                  >
                    <span
                      className="h-[5px] w-[5px] rounded-full"
                      style={{ background: 'var(--green)', boxShadow: '0 0 5px var(--green)' }}
                    />
                    <span
                      className="font-mono text-[8.5px] uppercase tracking-[0.16em]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      pipeline active
                    </span>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <CenterHud
                center={center}
                mode={state.mode}
                reducedMotion={shouldReduceMotion}
                size={isIntroOrbit ? introHudSize : undefined}
              />

              <CenterNode
                center={center}
                expanded={state.expanded}
                introNodeSize={introNodeSize}
                mode={state.mode}
                onToggleHome={() => dispatch({ type: 'toggle-home' })}
                reducedMotion={shouldReduceMotion}
              />

              <AnimatePresence>
                {isOrbitVisible
                  ? positionedItems.map((item, index) => (
                      <OrbitNode
                        accent={item.color}
                        entryX={center.x + item.x * 0.78 - ORBIT_NODE_WIDTH / 2}
                        entryY={center.y + item.y * 0.78 - ORBIT_NODE_HEIGHT / 2}
                        entranceDelay={1.0 + index * 0.09}
                        exitX={center.x + item.x * 0.72 - ORBIT_NODE_WIDTH / 2}
                        exitY={center.y + item.y * 0.72 - ORBIT_NODE_HEIGHT / 2}
                        hover={state.hoveredId === item.id}
                        icon={item.icon}
                        key={`${state.mode}-${item.id}`}
                        label={item.label}
                        onClick={() => handleNodeClick(item)}
                        onHoverChange={(hovered) =>
                          dispatch({ id: hovered ? item.id : null, type: 'hover' })
                        }
                        reducedMotion={shouldReduceMotion}
                        sublabel={item.sublabel}
                        tooltip={item.tooltip}
                        x={center.x + item.x - ORBIT_NODE_WIDTH / 2}
                        y={center.y + item.y - ORBIT_NODE_HEIGHT / 2}
                      />
                    ))
                  : null}
              </AnimatePresence>
            </>
          ) : null}
        </div>
      </motion.div>

      <MobileOrbitStage
        expanded={state.expanded}
        items={visibleItems}
        mode={state.mode}
        onBack={() => dispatch({ type: 'show-home' })}
        onCenterClick={() => dispatch({ type: 'toggle-home' })}
        onNodeClick={handleNodeClick}
        reducedMotion={shouldReduceMotion}
      />
    </section>
  );
}

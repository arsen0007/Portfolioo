import { create } from 'zustand';

/**
 * The contract between pages and the one persistent WebGL scene.
 *
 * Pages never touch three.js. They declare *intent* — which shape the
 * particle field should form, where it sits, how much of it has "become
 * signal" — and the scene (components/canvas/*) animates toward it.
 *
 * Shapes:
 *  - 'noise'      curl-noise cloud: the unsorted manual queue (home hero)
 *  - 'clusters'   31 tight clusters: the legal taxonomy CaseWise sorts into
 *  - 'pipeline'   a ribbon flowing through 3 gates: classify → summarize → outreach
 *  - 'bridge'     two groups (operators / engineers) joined by one thin bridge
 *  - 'grid'       an ordered lattice: a system at rest
 *  - 'sphere'     a calm breathing orb: default for inner pages, "listening" on contact
 *  - 'portrait'   points sampled from /profile.webp (about page)
 *  - 'text:XYZ'   particles form the string XYZ, e.g. 'text:433', 'text:TOUSIF ALI'
 *  - 'project:<slug>'  a shape per case study (slugs from lib/data/caseStudies)
 */
export type ShapeId =
  | 'noise'
  | 'clusters'
  | 'pipeline'
  | 'bridge'
  | 'grid'
  | 'sphere'
  | 'portrait'
  | `text:${string}`
  | `project:${string}`;

/** Where the formation sits in the viewport. */
export type SceneLayout = 'full' | 'right' | 'left' | 'center' | 'top' | 'bottom';

export type GpuTier = 'unknown' | 'none' | 'low' | 'mid' | 'high';

export type SceneIntent = {
  shape: ShapeId;
  layout: SceneLayout;
  /** 0..1 fraction of particles drawn in signal orange (the rest are bone/ink). */
  signal: number;
  /** 0..1 overall field opacity; lower it behind dense text. */
  intensity: number;
  /** 0..1 how much curl-noise turbulence to add on top of the shape. */
  turbulence: number;
};

type SceneState = SceneIntent & {
  tier: GpuTier;
  /** True once the canvas has compiled and drawn its first frame. */
  ready: boolean;
  /** Smoothed page scroll (px) and velocity, written by SmoothScroll. */
  scroll: number;
  velocity: number;
  /** 0..1 progress through the active SceneTrigger, when it is scrubbed. */
  progress: number;
  /** Hovered project slug on work lists (preview shape + image). */
  hoveredProject: string | null;

  setIntent: (intent: Partial<SceneIntent>) => void;
  setTier: (tier: GpuTier) => void;
  setReady: (ready: boolean) => void;
  setScroll: (scroll: number, velocity: number) => void;
  setProgress: (progress: number) => void;
  setHoveredProject: (slug: string | null) => void;
};

export const DEFAULT_INTENT: SceneIntent = {
  shape: 'sphere',
  layout: 'right',
  signal: 0.15,
  intensity: 0.7,
  turbulence: 0.25,
};

export const useScene = create<SceneState>((set) => ({
  ...DEFAULT_INTENT,
  tier: 'unknown',
  ready: false,
  scroll: 0,
  velocity: 0,
  progress: 0,
  hoveredProject: null,

  setIntent: (intent) => set(intent),
  setTier: (tier) => set({ tier }),
  setReady: (ready) => set({ ready }),
  setScroll: (scroll, velocity) => set({ scroll, velocity }),
  setProgress: (progress) => set({ progress }),
  setHoveredProject: (hoveredProject) => set({ hoveredProject }),
}));

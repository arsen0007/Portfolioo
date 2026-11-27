import type { GpuTier } from '@/lib/store/scene';

/** Particle budget per tier. high = 308x308 texture drawing exactly 94,363. */
export const TIER_CONFIG = {
  high: { width: 308, height: 308, count: 94363, maxDpr: 2, post: true },
  mid: { width: 128, height: 256, count: 32768, maxDpr: 1.5, post: false },
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

type Probe = { webgl2: boolean; renderer: string };

function probeWebGL(): Probe {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    if (!gl) return { webgl2: false, renderer: '' };
    let renderer = '';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (ext) renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { webgl2: true, renderer };
  } catch {
    return { webgl2: false, renderer: '' };
  }
}

const SOFTWARE = /swiftshader|llvmpipe|software|basic render|softpipe|microsoft basic/i;

function heuristicTier(renderer: string): GpuTier {
  if (SOFTWARE.test(renderer)) return 'low';
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  const mobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  if (mobile) return cores >= 6 && mem >= 4 ? 'mid' : 'low';
  if (cores >= 8 && mem >= 8) return 'high';
  if (cores >= 4) return 'mid';
  return 'low';
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = window.setTimeout(() => reject(new Error('timeout')), ms);
    p.then(
      (v) => {
        window.clearTimeout(t);
        resolve(v);
      },
      (e) => {
        window.clearTimeout(t);
        reject(e);
      },
    );
  });
}

/**
 * Resolve the device tier. `?tier=high|mid|low|none` overrides everything
 * (testing), and also disables the FPS watchdog.
 */
export async function detectTier(): Promise<{ tier: GpuTier; forced: boolean }> {
  const q = new URLSearchParams(window.location.search).get('tier');
  if (q === 'high' || q === 'mid' || q === 'low' || q === 'none') return { tier: q, forced: true };

  if (prefersReducedMotion()) return { tier: 'none', forced: false };
  const probe = probeWebGL();
  if (!probe.webgl2) return { tier: 'none', forced: false };

  const mobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  let tier: GpuTier;
  try {
    const { getGPUTier } = await import('detect-gpu');
    const res = await withTimeout(getGPUTier({ failIfMajorPerformanceCaveat: false }), 3500);
    if (res.type === 'FALLBACK' || res.type === 'WEBGL_UNSUPPORTED') {
      tier = heuristicTier(probe.renderer);
    } else if (SOFTWARE.test(probe.renderer) || res.tier === 0) {
      tier = 'low';
    } else if (res.tier === 1) {
      tier = 'low';
    } else if (res.tier === 2) {
      tier = 'mid';
    } else {
      tier = res.isMobile || mobile ? 'mid' : 'high';
    }
  } catch {
    tier = heuristicTier(probe.renderer);
  }
  return { tier, forced: false };
}

export function stepDown(tier: GpuTier): GpuTier {
  if (tier === 'high') return 'mid';
  if (tier === 'mid') return 'low';
  return tier;
}

/**
 * Runtime FPS watchdog: if a 3s window averages below `threshold` fps,
 * fires `onSlow` once. The first window (shader compile, shape generation)
 * is ignored, and windows that span a hidden tab are discarded.
 */
export class FpsWatchdog {
  private frames = 0;
  private start = 0;
  private windows = 0;
  private fired = false;
  constructor(
    private readonly onSlow: () => void,
    private readonly threshold = 40,
    private readonly windowMs = 3000,
  ) {}

  reset(): void {
    this.frames = 0;
    this.start = 0;
  }

  tick(now: number): void {
    if (this.fired) return;
    if (!this.start) {
      this.start = now;
      this.frames = 0;
      return;
    }
    this.frames++;
    const elapsed = now - this.start;
    if (elapsed >= this.windowMs) {
      const fps = (this.frames * 1000) / elapsed;
      this.windows++;
      this.start = now;
      this.frames = 0;
      if (this.windows > 1 && fps < this.threshold) {
        this.fired = true;
        this.onSlow();
      }
    }
  }
}

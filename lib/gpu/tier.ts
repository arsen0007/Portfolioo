import type { GpuTier } from '@/lib/store/scene';

/** Particle budget per tier. high = 308x308 texture drawing exactly 94,363. */
export const TIER_CONFIG = {
  high: { width: 308, height: 308, count: 94363, maxDpr: 1.5, post: true },
  mid: { width: 128, height: 256, count: 32768, maxDpr: 1.25, post: false },
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

/**
 * Quality-first tiering. No remote benchmark lookup: the starting tier comes
 * from local signals, and the *measured* frame rate decides from there (see
 * FpsProbe and the intro loader, which hides any re-tier from the visitor).
 *
 *  - desktop with a real GPU       -> high (94,363 particles + bloom)
 *  - capable phone / tablet        -> mid, upgraded to high if it measures smooth
 *  - software renderer, weak phone -> low (static poster)
 */
function startingTier(renderer: string): GpuTier {
  if (SOFTWARE.test(renderer)) return 'low';
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4; // Safari does not expose it: assume capable
  const mobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  if (mobile) return cores >= 4 && mem >= 3 ? 'mid' : 'low';
  return cores >= 4 ? 'high' : 'mid';
}

/**
 * Resolve the starting tier. `?tier=high|mid|low|none` overrides everything
 * (testing), and also disables the FPS watchdog.
 */
export async function detectTier(): Promise<{ tier: GpuTier; forced: boolean }> {
  const q = new URLSearchParams(window.location.search).get('tier');
  if (q === 'high' || q === 'mid' || q === 'low' || q === 'none') return { tier: q, forced: true };

  if (prefersReducedMotion()) return { tier: 'none', forced: false };
  const probe = probeWebGL();
  if (!probe.webgl2) return { tier: 'none', forced: false };
  return { tier: startingTier(probe.renderer), forced: false };
}

/**
 * Measures real frame rate over a short window after warm-up. Used while the
 * intro loader covers the screen, so a re-tier is never visible.
 */
export class FpsProbe {
  private frames = 0;
  private start = 0;
  private born = 0;
  constructor(
    private readonly onResult: (fps: number) => void,
    private readonly warmupMs = 350,
    private readonly windowMs = 1100,
  ) {}

  private done = false;

  tick(now: number): void {
    if (this.done) return;
    if (!this.born) this.born = now;
    if (now - this.born < this.warmupMs) return;
    if (!this.start) {
      this.start = now;
      this.frames = 0;
      return;
    }
    this.frames++;
    const elapsed = now - this.start;
    if (elapsed >= this.windowMs) {
      this.done = true;
      this.onResult((this.frames * 1000) / elapsed);
    }
  }
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

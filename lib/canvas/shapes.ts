/**
 * Procedural target point sets for the particle field.
 *
 * Every shape is generated lazily on the client into a Float32Array of
 * `count * 4` floats: x, y, z and a flag channel `w`.
 *
 *   w = 0   static point
 *   w = 1   "breathing" point (sphere)
 *   w = 2   flow point: xyz holds (u, theta, radius) on the pipeline curve and
 *           the simulation advances it along the curve over time
 *   w += 4  ambient dust (rendered dimmer / smaller)
 *
 * Generation is chunked against a ~6ms budget so it never blocks a frame.
 * All shapes are authored to live inside x +-2, y +-1.2, z +-1 world units.
 */
import type { ShapeId } from '@/lib/store/scene';

export const SHAPE_HALF_W = 2;
export const SHAPE_HALF_H = 1.2;

type Rng = () => number;

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Approximate standard normal (sum of 4 uniforms, variance-normalised). */
function gauss(r: Rng): number {
  return (r() + r() + r() + r() - 2) * 1.732;
}

type V3 = [number, number, number];
type Sampler = (r: Rng, out: V3) => void;
type Prim = { weight: number; sample: Sampler };

/* ------------------------------------------------------------------ */
/* primitives                                                          */
/* ------------------------------------------------------------------ */

const jit = (r: Rng, s: number) => gauss(r) * s;

function rectFill(cx: number, cy: number, w: number, h: number, z = 0, th = 0.02, soft = 0.004): Prim {
  return {
    weight: w * h * 1.4,
    sample: (r, o) => {
      o[0] = cx + (r() - 0.5) * w + jit(r, soft);
      o[1] = cy + (r() - 0.5) * h + jit(r, soft);
      o[2] = z + (r() - 0.5) * th;
    },
  };
}

function segment(x1: number, y1: number, x2: number, y2: number, z = 0, th = 0.02, soft = 0.006): Prim {
  const len = Math.hypot(x2 - x1, y2 - y1);
  return {
    weight: len,
    sample: (r, o) => {
      const t = r();
      o[0] = x1 + (x2 - x1) * t + jit(r, soft);
      o[1] = y1 + (y2 - y1) * t + jit(r, soft);
      o[2] = z + (r() - 0.5) * th;
    },
  };
}

function polyline(pts: [number, number][], z = 0, th = 0.02, soft = 0.006, closed = false): Prim {
  const segs: { a: [number, number]; b: [number, number]; len: number }[] = [];
  let total = 0;
  const n = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segs.push({ a, b, len });
    total += len;
  }
  return {
    weight: total,
    sample: (r, o) => {
      let d = r() * total;
      let s = segs[0];
      for (let i = 0; i < segs.length; i++) {
        s = segs[i];
        if (d <= s.len) break;
        d -= s.len;
      }
      const t = s.len > 0 ? Math.min(1, d / s.len) : 0;
      o[0] = s.a[0] + (s.b[0] - s.a[0]) * t + jit(r, soft);
      o[1] = s.a[1] + (s.b[1] - s.a[1]) * t + jit(r, soft);
      o[2] = z + (r() - 0.5) * th;
    },
  };
}

function rectOutline(cx: number, cy: number, w: number, h: number, z = 0, th = 0.02, soft = 0.005): Prim {
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const y0 = cy - h / 2;
  const y1 = cy + h / 2;
  return polyline(
    [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
    ],
    z,
    th,
    soft,
    true,
  );
}

function roundedRect(cx: number, cy: number, w: number, h: number, rad: number, z = 0, th = 0.02, soft = 0.005): Prim {
  const pts: [number, number][] = [];
  const hw = w / 2 - rad;
  const hh = h / 2 - rad;
  const corners: [number, number, number][] = [
    [hw, hh, 0],
    [-hw, hh, Math.PI / 2],
    [-hw, -hh, Math.PI],
    [hw, -hh, Math.PI * 1.5],
  ];
  for (const [ox, oy, a0] of corners) {
    for (let i = 0; i <= 8; i++) {
      const a = a0 + (i / 8) * (Math.PI / 2);
      pts.push([cx + ox + Math.cos(a) * rad, cy + oy + Math.sin(a) * rad]);
    }
  }
  return polyline(pts, z, th, soft, true);
}

function circleOutline(cx: number, cy: number, rad: number, z = 0, th = 0.02, soft = 0.005): Prim {
  return {
    weight: rad * Math.PI * 2,
    sample: (r, o) => {
      const a = r() * Math.PI * 2;
      o[0] = cx + Math.cos(a) * rad + jit(r, soft);
      o[1] = cy + Math.sin(a) * rad + jit(r, soft);
      o[2] = z + (r() - 0.5) * th;
    },
  };
}

function blob(cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, weight: number): Prim {
  return {
    weight,
    sample: (r, o) => {
      o[0] = cx + jit(r, sx);
      o[1] = cy + jit(r, sy);
      o[2] = cz + jit(r, sz);
    },
  };
}

function composite(prims: Prim[]): Sampler {
  const total = prims.reduce((s, p) => s + p.weight, 0);
  const cum: number[] = [];
  let acc = 0;
  for (const p of prims) {
    acc += p.weight / total;
    cum.push(acc);
  }
  return (r, o) => {
    const x = r();
    let i = 0;
    while (i < cum.length - 1 && x > cum[i]) i++;
    prims[i].sample(r, o);
  };
}

/** Rotate a sampler's output: yaw (about Y), then roll (about Z). */
function transformed(s: Sampler, yaw: number, roll: number, sc = 1, ox = 0, oy = 0, oz = 0): Sampler {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  return (r, o) => {
    s(r, o);
    let x = o[0] * sc;
    let y = o[1] * sc;
    let z = o[2] * sc;
    const x1 = cy * x + sy * z;
    z = -sy * x + cy * z;
    x = x1;
    const x2 = cr * x - sr * y;
    y = sr * x + cr * y;
    x = x2;
    o[0] = x + ox;
    o[1] = y + oy;
    o[2] = z + oz;
  };
}

/* ------------------------------------------------------------------ */
/* shape definitions                                                    */
/* ------------------------------------------------------------------ */

type Gen = {
  /** Fraction of particles that become ambient dust. */
  dust: number;
  /** Optional async preparation (images, fonts). */
  prep?: () => Promise<void> | void;
  /** Builds the per-shape point sampler (called after prep). */
  build: (rng: Rng, n: number) => (k: number, r: Rng, o: V3, flag: { w: number }) => void;
};

function simple(dust: number, make: (rng: Rng) => Sampler, w = 0): Gen {
  return {
    dust,
    build: (rng) => {
      const s = make(rng);
      return (_k, r, o, f) => {
        s(r, o);
        f.w = w;
      };
    },
  };
}

const noiseGen: Gen = {
  dust: 0,
  build: () => {
    const blobs = [
      { x: 0, y: 0, z: 0, sx: 1.25, sy: 0.72, sz: 0.8, w: 0.45 },
      { x: -0.9, y: 0.25, z: -0.2, sx: 0.8, sy: 0.5, sz: 0.6, w: 0.22 },
      { x: 0.95, y: -0.2, z: 0.2, sx: 0.85, sy: 0.55, sz: 0.65, w: 0.22 },
      { x: 0.1, y: 0.1, z: 0, sx: 2.1, sy: 1.1, sz: 1.1, w: 0.11 },
    ];
    return (_k, r, o, f) => {
      let x = r();
      let b = blobs[0];
      for (const bl of blobs) {
        b = bl;
        if (x < bl.w) break;
        x -= bl.w;
      }
      o[0] = b.x + jit(r, b.sx);
      o[1] = b.y + jit(r, b.sy);
      o[2] = b.z + jit(r, b.sz);
      f.w = 0;
    };
  },
};

const clustersGen: Gen = {
  dust: 0.1,
  build: (rng) => {
    const centres: { x: number; y: number; z: number; s: number }[] = [];
    let guard = 0;
    while (centres.length < 31 && guard++ < 5000) {
      const a = rng() * Math.PI * 2;
      const rr = Math.sqrt(rng());
      const x = Math.cos(a) * rr * 1.85;
      const y = Math.sin(a) * rr * 1.0;
      const z = (rng() - 0.5) * 1.3;
      const s = 0.035 + Math.pow(rng(), 2.2) * 0.13;
      const minD = 0.3 + (guard > 2500 ? -0.1 : 0);
      if (centres.every((c) => Math.hypot(c.x - x, c.y - y, (c.z - z) * 0.5) > minD + (c.s + s) * 1.5)) {
        centres.push({ x, y, z, s });
      }
    }
    const cum: number[] = [];
    let tot = 0;
    for (const c of centres) tot += Math.pow(c.s, 1.7);
    let acc = 0;
    for (const c of centres) {
      acc += Math.pow(c.s, 1.7) / tot;
      cum.push(acc);
    }
    return (_k, r, o, f) => {
      const x = r();
      let i = 0;
      while (i < cum.length - 1 && x > cum[i]) i++;
      const c = centres[i];
      // dense core with a soft halo
      const s = c.s * (r() < 0.82 ? 1 : 2.2);
      o[0] = c.x + jit(r, s);
      o[1] = c.y + jit(r, s);
      o[2] = c.z + jit(r, s);
      f.w = 0;
    };
  },
};

/** Pipeline curve: must match `curvePos` in the simulation shader. */
export function pipelineCurve(u: number): V3 {
  return [(u - 0.5) * 4.2, 0.4 * Math.sin(u * Math.PI * 2 + 0.3), 0.3 * Math.sin(u * Math.PI + 1.0)];
}

const GATES = [0.22, 0.5, 0.78];

const pipelineGen: Gen = {
  dust: 0.1,
  build: () => {
    return (_k, r, o, f) => {
      if (r() < 0.9) {
        // flowing tube: (u, theta, radius)
        o[0] = r();
        o[1] = r() * Math.PI * 2;
        o[2] = 0.23 * Math.pow(r(), 0.55);
        f.w = 2;
        return;
      }
      // gate rings: perpendicular to the curve
      const g = GATES[Math.floor(r() * 3)];
      const P = pipelineCurve(g);
      const a = pipelineCurve(g + 0.01);
      const b = pipelineCurve(g - 0.01);
      const T: V3 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
      const tl = Math.hypot(T[0], T[1], T[2]);
      T[0] /= tl;
      T[1] /= tl;
      T[2] /= tl;
      // N = normalize(cross(T, z)) ; B = cross(T, N)
      let N: V3 = [T[1], -T[0], 0];
      const nl = Math.hypot(N[0], N[1], N[2]);
      N = [N[0] / nl, N[1] / nl, 0];
      const B: V3 = [T[1] * N[2] - T[2] * N[1], T[2] * N[0] - T[0] * N[2], T[0] * N[1] - T[1] * N[0]];
      const th = r() * Math.PI * 2;
      const rad = 0.56 + jit(r, 0.012);
      const off = jit(r, 0.012);
      o[0] = P[0] + rad * (Math.cos(th) * N[0] + Math.sin(th) * B[0]) + T[0] * off;
      o[1] = P[1] + rad * (Math.cos(th) * N[1] + Math.sin(th) * B[1]) + T[1] * off;
      o[2] = P[2] + rad * (Math.cos(th) * N[2] + Math.sin(th) * B[2]) + T[2] * off;
      f.w = 0;
    };
  },
};

const bridgeGen = simple(0.1, () => {
  const left = (r: Rng, o: V3) => {
    const s = r() < 0.8 ? 0.38 : 0.78;
    o[0] = -1.55 + jit(r, s);
    o[1] = jit(r, s * 0.95);
    o[2] = jit(r, s * 0.85);
  };
  const right = (r: Rng, o: V3) => {
    const s = r() < 0.8 ? 0.32 : 0.7;
    o[0] = 1.55 + jit(r, s);
    o[1] = jit(r, s * 0.95);
    o[2] = jit(r, s * 0.85);
  };
  const bridge = (r: Rng, o: V3) => {
    const t = r();
    o[0] = -1.1 + t * 2.2;
    o[1] = 0.1 * Math.sin(t * Math.PI) + jit(r, 0.008);
    o[2] = jit(r, 0.008);
  };
  return (r, o) => {
    const x = r();
    if (x < 0.4) left(r, o);
    else if (x < 0.78) right(r, o);
    else bridge(r, o);
  };
});

const gridGen: Gen = {
  dust: 0.06,
  build: () => {
    const nx = 40;
    const ny = 24;
    const nz = 14;
    return (_k, r, o, f) => {
      const i = Math.floor(r() * nx);
      const j = Math.floor(r() * ny);
      const l = Math.floor(r() * nz);
      o[0] = (i / (nx - 1) - 0.5) * 4 + jit(r, 0.005);
      o[1] = (j / (ny - 1) - 0.5) * 2.4 + jit(r, 0.005);
      o[2] = (l / (nz - 1) - 0.5) * 1.4 + jit(r, 0.005);
      f.w = 0;
    };
  },
};

const sphereGen: Gen = {
  dust: 0.1,
  build: (_rng, n) => {
    const ga = Math.PI * (3 - Math.sqrt(5));
    return (k, r, o, f) => {
      if (r() < 0.78) {
        const t = (k + 0.5) / n;
        const y = 1 - 2 * t;
        const rr = Math.sqrt(1 - y * y);
        const a = k * ga;
        const R = 1.2 * (1 - 0.05 * r() * r());
        o[0] = Math.cos(a) * rr * R;
        o[1] = y * R;
        o[2] = Math.sin(a) * rr * R;
      } else {
        // soft volumetric core for depth
        const th = r() * Math.PI * 2;
        const ph = Math.acos(2 * r() - 1);
        const R = 1.2 * Math.pow(r(), 0.45) * 0.95;
        o[0] = Math.sin(ph) * Math.cos(th) * R;
        o[1] = Math.cos(ph) * R;
        o[2] = Math.sin(ph) * Math.sin(th) * R;
      }
      f.w = 1;
    };
  },
};

/* --- project shapes ------------------------------------------------ */

const barhunterGen = simple(0.1, (rng) => {
  // 5 "jurisdictions": irregular blobs arranged like a map
  const regions = [
    { x: -1.45, y: 0.35, R: 0.62, p1: 0.3, p2: 1.1, a: 0.22 },
    { x: -0.5, y: -0.4, R: 0.5, p1: 2.1, p2: 0.4, a: 0.25 },
    { x: 0.35, y: 0.5, R: 0.58, p1: 4.0, p2: 2.2, a: 0.2 },
    { x: 1.4, y: -0.1, R: 0.64, p1: 1.4, p2: 3.3, a: 0.26 },
    { x: 0.25, y: -0.78, R: 0.38, p1: 5.1, p2: 0.9, a: 0.2 },
  ];
  void rng;
  const edge = (c: (typeof regions)[number], th: number) =>
    c.R * (1 + c.a * Math.sin(3 * th + c.p1) + 0.5 * c.a * Math.sin(5 * th + c.p2));
  const prims: Prim[] = regions.map((c) => ({
    weight: c.R * c.R,
    sample: (r, o) => {
      const th = r() * Math.PI * 2;
      const rr = Math.sqrt(r());
      const hard = r() < 0.18; // a defined border
      const rad = hard ? 1 : rr;
      const e = edge(c, th) * rad;
      o[0] = c.x + Math.cos(th) * e * 1.15 + jit(r, 0.012);
      o[1] = c.y + Math.sin(th) * e * 0.9 + jit(r, 0.012);
      o[2] = jit(r, 0.07);
    },
  }));
  // a few road-like links between regions
  prims.push(segment(-1.0, 0.1, -0.7, -0.15, 0, 0.05, 0.01));
  prims.push(segment(-0.1, -0.05, 0.05, 0.2, 0, 0.05, 0.01));
  prims.push(segment(0.8, 0.3, 1.0, 0.1, 0, 0.05, 0.01));
  return composite(prims);
});

const casewiseGen = simple(0.1, () => {
  const prims: Prim[] = [];
  const pages = 5;
  for (let p = 0; p < pages; p++) {
    const z = (p - (pages - 1) / 2) * 0.28;
    const pg: Prim[] = [];
    pg.push(rectOutline(0, 0, 1.45, 1.95, 0, 0.012, 0.004));
    pg.push(rectFill(-0.3, 0.7, 0.55, 0.12, 0, 0.012, 0.002));
    const hash = (n: number) => {
      const s = Math.sin(n * 91.7 + p * 13.3) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let l = 0; l < 10; l++) {
      const y = 0.45 - l * 0.145;
      const len = 0.55 + hash(l) * 0.45;
      const x0 = -0.58;
      pg.push(segment(x0, y, x0 + len * 1.16, y, 0, 0.01, 0.004));
    }
    const s = transformed(composite(pg), 0, -0.09 + p * 0.045, 1, -0.55 + p * 0.275, 0, z);
    prims.push({ weight: 0.9 + (p === pages - 1 ? 0.5 : 0), sample: s });
  }
  return composite(prims);
});

const genieGen = simple(0.1, () => {
  const z = 0;
  const prims: Prim[] = [];
  // board
  prims.push(roundedRect(0, 0, 3.7, 2.1, 0.12, z, 0.03, 0.005));
  // core
  prims.push(rectFill(0, 0, 0.72, 0.72, z, 0.1, 0.004));
  prims.push(rectOutline(0, 0, 0.98, 0.98, z, 0.04, 0.004));
  // core pins
  for (let i = -3; i <= 3; i++) {
    const t = i * 0.13;
    prims.push(segment(t, 0.49, t, 0.62, z, 0.02, 0.003));
    prims.push(segment(t, -0.49, t, -0.62, z, 0.02, 0.003));
    prims.push(segment(0.49, t, 0.62, t, z, 0.02, 0.003));
    prims.push(segment(-0.49, t, -0.62, t, z, 0.02, 0.003));
  }
  // peripheral chips + traces
  const chips: [number, number, number, number][] = [
    [-1.35, 0.55, 0.62, 0.42],
    [-1.35, -0.55, 0.62, 0.42],
    [1.35, 0.55, 0.62, 0.42],
    [1.35, -0.55, 0.62, 0.42],
    [0, 0.88, 0.7, 0.18],
    [0, -0.88, 0.7, 0.18],
  ];
  for (const [cx, cy, w, h] of chips) {
    prims.push(rectOutline(cx, cy, w, h, z, 0.04, 0.004));
    prims.push(rectFill(cx, cy, w * 0.4, h * 0.4, z, 0.04, 0.003));
  }
  prims.push(polyline([[-1.04, 0.55], [-0.8, 0.55], [-0.8, 0.2], [-0.52, 0.2]], z, 0.02, 0.004));
  prims.push(polyline([[-1.04, -0.55], [-0.8, -0.55], [-0.8, -0.2], [-0.52, -0.2]], z, 0.02, 0.004));
  prims.push(polyline([[1.04, 0.55], [0.8, 0.55], [0.8, 0.2], [0.52, 0.2]], z, 0.02, 0.004));
  prims.push(polyline([[1.04, -0.55], [0.8, -0.55], [0.8, -0.2], [0.52, -0.2]], z, 0.02, 0.004));
  // mounting holes
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) prims.push(circleOutline(sx * 1.68, sy * 0.88, 0.07, z, 0.03, 0.003));
  return transformed(composite(prims), 0.28, 0, 0.98);
});

const mailmergeGen = simple(0.1, () => {
  const env = (z: number, scale: number, dx: number, dy: number): Prim => {
    const w = 2.6 * scale;
    const h = 1.65 * scale;
    const p: Prim[] = [
      rectOutline(0, 0, w, h, 0, 0.02, 0.005),
      polyline([[-w / 2, h / 2], [0, h * 0.02], [w / 2, h / 2]], 0, 0.02, 0.005),
      segment(-w / 2, -h / 2, -w * 0.12, -h * 0.05, 0, 0.02, 0.005),
      segment(w / 2, -h / 2, w * 0.12, -h * 0.05, 0, 0.02, 0.005),
    ];
    return {
      weight: 1,
      sample: transformed(composite(p), 0, 0, 1, dx, dy, z),
    };
  };
  return composite([
    env(-0.55, 0.9, -0.28, 0.2),
    env(-0.28, 0.95, -0.14, 0.1),
    { weight: 1.5, sample: env(0, 1, 0, 0).sample },
    { weight: 0.14, sample: (r, o) => { o[0] = 0.55 + (r() - 0.5) * 0.35; o[1] = -0.5 + (r() - 0.5) * 0.18; o[2] = 0.02; } },
  ]);
});

const fhonemanGen = simple(0.1, () => {
  const prims: Prim[] = [];
  const zf = 0.08;
  const zb = -0.08;
  prims.push(roundedRect(0, 0, 1.15, 2.35, 0.2, zf, 0.02, 0.004));
  prims.push(roundedRect(0, 0, 1.15, 2.35, 0.2, zb, 0.02, 0.004));
  prims.push(roundedRect(0, 0, 1.15, 2.35, 0.2, 0, 0.16, 0.004));
  prims.push(roundedRect(0, 0, 0.98, 2.18, 0.14, zf, 0.01, 0.003));
  prims.push(rectFill(0, 1.0, 0.3, 0.07, zf, 0.01, 0.002));
  prims.push(rectFill(0, -1.0, 0.36, 0.035, zf, 0.01, 0.002));
  // UI rows
  prims.push(rectFill(0, 0.62, 0.74, 0.26, zf, 0.01, 0.003));
  for (let i = 0; i < 4; i++) {
    prims.push(rectOutline(0, 0.22 - i * 0.28, 0.76, 0.2, zf, 0.01, 0.003));
    prims.push(circleOutline(-0.27, 0.22 - i * 0.28, 0.055, zf, 0.01, 0.002));
  }
  return transformed(composite(prims), -0.5, 0.1, 0.95, 0, 0, 0);
});

const leMansGen = simple(0.1, () => {
  // closed Catmull-Rom circuit
  const ctrl: [number, number][] = [
    [-1.7, 0.1], [-1.35, 0.75], [-0.5, 0.88], [0.15, 0.45], [0.7, 0.8], [1.5, 0.7],
    [1.85, 0.05], [1.4, -0.6], [0.7, -0.45], [0.2, -0.85], [-0.6, -0.8], [-1.3, -0.55],
  ];
  const pts: [number, number, number][] = [];
  const n = ctrl.length;
  const cr = (p0: number, p1: number, p2: number, p3: number, t: number) =>
    0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
  for (let i = 0; i < n; i++) {
    for (let s = 0; s < 24; s++) {
      const t = s / 24;
      const a = ctrl[(i - 1 + n) % n];
      const b = ctrl[i];
      const c = ctrl[(i + 1) % n];
      const d = ctrl[(i + 2) % n];
      pts.push([cr(a[0], b[0], c[0], d[0], t), cr(a[1], b[1], c[1], d[1], t), 0]);
    }
  }
  const offset = (d: number): [number, number][] =>
    pts.map((p, i) => {
      const q = pts[(i + 1) % pts.length];
      const pr = pts[(i - 1 + pts.length) % pts.length];
      let tx = q[0] - pr[0];
      let ty = q[1] - pr[1];
      const l = Math.hypot(tx, ty) || 1;
      tx /= l;
      ty /= l;
      return [p[0] - ty * d, p[1] + tx * d];
    });
  const line = (arr: [number, number][], th: number, soft: number): Prim => polyline(arr, 0, th, soft, true);
  const racing: Prim = line(pts.map((p) => [p[0], p[1]]), 0.04, 0.007);
  const inner = line(offset(-0.13), 0.03, 0.004);
  const outer = line(offset(0.13), 0.03, 0.004);
  const start = pts[3 * 0 + 0];
  void start;
  return transformed(
    composite([
      { weight: racing.weight * 2.4, sample: racing.sample },
      inner,
      outer,
      segment(-1.7 - 0.2, 0.1, -1.7 + 0.2, 0.1, 0, 0.04, 0.004),
      blob(0.15, 0.45, 0, 0.04, 0.04, 0.04, 0.25),
    ]),
    0,
    0,
    1,
  );
});

const arsensLabGen = simple(0.1, () => {
  const orbit = (tilt: number, roll: number, a = 1.75, b = 0.62): Prim => {
    return {
      weight: 2.4,
      sample: (r, o) => {
        const t = r() * Math.PI * 2;
        let x = Math.cos(t) * a + jit(r, 0.008);
        let y = Math.sin(t) * b + jit(r, 0.008);
        let z = jit(r, 0.008);
        // tilt about X
        const y1 = Math.cos(tilt) * y - Math.sin(tilt) * z;
        z = Math.sin(tilt) * y + Math.cos(tilt) * z;
        y = y1;
        const x1 = Math.cos(roll) * x - Math.sin(roll) * y;
        y = Math.sin(roll) * x + Math.cos(roll) * y;
        x = x1;
        o[0] = x;
        o[1] = y;
        o[2] = z;
      },
    };
  };
  const electron = (tilt: number, roll: number, t0: number, a = 1.75, b = 0.62): Prim => ({
    weight: 0.35,
    sample: (r, o) => {
      const t = t0 + jit(r, 0.06);
      let x = Math.cos(t) * a + jit(r, 0.035);
      let y = Math.sin(t) * b + jit(r, 0.035);
      let z = jit(r, 0.035);
      const y1 = Math.cos(tilt) * y - Math.sin(tilt) * z;
      z = Math.sin(tilt) * y + Math.cos(tilt) * z;
      y = y1;
      const x1 = Math.cos(roll) * x - Math.sin(roll) * y;
      y = Math.sin(roll) * x + Math.cos(roll) * y;
      x = x1;
      o[0] = x;
      o[1] = y;
      o[2] = z;
    },
  });
  return composite([
    blob(0, 0, 0, 0.13, 0.13, 0.13, 1.7),
    blob(0, 0, 0, 0.3, 0.3, 0.3, 0.5),
    orbit(0, 0.2),
    orbit(Math.PI / 3, 0.2),
    orbit(-Math.PI / 3, 0.2),
    electron(0, 0.2, 0.8),
    electron(Math.PI / 3, 0.2, 3.3),
    electron(-Math.PI / 3, 0.2, 5.4),
  ]);
});

const feedbackGen = simple(0.1, () => {
  const prims: Prim[] = [];
  const steps = 5;
  for (let i = 0; i < steps; i++) {
    const cx = -1.55 + i * 0.78;
    const cy = 0.88 - i * 0.43;
    prims.push(rectOutline(cx, cy, 0.62, 0.26, 0, 0.04, 0.004));
    prims.push(rectFill(cx - 0.1, cy, 0.3, 0.05, 0, 0.03, 0.002));
    if (i < steps - 1) {
      // falling stream to the next step
      const x = cx + 0.31;
      const nx = -1.55 + (i + 1) * 0.78 - 0.31;
      prims.push({
        weight: 0.75,
        sample: (r, o) => {
          const t = Math.pow(r(), 1.3);
          const fx = x + (nx - x) * (1 - Math.cos(t * Math.PI)) * 0.5;
          o[0] = fx + jit(r, 0.012 + t * 0.02);
          o[1] = cy - 0.02 - t * (0.43 - 0.04) + jit(r, 0.006);
          o[2] = jit(r, 0.03);
        },
      });
    }
  }
  // spray / pool at the last step
  prims.push(blob(1.85, -0.95, 0, 0.36, 0.06, 0.12, 0.35));
  return composite(prims);
});

/* --- portrait & text (async prep) ----------------------------------- */

type PointCloud2D = { pts: Float32Array; count: number };
let portraitCloud: PointCloud2D | null = null;
let portraitCdf: Float32Array | null = null;
let portraitMeta = { w: 1, h: 1 };
let portraitLum: Float32Array | null = null;

async function loadPortrait(): Promise<void> {
  if (portraitCdf) return;
  const img = new Image();
  img.decoding = 'async';
  img.src = '/profile.webp';
  await img.decode();
  const W = 240;
  const H = Math.round((W * img.naturalHeight) / img.naturalWidth);
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('no 2d ctx');
  ctx.drawImage(img, 0, 0, W, H);
  const d = ctx.getImageData(0, 0, W, H).data;
  const lum = new Float32Array(W * H);
  let lo = 1;
  let hi = 0;
  for (let i = 0; i < W * H; i++) {
    const l = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
    lum[i] = l;
    if (l < lo) lo = l;
    if (l > hi) hi = l;
  }
  const cdf = new Float32Array(W * H);
  let acc = 0;
  for (let i = 0; i < W * H; i++) {
    const x = (i % W) / W - 0.5;
    // contrast stretch, then favour the lit face; vignette the frame edges
    let l = (lum[i] - lo) / Math.max(0.001, hi - lo);
    l = Math.pow(l, 1.7);
    const edge = 1 - Math.min(1, Math.pow(Math.abs(x) * 2, 4)) * 0.6;
    lum[i] = l;
    acc += (0.012 + l) * edge;
    cdf[i] = acc;
  }
  for (let i = 0; i < cdf.length; i++) cdf[i] /= acc;
  portraitCdf = cdf;
  portraitLum = lum;
  portraitMeta = { w: W, h: H };
  portraitCloud = null;
}

const portraitGen: Gen = {
  dust: 0.06,
  prep: loadPortrait,
  build: () => {
    const { w: W, h: H } = portraitMeta;
    const cdf = portraitCdf as Float32Array;
    const lum = portraitLum as Float32Array;
    const height = 2.4;
    const width = height * (W / H);
    return (_k, r, o, f) => {
      const x = r();
      let lo = 0;
      let hi = cdf.length - 1;
      while (lo < hi) {
        const m = (lo + hi) >> 1;
        if (cdf[m] < x) lo = m + 1;
        else hi = m;
      }
      const px = lo % W;
      const py = Math.floor(lo / W);
      const l = lum[lo];
      o[0] = ((px + r()) / W - 0.5) * width;
      o[1] = (0.5 - (py + r()) / H) * height;
      o[2] = (l - 0.35) * 0.55 + jit(r, 0.02);
      f.w = 0;
    };
  },
};

function makeTextGen(text: string): Gen {
  let pts: Float32Array | null = null;
  let count = 0;
  let bw = 1;
  let bh = 1;
  return {
    dust: 0.08,
    prep: async () => {
      if (pts) return;
      try {
        await document.fonts.ready;
      } catch {
        /* ignore */
      }
      const family = getComputedStyle(document.body).fontFamily || 'sans-serif';
      const size = 280;
      const cv = document.createElement('canvas');
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('no 2d ctx');
      ctx.font = `800 ${size}px ${family}`;
      const lines = text.split('\n');
      const widths = lines.map((l) => ctx.measureText(l).width);
      const W = Math.ceil(Math.max(...widths)) + 40;
      const lh = Math.round(size * 1.05);
      const H = lh * lines.length + 40;
      cv.width = W;
      cv.height = H;
      ctx.font = `800 ${size}px ${family}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      lines.forEach((l, i) => ctx.fillText(l, W / 2, 20 + lh * (i + 0.5)));
      const d = ctx.getImageData(0, 0, W, H).data;
      const list: number[] = [];
      for (let y = 0; y < H; y += 1) {
        for (let x = 0; x < W; x += 1) {
          if (d[(y * W + x) * 4 + 3] > 128) list.push(x, y);
        }
      }
      pts = new Float32Array(list);
      count = list.length / 2;
      bw = W;
      bh = H;
    },
    build: () => {
      const P = pts as Float32Array;
      const maxW = 3.9;
      const maxH = 2.2;
      const sc = Math.min(maxW / bw, maxH / bh);
      return (_k, r, o, f) => {
        const i = Math.floor(r() * count) * 2;
        o[0] = (P[i] + r() - bw / 2) * sc;
        o[1] = (bh / 2 - P[i + 1] - r()) * sc;
        o[2] = jit(r, 0.06) + (r() - 0.5) * 0.1;
        f.w = 0;
      };
    },
  };
}

/* ------------------------------------------------------------------ */
/* public API                                                           */
/* ------------------------------------------------------------------ */

function genFor(id: ShapeId): Gen {
  if (id.startsWith('text:')) return makeTextGen(id.slice(5) || ' ');
  if (id.startsWith('project:')) {
    switch (id.slice(8)) {
      case 'barhunter':
        return barhunterGen;
      case 'casewise':
        return casewiseGen;
      case 'genie':
        return genieGen;
      case 'mailmerge':
        return mailmergeGen;
      case 'fhoneman':
        return fhonemanGen;
      case 'le-mans-t2':
        return leMansGen;
      case 'arsens-lab':
        return arsensLabGen;
      case 'feedback-cascade':
        return feedbackGen;
      default:
        return gridGen;
    }
  }
  switch (id) {
    case 'noise':
      return noiseGen;
    case 'clusters':
      return clustersGen;
    case 'pipeline':
      return pipelineGen;
    case 'bridge':
      return bridgeGen;
    case 'grid':
      return gridGen;
    case 'portrait':
      return portraitGen;
    case 'sphere':
    default:
      return sphereGen;
  }
}

const cache = new Map<string, Float32Array>();
const inflight = new Map<string, Promise<Float32Array>>();
const CACHE_MAX = 7;

const tick = () => new Promise<void>((res) => setTimeout(res, 0));

async function generate(id: ShapeId, count: number): Promise<Float32Array> {
  const gen = genFor(id);
  if (gen.prep) await gen.prep();
  const rng = mulberry32(hashString(id));
  const nDust = Math.floor(count * gen.dust);
  const nShape = count - nDust;
  const point = gen.build(rng, nShape);
  const out = new Float32Array(count * 4);
  const o: V3 = [0, 0, 0];
  const flag = { w: 0 };
  let i = 0;
  while (i < count) {
    const t0 = performance.now();
    while (i < count) {
      const end = Math.min(count, i + 512);
      for (; i < end; i++) {
        const b = i * 4;
        if (i < nShape) {
          point(i, rng, o, flag);
          out[b] = o[0];
          out[b + 1] = o[1];
          out[b + 2] = o[2];
          out[b + 3] = flag.w;
        } else {
          // ambient dust: a sparse ellipsoidal haze around the shape
          const th = rng() * Math.PI * 2;
          const ph = Math.acos(2 * rng() - 1);
          const R = 0.35 + Math.pow(rng(), 0.7) * 1.0;
          out[b] = Math.sin(ph) * Math.cos(th) * R * 2.6;
          out[b + 1] = Math.cos(ph) * R * 1.55;
          out[b + 2] = Math.sin(ph) * Math.sin(th) * R * 1.3;
          out[b + 3] = 4;
        }
      }
      if (performance.now() - t0 > 6) break;
    }
    if (i < count) await tick();
  }
  return out;
}

/** Lazily generate (and cache) the target data for a shape. */
export function getShapeData(id: ShapeId, count: number): Promise<Float32Array> {
  const key = `${count}|${id}`;
  const hit = cache.get(key);
  if (hit) {
    cache.delete(key);
    cache.set(key, hit); // LRU touch
    return Promise.resolve(hit);
  }
  const pending = inflight.get(key);
  if (pending) return pending;
  const p = generate(id, count)
    .then((data) => {
      cache.set(key, data);
      while (cache.size > CACHE_MAX) {
        const first = cache.keys().next().value as string;
        cache.delete(first);
      }
      inflight.delete(key);
      return data;
    })
    .catch((err) => {
      inflight.delete(key);
      throw err;
    });
  inflight.set(key, p);
  return p;
}

export function clearShapeCache(): void {
  cache.clear();
  inflight.clear();
}

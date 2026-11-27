import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { resolveLayout } from '@/lib/canvas/layout';
import { getShapeData } from '@/lib/canvas/shapes';
import { pointFragment, pointVertex, positionShader, velocityShader } from '@/lib/gpu/shaders';
import { FpsWatchdog, TIER_CONFIG } from '@/lib/gpu/tier';
import { useScene, type ShapeId } from '@/lib/store/scene';

export type EngineOptions = {
  canvas: HTMLCanvasElement;
  tier: 'high' | 'mid';
  /** True when the tier came from ?tier= (testing): the FPS watchdog is off. */
  forced: boolean;
  onFail: (err: unknown) => void;
  onSlow: () => void;
};

export type Engine = { dispose: () => void };

const CAM_Z = 6;
const FOV = 35;
const MORPH_DURATION = 2.2;
const MORPH_SPREAD = 0.55;
const TRAIL = 8;

const damp = (cur: number, target: number, rate: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-rate * dt));

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function readColor(name: string, fallback: string): THREE.Color {
  const c = new THREE.Color();
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    c.setStyle(v || fallback);
  } catch {
    c.setStyle(fallback);
  }
  return c;
}

function readBackground(): THREE.Color {
  const c = new THREE.Color();
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--canvas').trim();
    c.setStyle(v || '#08080a');
  } catch {
    c.setStyle('#08080a');
  }
  return c;
}

export async function createEngine(opts: EngineOptions): Promise<Engine> {
  let renderer: THREE.WebGLRenderer | null = null;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: opts.canvas,
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    return await build(opts, renderer);
  } catch (e) {
    try {
      renderer?.dispose();
      renderer?.forceContextLoss();
    } catch {
      /* ignore */
    }
    throw e;
  }
}

async function build(opts: EngineOptions, renderer: THREE.WebGLRenderer): Promise<Engine> {
  const { canvas, tier, forced } = opts;
  const cfg = TIER_CONFIG[tier];
  const W = cfg.width;
  const H = cfg.height;
  const total = W * H;
  const dpr = Math.min(window.devicePixelRatio || 1, cfg.maxDpr);

  let disposed = false;
  let raf = 0;

  renderer.setPixelRatio(dpr);

  const onContextLost = (e: Event) => {
    e.preventDefault();
    if (!disposed) opts.onFail(new Error('webgl context lost'));
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
  camera.position.set(0, 0, CAM_Z);

  /* ---------------- GPGPU ---------------- */
  const gpu = new GPUComputationRenderer(W, H, renderer);
  const floatOk = renderer.capabilities.isWebGL2 && renderer.extensions.has('EXT_color_buffer_float');
  if (!floatOk) gpu.setDataType(THREE.HalfFloatType);

  const dtPos = gpu.createTexture();
  const dtVel = gpu.createTexture();
  {
    const rng = mulberry32(7);
    const a = dtPos.image.data as Float32Array;
    for (let i = 0; i < total; i++) {
      const g = () => (rng() + rng() + rng() - 1.5) * 2;
      a[i * 4] = g() * 1.6;
      a[i * 4 + 1] = g() * 1.0;
      a[i * 4 + 2] = g() * 0.8;
      a[i * 4 + 3] = 0;
    }
  }

  // static per-particle randoms (delay, size, alpha, signal)
  const auxData = new Float32Array(total * 4);
  {
    const rng = mulberry32(1337);
    for (let i = 0; i < total * 4; i++) auxData[i] = rng();
  }
  const auxTex = new THREE.DataTexture(auxData, W, H, THREE.RGBAFormat, THREE.FloatType);
  auxTex.minFilter = auxTex.magFilter = THREE.NearestFilter;
  auxTex.needsUpdate = true;

  const makeTex = (data: Float32Array) => {
    const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat, THREE.FloatType);
    t.minFilter = t.magFilter = THREE.NearestFilter;
    t.needsUpdate = true;
    return t;
  };

  const velVar = gpu.addVariable('textureVelocity', velocityShader, dtVel);
  const posVar = gpu.addVariable('texturePosition', positionShader, dtPos);
  gpu.setVariableDependencies(velVar, [posVar, velVar]);
  gpu.setVariableDependencies(posVar, [posVar, velVar]);

  const trail: THREE.Vector4[] = Array.from({ length: TRAIL }, () => new THREE.Vector4(0, 0, 0, 0.4));

  const shared = {
    tA: { value: null as THREE.Texture | null },
    tB: { value: null as THREE.Texture | null },
    tAux: { value: auxTex },
    uTime: { value: 0 },
    uMix: { value: 1 },
    uSpread: { value: MORPH_SPREAD },
    uDelta: { value: 0.016 },
  };
  const vu = velVar.material.uniforms;
  const pu = posVar.material.uniforms;
  for (const k of Object.keys(shared) as (keyof typeof shared)[]) {
    vu[k] = shared[k];
    pu[k] = shared[k];
  }
  vu.uTurb = { value: 0.25 };
  vu.uScrollV = { value: 0 };
  vu.uTrail = { value: trail };

  const err = gpu.init();
  if (err) throw new Error(err);

  /* ---------------- initial shape ---------------- */
  let currentShape: ShapeId = 'sphere';
  let wantedShape: ShapeId | null = null;
  const initialIntent = useScene.getState();
  currentShape = initialIntent.hoveredProject ? (`project:${initialIntent.hoveredProject}` as ShapeId) : initialIntent.shape;
  const initialData = await getShapeData(currentShape, total);
  let texA = makeTex(initialData);
  let texB = texA;
  shared.tA.value = texA;
  shared.tB.value = texB;
  wantedShape = currentShape;

  /* ---------------- points ---------------- */
  const geo = new THREE.BufferGeometry();
  const refs = new Float32Array(cfg.count * 2);
  const rands = new Float32Array(cfg.count * 4);
  for (let i = 0; i < cfg.count; i++) {
    refs[i * 2] = ((i % W) + 0.5) / W;
    refs[i * 2 + 1] = (Math.floor(i / W) + 0.5) / H;
    rands[i * 4] = auxData[i * 4];
    rands[i * 4 + 1] = auxData[i * 4 + 1];
    rands[i * 4 + 2] = auxData[i * 4 + 2];
    rands[i * 4 + 3] = auxData[i * 4 + 3];
  }
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(cfg.count * 3), 3));
  geo.setAttribute('aRef', new THREE.BufferAttribute(refs, 2));
  geo.setAttribute('aRand', new THREE.BufferAttribute(rands, 4));
  geo.setDrawRange(0, cfg.count);

  const mat = new THREE.ShaderMaterial({
    vertexShader: pointVertex,
    fragmentShader: pointFragment,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uPos: { value: null as THREE.Texture | null },
      uVel: { value: null as THREE.Texture | null },
      uOffset: { value: new THREE.Vector3() },
      uScale: { value: 1 },
      uRot: { value: new THREE.Vector2() },
      uPixel: { value: dpr },
      uSignal: { value: 0.15 },
      uIntensity: { value: 0.7 },
      uStretch: { value: 0 },
      uCam: { value: CAM_Z },
      uDark: { value: 1 },
      uBone: { value: new THREE.Color('#edeae3') },
      uAccent: { value: new THREE.Color('#ff5a1f') },
      uHot: { value: new THREE.Color('#ffffff') },
      uSigBoost: { value: 1 },
    },
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  /* ---------------- post (high tier) ---------------- */
  type Composer = { render: (dt: number) => void; setSize: (w: number, h: number, u?: boolean) => void; dispose: () => void };
  let composer: Composer | null = null;
  let bloomEffect: { intensity: number } | null = null;
  if (cfg.post) {
    try {
      const pp = await import('postprocessing');
          const c = new pp.EffectComposer(renderer, { frameBufferType: THREE.HalfFloatType, multisampling: 0, depthBuffer: false });
      c.addPass(new pp.RenderPass(scene, camera));
      const bloom = new pp.BloomEffect({
        intensity: 0.85,
        luminanceThreshold: 0.5,
        luminanceSmoothing: 0.25,
        mipmapBlur: true,
        radius: 0.72,
        levels: 6,
      });
      c.addPass(new pp.EffectPass(camera, bloom));
      composer = c as unknown as Composer;
      bloomEffect = bloom as unknown as { intensity: number };
    } catch {
      composer = null; // bloom is a nicety; fall back to a plain render
    }
  }

  /* ---------------- theme ---------------- */
  let isDark = true;
  const bg = new THREE.Color();
  const applyTheme = () => {
    isDark = document.documentElement.classList.contains('dark');
    const bone = readColor('--text-primary', isDark ? '#edeae3' : '#0e0e10');
    const accent = readColor('--accent', isDark ? '#ff5a1f' : '#c93a0a');
    const u = mat.uniforms;
    (u.uBone.value as THREE.Color).copy(bone);
    (u.uAccent.value as THREE.Color).copy(accent);
    (u.uHot.value as THREE.Color).set(isDark ? '#ffffff' : '#000000');
    u.uDark.value = isDark ? 1 : 0;
    u.uSigBoost.value = isDark ? (composer ? 1.6 : 1.15) : 1.0;
    mat.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
    bg.copy(readBackground());
    renderer.setClearColor(bg, 1);
    if (bloomEffect) bloomEffect.intensity = isDark ? 0.85 : 0;
  };
  applyTheme();
  let themeTimers: number[] = [];
  const mo = new MutationObserver(() => {
    themeTimers.forEach(window.clearTimeout);
    // CSS variables may transition; re-read a couple of times as they settle
    themeTimers = [0, 120, 500].map((d) => window.setTimeout(applyTheme, d));
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

  /* ---------------- size ---------------- */
  let viewW = 1;
  let viewH = 1;
  let cssW = 1;
  const viewHeightWorld = 2 * CAM_Z * Math.tan((FOV * Math.PI) / 360);
  const resize = () => {
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    cssW = w;
    renderer.setSize(w, h, false);
    composer?.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    viewH = viewHeightWorld;
    viewW = viewH * camera.aspect;
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  /* ---------------- pointer ---------------- */
  const ptr = { x: 0, y: 0, nx: 0, ny: 0, moved: false, lastX: 0, lastY: 0, lastT: 0 };
  const onMove = (e: PointerEvent) => {
    ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
    ptr.y = -((e.clientY / window.innerHeight) * 2 - 1);
    ptr.moved = true;
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  let trailIdx = 0;

  /* ---------------- animated state ---------------- */
  const cur = { x: 0, y: 0, scale: 1, signal: 0.15, intensity: 0.7, turb: 0.25, fade: 1, scrollV: 0, rotY: 0, camX: 0, camY: 0 };
  let first = true;
  let time = 0;
  let morph = 1;
  let last = performance.now();

  const watchdog = forced ? null : new FpsWatchdog(() => opts.onSlow());

  const requestShape = (id: ShapeId) => {
    getShapeData(id, total)
      .then((data) => {
        if (disposed || wantedShape !== id) return;
        const old = texA;
        texA = texB;
        texB = makeTex(data);
        if (old !== texA) old.dispose();
        shared.tA.value = texA;
        shared.tB.value = texB;
        currentShape = id;
        morph = 0;
      })
      .catch(() => {
        if (!disposed && wantedShape === id) currentShape = id; // give up quietly; keep the old formation
      });
  };

  const loop = (now: number) => {
    if (disposed) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(Math.max((now - last) / 1000, 0.001), 1 / 20);
    last = now;
    time += dt;
    watchdog?.tick(now);

    const s = useScene.getState();
    const hovered = s.hoveredProject;
    const shape: ShapeId = hovered ? (`project:${hovered}` as ShapeId) : s.shape;
    const layout = hovered ? 'right' : s.layout;
    const signal = hovered ? 0.6 : s.signal;
    const intensity = s.intensity;
    const turb = s.turbulence;

    if (shape !== wantedShape) {
      wantedShape = shape;
      if (shape !== currentShape) requestShape(shape);
      else if (morph >= 1) {
        // returned to the displayed shape before any swap: nothing to do
      }
    }

    const L = resolveLayout(layout, viewW, viewH, cssW);
    const k = first ? 1000 : 1;
    cur.x = damp(cur.x, L.x, 2.6 * k, dt);
    cur.y = damp(cur.y, L.y, 2.6 * k, dt);
    cur.scale = damp(cur.scale, L.scale, 2.6 * k, dt);
    cur.fade = damp(cur.fade, L.fade, 2.6 * k, dt);
    cur.signal = damp(cur.signal, signal, 2.4 * k, dt);
    cur.intensity = damp(cur.intensity, intensity, 2.4 * k, dt);
    cur.turb = damp(cur.turb, turb, 2.4 * k, dt);
    const sv = Math.max(-1, Math.min(1, s.velocity / 60));
    cur.scrollV = damp(cur.scrollV, sv, 5, dt);

    // pointer (smoothed for parallax) and cursor trail in local space
    cur.camX = damp(cur.camX, ptr.x, 1.6, dt);
    cur.camY = damp(cur.camY, ptr.y, 1.6, dt);
    if (ptr.moved) {
      ptr.moved = false;
      const dx = ptr.x - ptr.lastX;
      const dy = ptr.y - ptr.lastY;
      const dist = Math.hypot(dx * viewW, dy * viewH) / 2;
      if (dist > 0.02 || now - ptr.lastT > 45) {
        const speed = Math.min(1, dist / Math.max(dt, 0.008) / 6);
        trailIdx = (trailIdx + 1) % TRAIL;
        const t = trail[trailIdx];
        t.x = (ptr.x * viewW * 0.5 - cur.x) / cur.scale;
        t.y = (ptr.y * viewH * 0.5 - cur.y) / cur.scale;
        t.z = 0.35 + 0.65 * speed;
        t.w = 0.5 / cur.scale;
        ptr.lastX = ptr.x;
        ptr.lastY = ptr.y;
        ptr.lastT = now;
      }
    }
    const decay = Math.exp(-dt * 2.6);
    for (const t of trail) t.z = t.z < 0.002 ? 0 : t.z * decay;

    camera.position.set(cur.camX * 0.22, cur.camY * 0.12, CAM_Z);
    camera.lookAt(0, 0, 0);

    morph = Math.min(1, morph + dt / MORPH_DURATION);
    shared.uTime.value = time;
    shared.uMix.value = morph;
    shared.uDelta.value = dt;
    vu.uTurb.value = cur.turb;
    vu.uScrollV.value = cur.scrollV;

    gpu.compute();

    const u = mat.uniforms;
    u.uPos.value = gpu.getCurrentRenderTarget(posVar).texture;
    u.uVel.value = gpu.getCurrentRenderTarget(velVar).texture;
    (u.uOffset.value as THREE.Vector3).set(cur.x, cur.y, 0);
    u.uScale.value = cur.scale;
    (u.uRot.value as THREE.Vector2).set(Math.sin(time * 0.09) * 0.04 - cur.camY * 0.05, Math.sin(time * 0.12) * 0.16 + cur.camX * 0.1);
    u.uSignal.value = cur.signal;
    u.uIntensity.value = cur.intensity * cur.fade * (isDark ? 1.0 : 1.5);
    u.uStretch.value = Math.abs(cur.scrollV) * 0.12;

    if (composer) composer.render(dt);
    else renderer.render(scene, camera);

    if (first) {
      first = false;
      useScene.getState().setReady(true);
    }
  };

  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf && !disposed) {
      last = performance.now();
      watchdog?.reset();
      raf = requestAnimationFrame(loop);
    }
  };
  document.addEventListener('visibilitychange', onVisibility);
  if (!document.hidden) raf = requestAnimationFrame(loop);

  return {
    dispose: () => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      themeTimers.forEach(window.clearTimeout);
      mo.disconnect();
      ro.disconnect();
      useScene.getState().setReady(false);
      scene.remove(points);
      geo.dispose();
      mat.dispose();
      texA.dispose();
      if (texB !== texA) texB.dispose();
      auxTex.dispose();
      try {
        gpu.dispose();
      } catch {
        /* ignore */
      }
      composer?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

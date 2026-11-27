/**
 * GLSL for the GPGPU simulation and the point renderer.
 * Simulation space is "local" (shape space); layout/scale are applied in the
 * render vertex shader.
 */

const common = /* glsl */ `
uniform sampler2D tA;
uniform sampler2D tB;
uniform sampler2D tAux;
uniform float uTime;
uniform float uMix;
uniform float uSpread;

vec3 curvePos(float u) {
  return vec3((u - 0.5) * 4.2, 0.4 * sin(u * 6.28318 + 0.3), 0.3 * sin(u * 3.14159 + 1.0));
}

// target decode: returns local position; dust/flow flags via out params
vec3 evalTgt(vec4 t, out float dust, out float flow) {
  dust = step(3.5, t.w);
  float wb = t.w - 4.0 * dust;
  flow = step(1.5, wb);
  float breathF = step(0.5, wb) * (1.0 - flow);
  vec3 p = t.xyz;
  if (flow > 0.5) {
    float u0 = t.x;
    float sp = 0.026 + 0.03 * fract(u0 * 437.13 + 0.31);
    float u = fract(u0 + uTime * sp);
    float taper = smoothstep(0.0, 0.1, u) * smoothstep(1.0, 0.9, u);
    float pinch = 1.0;
    pinch -= 0.5 * exp(-pow((u - 0.22) / 0.035, 2.0));
    pinch -= 0.5 * exp(-pow((u - 0.50) / 0.035, 2.0));
    pinch -= 0.5 * exp(-pow((u - 0.78) / 0.035, 2.0));
    float r = t.z * taper * pinch;
    vec3 P = curvePos(u);
    vec3 T = normalize(curvePos(u + 0.01) - curvePos(u - 0.01));
    vec3 N = normalize(cross(T, vec3(0.0, 0.0, 1.0)));
    vec3 B = cross(T, N);
    p = P + r * (cos(t.y) * N + 0.65 * sin(t.y) * B);
  }
  p *= 1.0 + breathF * 0.028 * sin(uTime * 0.8 + dot(normalize(p + 1e-4), vec3(0.6, 0.3, 0.7)) * 2.4);
  return p;
}

struct Morph { vec3 tgt; float dust; float t; float flowB; };

Morph morphAt(vec2 uv, vec4 aux) {
  Morph m;
  vec4 a = texture2D(tA, uv);
  vec4 b = texture2D(tB, uv);
  float t = clamp(uMix * (1.0 + uSpread) - aux.x * uSpread, 0.0, 1.0);
  float e = t * t * (3.0 - 2.0 * t);
  float da; float fa; float db; float fb;
  vec3 pa = evalTgt(a, da, fa);
  vec3 pb = evalTgt(b, db, fb);
  m.tgt = mix(pa, pb, e);
  m.dust = mix(da, db, e);
  m.t = t;
  m.flowB = fb;
  return m;
}
`;

export const velocityShader = /* glsl */ `
${common}
uniform float uDelta;
uniform float uTurb;
uniform float uScrollV;
uniform vec4 uTrail[8];

vec2 comp(float u, float v, float t, float ph) {
  float a = 1.4; float b = 2.9;
  float s1 = sin(a * u + t * 0.37 + ph);
  float c1 = cos(a * u + t * 0.37 + ph);
  float s2 = sin(a * 0.9 * v - t * 0.29 + ph * 1.7);
  float c2 = cos(a * 0.9 * v - t * 0.29 + ph * 1.7);
  float c3 = cos(b * u + b * 0.8 * v + t * 0.5 + ph * 2.3);
  return vec2(a * c1 * c2 + 0.5 * b * c3, -s1 * a * 0.9 * s2 + 0.5 * b * 0.8 * c3);
}

vec3 curl(vec3 p, float t) {
  vec2 dx = comp(p.y, p.z, t, 0.0);
  vec2 dy = comp(p.z, p.x, t, 2.1);
  vec2 dz = comp(p.x, p.y, t, 4.2);
  return vec3(dz.y - dy.x, dx.y - dz.x, dy.y - dx.x);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 pd = texture2D(texturePosition, uv);
  vec3 p = pd.xyz;
  vec3 v = texture2D(textureVelocity, uv).xyz;
  vec4 aux = texture2D(tAux, uv);

  Morph m = morphAt(uv, aux);

  const float K = 14.0;
  const float C = 5.2;

  vec3 acc = (m.tgt - p) * K;

  // organic swirl while morphing
  float act = sin(3.14159 * m.t);
  acc += curl(p * 0.8, uTime * 0.7) * act * 7.0;

  // ambient curl noise, scaled by turbulence and scroll velocity
  float sv = abs(uScrollV);
  float amp = (0.5 + uTurb * 5.5 + sv * 4.0) * (0.55 + 0.9 * aux.y);
  acc += curl(p * 1.15, uTime * 0.55) * amp;
  acc.y += uScrollV * 5.0 * (aux.z - 0.35);

  // cursor repulsion (decaying trail, in local space)
  for (int i = 0; i < 8; i++) {
    vec4 tr = uTrail[i];
    if (tr.z > 0.002) {
      vec3 d = vec3(p.xy - tr.xy, (p.z) * 0.6);
      float R = tr.w;
      float q = dot(d, d) / (R * R);
      float f = tr.z * exp(-q * 1.6);
      vec2 dir = normalize(d.xy + vec2(1e-4, 0.0));
      vec2 perp = vec2(-dir.y, dir.x);
      acc.xy += (dir * 1.0 + perp * (aux.w - 0.5) * 1.2) * f * 46.0;
      acc.z += f * (aux.z - 0.5) * 20.0;
    }
  }

  v += acc * uDelta;
  v *= exp(-C * uDelta);
  float sp = length(v);
  if (sp > 10.0) v *= 10.0 / sp;

  // wrap-around of the flowing ribbon: snap instead of flying back across
  if (uMix > 0.999 && m.flowB > 0.5 && length(m.tgt - p) > 1.1) v = vec3(0.0);

  gl_FragColor = vec4(v, 1.0);
}
`;

export const positionShader = /* glsl */ `
${common}
uniform float uDelta;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 pd = texture2D(texturePosition, uv);
  vec3 v = texture2D(textureVelocity, uv).xyz;
  vec4 aux = texture2D(tAux, uv);
  Morph m = morphAt(uv, aux);
  vec3 np = pd.xyz + v * uDelta;
  if (uMix > 0.999 && m.flowB > 0.5 && length(m.tgt - pd.xyz) > 1.1) np = m.tgt;
  gl_FragColor = vec4(np, m.dust);
}
`;

export const pointVertex = /* glsl */ `
attribute vec2 aRef;
attribute vec4 aRand;

uniform sampler2D uPos;
uniform sampler2D uVel;
uniform vec3 uOffset;
uniform float uScale;
uniform vec2 uRot;
uniform float uPixel;
uniform float uSignal;
uniform float uIntensity;
uniform float uStretch;
uniform float uCam;
uniform float uDark;

varying float vAlpha;
varying float vSig;
varying float vSpeed;

void main() {
  vec4 pd = texture2D(uPos, aRef);
  vec3 vel = texture2D(uVel, aRef).xyz;
  vec3 p = pd.xyz;
  float dust = pd.w;

  p.y *= 1.0 + uStretch;
  float cy = cos(uRot.y); float sy = sin(uRot.y);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  float cx = cos(uRot.x); float sx = sin(uRot.x);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  p = p * uScale + uOffset;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float dist = -mv.z;
  float depthT = clamp((dist - (uCam - 2.4 * uScale)) / (4.8 * uScale), 0.0, 1.0);
  float speed = length(vel);
  float sig = 1.0 - smoothstep(uSignal - 0.004, uSignal, aRand.w);

  float size = mix(1.0, 2.4, pow(aRand.y, 2.6));
  size *= 1.0 + sig * 0.55;
  size *= 1.0 - dust * 0.3;
  size *= 1.0 + min(speed * 0.08, 0.5);
  float persp = clamp(uCam / dist, 0.65, 1.5);
  gl_PointSize = max(1.0, size * uPixel * persp);

  float a = mix(0.2, 0.72, aRand.z);
  a *= mix(1.0, 0.22, depthT);
  a *= 1.0 - dust * 0.72;
  a *= 1.0 + min(speed * 0.35, 1.4);
  a *= 1.0 + sig * 0.55;
  vAlpha = a * uIntensity;
  vSig = sig;
  vSpeed = min(speed * 0.25, 1.0);
}
`;

export const pointFragment = /* glsl */ `
uniform vec3 uBone;
uniform vec3 uAccent;
uniform vec3 uHot;
uniform float uSigBoost;

varying float vAlpha;
varying float vSig;
varying float vSpeed;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c) * 4.0;
  if (d2 > 1.0) discard;
  float core = exp(-d2 * 3.2);
  float halo = exp(-d2 * 1.1) * 0.35;
  float a = mix(core, core + halo, vSig);
  vec3 col = mix(uBone, uAccent * uSigBoost, vSig);
  col = mix(col, uHot, vSpeed * 0.55);
  gl_FragColor = vec4(col, clamp(a * vAlpha, 0.0, 1.0));
  #include <colorspace_fragment>
}
`;

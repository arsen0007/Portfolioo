# tousifali.com: Design Upgrade Plan

**Codename: SIGNAL.** A portfolio that shows the one thing Tousif does, which is turn manual chaos into a running system, instead of just saying it.

---

## 0. The honest verdict on the current site

The content is strong: real numbers, real adoption, a clear thesis. The design isn't doing any of the work.

| Problem | Why it hurts |
|---|---|
| **No signature moment.** Typography on a beige page. | Nothing someone would screenshot or show a friend. It's forgotten 10 seconds after closing the tab. |
| **Every section has the same rhythm.** Eyebrow, serif H2, ruled list, repeat. | No pacing, no tension or release. Scrolling feels like reading a well-formatted document. |
| **The motion is all fades.** One `reveal-up`, one bar grow. | It reads as a template. For an *AI systems builder* that's a missed proof of craft. |
| **The numbers sit in plain text.** 433, 94,363 and 2,700 are just digits on a page. | These are the best assets you have, and they aren't staged at all. |
| **The serif and beige look says "writer" or "consultant."** | It doesn't say "builds systems." The visual identity contradicts the positioning. |

**What we keep:** the content model (`lib/data/*`), the case study structure, accessibility (skip link, focus rings, reduced motion), static output, SEO, OG images. Agency sites usually lose points here, and yours shouldn't.

---

## 1. What the best studios actually do (research)

| Studio | Known for | What we steal |
|---|---|---|
| **Lusion** (UK, 58 Awwwards incl. Site of the Year) | Real-time 3D storytelling. They pre-bake physics in Houdini and blend it at runtime. *"You don't need to do everything real-time."* | Bake what you can. Fake expensive simulation with textures. One visual idea carried all the way through. |
| **Immersive Garden** (Paris, Site of the Month Jan 2025) | A plaster wall where reliefs rise under the cursor. A **flowmap** (256² ping-pong render target, decay 0.953/frame) drives the effect. "Fast-scroll mode" collapses the long page into an index. One full-screen three.js canvas; DOM placeholders position WebGL planes; a compositing shader handles page transitions. | The cursor-trail flowmap technique, the single persistent canvas, DOM-tracked WebGL planes, and the fast-scroll index. |
| **Abeto** (Site of the Year 2024 *Igloo Inc*, 2025 *Messenger*) | Prototype in grey "previs" first, then iterate shaders live in the browser. Procedural assets, an **interactive particle footer** that morphs between shapes, chromatic-aberration transitions, text scramble. | Particles that morph between meaningful shapes, text scramble on labels, and measuring performance continuously instead of at the end. |
| **Active Theory** | Several environments with cinematic transitions between scenes. *"The site houses the portfolio and becomes part of the portfolio."* | The site itself is a case study, so we add a small "How this site was built" page. |
| **Locomotive** (Montreal) | Editorial precision: lerped smooth scroll, split-text headline reveals (`y:110%`, `expo.out`, stagger 0.08), subtle parallax, magnetic cursor. | The typography motion grammar. |
| **Darkroom Engineering** (makers of Lenis, Satus) | One root `<Canvas>` that pages portal into. WebGL loads only on capable devices. Lenis runs on **native** scroll, so sticky positioning, anchors and accessibility still work. | The architecture, nearly verbatim. |
| **OFF+BRAND**, *Lando Norris* (Site of the Year 2025) | A personality-driven personal brand with bold type, motion everywhere, and the person at the centre. | Proof that a *personal* site can win at the top level. |

**Pattern across all of them:**
1. **One big idea**, expressed in WebGL, that *is* the brand. Not a pile of effects.
2. **Typography is the second star.** Huge, kinetic, set tightly.
3. **A single persistent canvas**, with seamless transitions between pages.
4. **Baked plus procedural assets** to stay fast.
5. **Scroll is the timeline.** Every section is a scene with a beginning, middle and end.

**Where they fail (and where we win):** Immersive Garden's site can't be navigated by keyboard and ignores reduced motion. Awwwards scores Design 40%, **Usability 30%**, Creativity 20%, Content 10%. Your audience is hiring managers and founders. **We build at award level *and* keep it fully usable.**

---

## 2. The creative concept: SIGNAL FROM NOISE

> Your whole story is one transformation: **a messy manual queue becomes a clean, running system.** 2,700 cases a month, hand-sorted into 31 categories. Leads copied by hand from 5 bar registries. A Raspberry Pi running 14 services.

So the site's signature is **a living particle field that starts as noise and organizes itself into systems as you scroll.**

- **Every particle means something.** On desktop the hero renders **94,363 particles, one per BarHunter lead.** A tiny caption says so. It's honest, specific and memorable, the same way your copy already is.
- **Scroll tells the story:** chaos, then classification into clusters, then a pipeline (flow), then structure (your name and the work).
- **The cursor is a disturbance.** Move it and particles scatter like an un-sorted queue, then snap back into order. Interacting is the thesis, felt rather than read.

**Brand line:** *"I turn work people do by hand into systems that run themselves."*

---

## 3. Art direction

### 3.1 Colour: dark-first and cinematic
Dark becomes the hero theme because particles and glow need black. Light mode stays as a fully designed "paper" variant, not an afterthought.

| Token | Dark (primary) | Light ("paper") | Use |
|---|---|---|---|
| `--ink` | `#08080A` | `#F2EFE9` | Canvas |
| `--ink-2` | `#111114` | `#E8E4DC` | Raised surfaces |
| `--bone` | `#EDE9E1` | `#0E0E10` | Primary text |
| `--fog` | `#8C8A86` | `#5A5853` | Secondary text (AA checked) |
| `--line` | `#ffffff14` | `#0000001a` | Hairlines |
| `--signal` | `#FF4D1A` | `#D93A0B` | **The one accent.** Particles that have "become system," CTAs, live dots |
| `--signal-glow` | `#FF8A5B` | n/a | Bloom tint only |

Rule: **orange means "this is now a system."** Noise particles are bone at 30% opacity. Organized ones turn `--signal`. The colour carries the story.

### 3.2 Typography: from serif-writer to systems-builder
| Role | Font (free) | Notes |
|---|---|---|
| Display | **Geist** (or *Inter Display*) at 500–600, tracking −0.04em | Huge: `clamp(3.5rem, 12vw, 14rem)` for hero words |
| Editorial accent | **Instrument Serif Italic** | One or two words per headline, italic. *"I build systems for work I used to do **by hand**."* Keeps the human warmth. |
| Data / labels | **Geist Mono**, uppercase, +0.08em | Eyebrows, indices (`01 / 08`), metrics, timestamps, live status |

Numbers are always set in display at full size, with a counter animation and tabular figures.

### 3.3 Grid and texture
- A 12-column grid with a visible **hairline grid overlay** on the hero, like a blueprint, fading out as you scroll.
- A subtle **film grain** shader pass at 4% to remove the "flat web" look.
- **Index numbers** everywhere (`01`, `02` …) in mono, for an engineering-log feel.
- **Live indicators:** a pulsing signal dot plus "LIVE · in production" on projects that are running.

---

## 4. Signature 3D: the particle engine

### 4.1 Tech
- **GPGPU particles** with `GPUComputationRenderer` (three/examples). Positions and velocities live in float textures; a 308×308 texture is about 94.8k slots, and we draw exactly **94,363**.
- **Target shapes are baked to textures** at build time with a Node script that samples points from SVG/GLB:
  1. `noise`: curl-noise cloud (the queue)
  2. `clusters`: **31 clusters** (the legal taxonomy CaseWise classifies into)
  3. `pipeline`: a flowing ribbon through 3 gates (classify, summarize, outreach)
  4. `wordmark`: "TOUSIF ALI" or the TA monogram
  5. Per-project shapes for the work index: a map of 5 jurisdictions (BarHunter), a Pi board silhouette (Genie), an envelope (MailMerge), a race-car line (Le Mans) and so on
- The shader morphs `mix(shapeA, shapeB, progress)` plus curl noise plus a spring, so transitions feel organic rather than linear.
- **Cursor flowmap** (Immersive Garden technique): a 256² ping-pong render target with frame-rate-independent decay that pushes particles away, then a spring pulls them home.
- **Post-processing:** a subtle bloom on signal particles, grain, and a light chromatic aberration *only* during transitions (Abeto).

### 4.2 Device tiers (non-negotiable)
Device tiers come from `detect-gpu`, plus `navigator.hardwareConcurrency` and a 60-frame FPS probe:

| Tier | Particles | DPR | Post |
|---|---|---|---|
| High (desktop dGPU) | 94,363 | ≤2 | bloom + grain + CA |
| Mid (laptop iGPU, modern phone) | 32,768 | ≤1.5 | grain only |
| Low / `prefers-reduced-motion` / no WebGL2 | 0, replaced by a **static poster** (pre-rendered WebP of the final state) | n/a | n/a |

The caption adapts. On desktop: *"94,363 points: one per lead BarHunter has sourced."* On mobile: *"A sample of 32,768 of BarHunter's 94,363 leads."* The site's honesty rule holds.

---

## 5. Page-by-page design

### 5.0 Preloader (≤1.8s, skipped on repeat visits)
A black screen. A mono counter runs `000 000 → 094 363`, then the digits **dissolve into particles** that become the hero field. The loader is the first scene, not a waiting room. It fades on `fonts.ready` plus shader compile, with a hard cap so it never blocks LCP. The HTML hero text renders underneath from the start.

### 5.1 Home
| # | Scene | Visual | Motion |
|---|---|---|---|
| 01 | **Hero** | Full-bleed particle *noise*. Headline in huge Geist, with Instrument Serif italic on *by hand*. Mono meta row: `AI SYSTEMS BUILDER · BENGALURU · AVAILABLE 2026` plus a live clock. | Split-text line reveal (`y:110%`, `expo.out`, 1.2s, stagger .08). Cursor scatters particles. Scroll hint: a thin line that "draws" downward. |
| 02 | **The Number** (pinned) | The screen holds **433** at ~40vw. Particles stream into the digits as they count up. Caption: *hours a month, given back to a 7-person legal team.* | ScrollTrigger pin about 150vh. Particles go from noise into the shape of the numerals. |
| 03 | **The Handoff** (thesis) | Two particle groups left and right ("Operators" and "Engineers") with a gap between them, and one line bridging them: you. The three pillars appear as steps along the bridge. | Scrubbed. The gap closes as the user scrolls. |
| 04 | **The System** | The CaseWise pipeline: particles flow through 3 glowing gates (Classify, Summarize, Outreach) and turn signal-orange after gate 1. Side labels show the real stats (2,700 cases/mo, 31 types, 5–15 min → seconds). | Continuous flow. Hovering a gate pauses it and shows a detail card. |
| 05 | **Selected Work: index** | A huge type list, one project per row (`01 BarHunter ——— Live · 94,363 leads`). Hovering shows a **WebGL image plane following the cursor** with an RGB-shift/liquid distortion shader on the screenshot, and the background particles **morph into that project's shape**. | Row text slides with a mask on hover. Fast-scroll collapses into a compact index (Immersive Garden). Mobile: stacked cards with an inline image and a tap-to-open. |
| 06 | **Proof** | The CEO quote as giant kinetic type, revealed word by word on scroll, with the consequence line in signal orange. Recognition logos marquee in mono. | Word-by-word opacity scrub (Locomotive). |
| 07 | **Closing / CTA** | Particles converge to form the wordmark. A massive *"Let's build the system."* with a **magnetic** circular CTA button. | Magnetic hover (lerp 0.15), fill wipe on hover. |
| 08 | **Footer** | Giant `TOUSIF ALI` outline type cropped at the bottom edge, the live local time in Bengaluru, socials, a "How this site was built →" link. | Text reveal as the footer enters. |

### 5.2 Work index (`/projects`)
- A fullscreen list with filters (Live / Shipped / Competition) as mono pill toggles.
- The same hover-plane system as home. A view toggle switches between **List** and **Grid**, and the grid uses WebGL planes with scroll-velocity skew (subtle, max 4°).

### 5.3 Case study template (`/projects/[slug]`)
- **Seamless transition in:** the hovered image plane in the index *expands* into the case-study hero (shared WebGL plane, FLIP-style). This is the "wow" moment that award juries reward.
- A hero with the project name in huge type, a mono meta grid (Role / Scope / Stack / Status), and **impact metrics as big counters**.
- **Chapters** (Problem, Decisions, Constraints, Outcome) with a sticky left rail showing progress `02 / 04` and a thin progress line.
- Decisions become cards that reveal with a slight 3D tilt on hover.
- The architecture list becomes an **animated node graph** (SVG plus line-draw) instead of a bullet list.
- **Next project:** a full-height footer that you scroll *into*, which triggers the next case study's transition (an infinite case-study loop).

### 5.4 About
- A **portrait treated in a shader** as a dithered/halftone point cloud of your photo that resolves into the real photo on hover or scroll. It's on-concept: you, assembled from signal.
- A bio set large with Instrument Serif accents.
- **Path timeline:** a horizontal scroll-jacked section (pinned) with three eras, each carrying its artifact or number. Native vertical fallback on mobile.
- Beliefs: each claim is a big statement that strikes through or underlines in signal orange as it enters.
- The skill ledger becomes a dense mono **spec sheet**, like hardware docs.

### 5.5 Recognition
- Certificates as a **3D card stack** (R3F, MeshPhysicalMaterial with a glossy sheen). Drag or scroll fans them out and click focuses one. Accessible fallback: a semantic grid with alt text, always in the DOM.
- The GDP Innovation Challenge and hackathon wins as "award" plaques with a counter.

### 5.6 Contact
- Particles form a field that **leans toward the cursor** as if listening.
- A form styled as a terminal-ish sentence: *"Hi Tousif, I'm [name] from [company]. We're doing [this] by hand…"* with inline inputs.
- Copy-email with a scramble-text confirmation (Abeto).

### 5.7 New page: `/colophon`, "How this site was built"
Active Theory's lesson: the site becomes a case study of its own. Cover the particle engine, the performance budget and a11y decisions, with small live demos. It's a strong signal for a *builder*.

---

## 6. Motion system (tokens, so everything feels like one hand made it)

```ts
// lib/motion/tokens.ts
export const ease = {
  out:    'expo.out',            // reveals
  inOut:  'power3.inOut',        // page transitions
  spring: { stiffness: 120, damping: 18 }, // particles, magnetic
};
export const dur = { xs: .25, sm: .5, md: .9, lg: 1.4, xl: 2.0 };
export const stagger = { words: .04, lines: .08, items: .06 };
```

| Pattern | Spec |
|---|---|
| Headline reveal | SplitText by lines and masked. `yPercent:110 → 0`, `dur.lg`, `ease.out`, `stagger.lines` |
| Paragraph reveal | Lines fade and move from y:20, `dur.md`, start at `top 85%` |
| Number counters | Tabular figures, 0 → value over 1.6s `power2.out`, triggered once |
| Link hover | Underline draws from left in 0.4s and retracts to the right |
| Magnetic elements | Max 12px pull, lerp 0.15, release spring |
| Custom cursor | 8px dot plus a 36px ring that lerps behind. It grows into "VIEW" over projects and "DRAG" over the card stack. **Hidden on touch, and the native cursor stays for text inputs.** |
| Page transition | A shared canvas noise-dissolve wipe (0.9s) plus DOM crossfade. Uses the View Transitions API where available and falls back to GSAP |
| Scroll | Lenis `lerp: 0.1` desktop; **native on touch** (`syncTouch:false`) |
| Sound (optional) | Off by default with a mono toggle. Soft UI ticks and a low drone that pitches with particle velocity |

**Reduced motion:** Lenis off, particles replaced by the static poster, reveals become instant opacity, no pinning, no scroll-jacking. The page is still beautiful, just still.

---

## 7. Technical architecture

### 7.1 Dependencies
Stay on **Next 14 and React 18** (stable, already working). Avoid a framework migration while doing a design overhaul.

```
three                      ^0.170
@react-three/fiber         ^8.17   (React 18 line)
@react-three/drei          ^9.11x
@react-three/postprocessing ^2.16
gsap                       ^3.13   (all plugins incl. SplitText now free)
@gsap/react                ^2.1
lenis                      ^1.3
detect-gpu                 ^5
tunnel-rat                 (portal DOM → canvas)
```
`framer-motion` isn't needed; GSAP owns motion so there's one timeline system.

### 7.2 Structure
```
components/
  canvas/
    Scene.tsx            # single root <Canvas>, mounted once in layout (lazy, ssr:false)
    Particles/
      ParticleField.tsx  # GPGPU system
      simulation.frag    # velocity/position update, curl noise, spring to target
      render.vert/.frag  # point sprites, signal colouring
      shapes.ts          # loads baked target textures
    Flowmap.ts           # cursor ping-pong RT
    ImagePlane.tsx       # DOM-tracked WebGL plane (hover + case-study hero)
    PostFX.tsx           # bloom, grain, CA
    Poster.tsx           # static fallback
  motion/
    SmoothScroll.tsx     # Lenis + GSAP ticker sync
    SplitReveal.tsx      # headline/paragraph reveals
    Counter.tsx
    Magnetic.tsx
    Cursor.tsx
    PageTransition.tsx
lib/
  motion/tokens.ts
  gpu/tier.ts            # detect-gpu + fps probe → 'high' | 'mid' | 'low'
  store/scene.ts         # zustand: current shape, progress, hovered project
tools/
  bake-shapes.mjs        # SVG/GLB → Float32 point textures (.bin), run at build
```

### 7.3 Key patterns
- **One canvas, mounted in `app/layout.tsx`**, `position: fixed`, `pointer-events: none` except where needed. Pages send *intent* to a zustand store (`setShape('clusters', progress)`), and the canvas reacts. Navigation never destroys the WebGL context (Darkroom/Satus pattern).
- **DOM stays the source of truth.** All text is real HTML (SEO, a11y, LCP). WebGL only *decorates*, and image planes track `getBoundingClientRect` of placeholder elements (Immersive Garden pattern).
- **Lazy everything:** `dynamic(() => import('./Scene'), { ssr:false })`, started after first paint via `requestIdleCallback`. Shape textures fetched progressively.
- **Render on demand:** `frameloop="demand"` when nothing is moving, and pause when the tab is hidden or the canvas is offscreen.

---

## 8. Budgets and guardrails (definition of "done")

| Metric | Budget |
|---|---|
| LCP (mobile, 4G) | **< 2.0s**, because the hero text is HTML and never waits for WebGL |
| CLS | < 0.02 |
| INP | < 150ms |
| Initial JS (before canvas) | < 120KB gzip |
| Canvas chunk (three + scene) | < 250KB gzip, lazy |
| Baked shape data | < 600KB total, streamed |
| FPS | 60 on M1/RTX, ≥ 50 on a mid Android; the tier system auto-downgrades if 3s average < 45 |
| Lighthouse | Perf ≥ 90 mobile, A11y 100, SEO 100 |

**Accessibility, kept:**
- Full keyboard navigation and visible focus on every interactive element, including project rows.
- `prefers-reduced-motion` fully honoured (see §6).
- The canvas is `aria-hidden`, and every meaningful thing in it has a DOM equivalent.
- WCAG AA contrast on both themes (re-verify the new tokens).
- Lenis on native scroll, so Space, PgDn, arrows and anchors all work.

---

## 9. Roadmap (phased, each phase shippable)

| Phase | Scope | Exit criteria |
|---|---|---|
| **P0: Foundation** (1–2 days) | New tokens and fonts, dark-first theme, motion tokens, Lenis + GSAP setup, SplitReveal, Counter, Magnetic, Cursor. Restyle the Header and Footer (giant footer type, live clock). | Site looks new *without any WebGL yet*. Lighthouse unchanged. |
| **P1: Particle engine** (3–4 days) | GPU tiering, root canvas, GPGPU particles, curl noise, cursor flowmap, `bake-shapes` script with noise/clusters/pipeline/wordmark/numerals, poster fallback. | Hero and the 433 scene work. 60fps on desktop, mid tier on phones, poster in reduced motion. |
| **P2: Home scenes** (3 days) | Preloader, Hero, Number, Handoff, System pipeline, Proof, Closing, all scroll-choreographed. | Full home scroll story; reviewed on 3 real devices. |
| **P3: Work and case studies** (3–4 days) | Index with hover image planes, per-project shapes, fast-scroll index, case-study template, **shared-element transition**, node-graph architecture, next-project loop. | Index → case study → next project feels seamless. |
| **P4: About, Recognition, Contact** (2–3 days) | Halftone portrait shader, horizontal timeline, 3D cert stack, sentence-form contact. | All pages on the new system. |
| **P5: Polish and launch** (2 days) | Page transitions, optional sound, `/colophon`, OG images in the new style, perf pass, a11y audit, cross-browser checks (Safari!). | Budgets in §8 met. Then submit to Awwwards, CSSDA and FWA. |

About 2.5–3 weeks of focused work. Each phase lands as its own commit and preview deploy on Vercel.

---

## 10. What we will NOT do
- ❌ A 3D room or game you have to "explore" to find the work. Recruiters won't.
- ❌ Hide content behind WebGL. Every word stays in HTML.
- ❌ Scroll-jack on touch devices.
- ❌ More than one accent colour, or effects that don't serve the noise-to-system story.
- ❌ A preloader longer than 2s, or one that shows on every visit.
- ❌ Fake numbers. Every particle count and stat stays true.

---

## 11. Decisions needed from you
1. **Dark-first?** (Recommended: yes, it's what makes the particles sing. Light stays as an option.)
2. **Fonts:** free Geist + Instrument Serif (recommended), or license something premium like *PP Neue Montreal* / *PP Editorial* (~$150–400)?
3. **Sound:** include the optional sound layer, or skip it?
4. **Portrait:** OK to use the halftone particle treatment on your photo?
5. **Start order:** P0 → P1 (recommended), or jump straight to the hero particle engine as a proof of concept first?

---

### Sources
- Lusion: Awwwards case study (Site of the Month), lusion.co/about, CommArts feature
- Immersive Garden: Awwwards case study (Mar 2025), technical teardown at rickcreates.com
- Abeto: *Igloo Inc* Awwwards case study (Site of the Year 2024), *Messenger* (Site of the Year 2025)
- Active Theory: Webby "Crafted with Code" interview
- Darkroom Engineering: Lenis and Satus architecture (GitHub)
- Awwwards Annual Awards 2025: *Lando Norris* by OFF+BRAND (Site of the Year)

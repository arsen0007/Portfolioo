# SIGNAL: build brief for every builder

Read this whole file and `docs/DESIGN_PLAN.md` before writing code. The foundation
is done; you are building **on** it, not around it.

## The idea in one line
A messy manual queue becomes a clean, running system. The site *shows* this:
a persistent WebGL particle field goes from noise to order as you move through
the site. Typography and motion are the second star.

## Design language (non-negotiable)
- **Dark-first ink** (`bg-canvas`, `text-textPrimary` …). Never hard-code hex; use the
  Tailwind tokens in `tailwind.config.ts`, which map to CSS variables in `styles/globals.css`.
  Light mode ("paper") must also look right, and tokens handle it automatically.
- **One accent: signal orange** (`text-accent`, `bg-accent`, `.live-dot`). It means
  *"this has become a system / this is live"*. Use it sparingly: at most one or two hits per screen.
- **Type:**
  - Headlines use `font-display font-medium` (Geist) at `text-mega | text-display | text-h1 | text-h2 | text-h3`.
    They are tight and large.
  - **One or two words per headline** go in `font-serif italic font-normal` (Instrument Serif),
    e.g. `I build systems for work I used to do <em class="font-serif italic">by hand</em>.`
    This is the signature move. Don't overuse it: one per heading, never body copy.
  - The system voice is the `.label` utility class (Geist Mono, uppercase, tracked), used for eyebrows,
    indices, meta, captions-as-data. `<Eyebrow index="02">Selected work</Eyebrow>` renders
    `02 —— SELECTED WORK`.
  - Body text is `text-lead` / base in `text-textSecondary`, max ~65ch.
- **Layout:** `Container` (max-w-page with a fluid `--gutter`) and `Section` (big vertical rhythm). 12-column
  grids. Lots of negative space. Hairlines (`border-surfaceBorder`) instead of boxes. Numbered
  indices `01 / 08`. Asymmetry is good.
- **Numbers are heroes:** big, `tabular-nums`, counting up via `<Counter value="94,363" />`
  (or `<Metric>`, which already uses it).
- **Buttons:** `ButtonLink` / `Button` (pills, with the fill wipe built in). Wrap the main CTA in `<Magnetic>`.
- **Cursor:** add `data-cursor="view"` (+ optional `data-cursor-label="Open"`) to project cards
  and images, and `data-cursor="drag"` to draggable things.
- **No** gradients-for-decoration, drop shadows, emoji, stock icons, rounded-2xl cards with
  shadows, or "glassmorphism" cards. Premium means restraint plus precision.

## Foundation you must use (do not re-implement)
| Need | Use |
|---|---|
| Text reveal | `components/motion/Reveal.tsx`: `<Reveal as="h2" mode="lines">…</Reveal>` (`words`, `fade`; `immediate` above the fold; `delay`) |
| Number count-up | `components/motion/Counter.tsx` |
| Magnetic hover | `components/motion/Magnetic.tsx` |
| Glyph scramble | `components/motion/Scramble.tsx`: `<Scramble text="Live" trigger={hovered} />` |
| Internal links | `components/motion/TransitionLink.tsx`: View-Transitions-wrapped `<Link>`. Elements with the same `style={{ viewTransitionName: 'x' }}` on two pages morph between them. Names must be unique per page. |
| GSAP | `import { gsap, ScrollTrigger, SplitText, useGSAP, motionAllowed } from '@/lib/motion/gsap'`. Never import from `'gsap'` directly. Lenis is already running and synced to ScrollTrigger. |
| Tokens | `lib/motion/tokens.ts` (`ease.out`='expo.out', `dur.lg`=1.3 …) |
| Directing the particles | `components/canvas/SceneTrigger.tsx`: `<SceneTrigger as="section" shape="clusters" layout="right" signal={0.4}>…</SceneTrigger>` or `<SceneIntentOnMount shape="sphere" />`. The contract and shape list are in `lib/store/scene.ts`. Hover previews use `useScene.getState().setHoveredProject(slug \| null)`. |
| Live clock | `components/layout/LocalTime.tsx` |

The particle canvas is `position: fixed` **behind** content (`#main-content` is `relative z-10`).
Where the field should show through, **sections must have no background**. Use `bg-canvas` only on
sections that should cover it.

## Rules
1. **Motion must degrade.** Everything works and looks finished with JS off and with
   `prefers-reduced-motion: reduce` (in that case `motionAllowed()` is false and `html` lacks `motion-ok`).
   Never hide content in a way that depends on JS without the `data-reveal` contract (see globals.css).
   No scroll-jacking on touch devices (`(pointer: coarse)`). Use `gsap.matchMedia()` for pinning
   and horizontal scroll so mobile and reduced motion get the plain vertical layout.
2. **Accessibility stays at 100:** semantic HTML, keyboard reachable, visible focus (global ring
   exists), alt text, AA contrast with the tokens, `aria-hidden` on decorative duplicates.
   Every interactive thing must be a real `<a>` or `<button>`.
3. **Content honesty:** do not invent numbers, clients, quotes or claims. All content comes
   from `lib/data/**` (or existing page copy). You may tighten wording and add serif-italic
   emphasis, but don't change facts.
4. **Performance:** transform/opacity animations only. No layout-thrashing scroll handlers
   (use ScrollTrigger). Use `next/image` for images. Keep client components small; prefer server
   components with small client islands.
5. **File ownership:** edit ONLY the files your task lists. You MAY create new files inside
   your owned folders. Do NOT edit shared files (`styles/globals.css`, `tailwind.config.ts`,
   `components/ui/*`, `components/motion/*`, `components/layout/*`, `lib/store/*`,
   `app/layout.tsx`, `package.json`). If you need a shared change, make a local version
   in your folder and mention it in your final report.
6. **Do not run `next build`, do not start another dev server, do not `npm install`, do not commit.**
   A dev server is already running at **http://localhost:3000** with hot reload. Verify by:
   - `npx tsc --noEmit -p . 2>&1 | grep -E '<your paths>'` (ignore errors in other builders' files; others are working in parallel)
   - `npx eslint <your files>`
   - Screenshots with Playwright (pre-installed: `require('playwright')` and `chromium.launch()`; for WebGL
     pass `args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']`). Take them at
     1440×900 and 390×844 in dark mode, plus one light-mode check (set `localStorage.theme='light'` via `addInitScript`).
     Scroll through the page (`page.mouse.wheel` plus waits) so reveals fire. **Look at your screenshots**
     with the Read tool and iterate until it looks award-grade. Save them in
     `/tmp/claude-0/-home-user-Portfolioo/2a86d388-bb11-584c-b208-1442dfc0bdf1/scratchpad/shots/<your-area>/`.
7. Final report (≤250 words): files changed or created, what you built, anything you need from shared
   files, known issues.

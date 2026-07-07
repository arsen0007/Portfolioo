# tousifali.com — Portfolio

Personal portfolio of **Tousif Ali**, AI Product & Systems Builder. Live at [tousifali.com](https://tousifali.com).

The homepage is an interactive orbit — a systems map of my work — built from scratch with SVG, CSS conic gradients, and Framer Motion. Every project featured runs in production with real users: [BarHunter](https://tousifali.com/projects/barhunter) (100K+ legal leads sourced), [CaseWise](https://tousifali.com/projects/casewise) (AI legal intake, 96% time reduction, CTO-integrated), and more.

## Stack

Next.js 14 (App Router, fully static output) · TypeScript · Tailwind CSS · Framer Motion · @xyflow/react (architecture diagrams) · deployed on Vercel.

## Notable details

- **Design system in CSS variables** — dual light/dark themes via `color-mix()`, one token set in `styles/globals.css`, zero runtime theme flash (inline script applies theme before paint).
- **Accessibility** — WCAG AA contrast tokens, global `:focus-visible` rings, skip link, `prefers-reduced-motion` coverage for every animation, `aria-current` navigation.
- **SEO** — static prerender of all routes, JSON-LD Person schema, OG images, sitemap + robots.
- **Content as data** — case studies live in `lib/data/projects.ts` with typed problem/decisions/constraints/outcome models.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Contact

tousifarsen@gmail.com · [LinkedIn](https://www.linkedin.com/in/tousif-ali--/) · [GitHub](https://github.com/arsen0007)

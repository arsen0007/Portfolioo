# tousifali.com — Portfolio

Personal portfolio of **Tousif Ali**, AI Product & Systems Builder. Live at [tousifali.com](https://tousifali.com).

The homepage is an interactive orbit — a systems map of my work — built from scratch with SVG, CSS conic gradients, and Framer Motion. Every project featured runs in production with real users: [CaseWise](https://tousifali.com/projects/casewise) (AI legal intake, 96% time reduction, CTO-backed for core-system integration), [BarHunter](https://tousifali.com/projects/barhunter) (94,363 legal leads sourced), [Genie](https://tousifali.com/projects/genie) (an agent runtime built from scratch on a Raspberry Pi), and more.

## Stack

Next.js 14 (App Router, fully static output) · TypeScript · Tailwind CSS · Framer Motion · @xyflow/react (architecture diagrams) · deployed on Vercel.

## Notable details

- **Design system in CSS variables** — dual light/dark themes via `color-mix()`, one token set in `styles/globals.css`, zero runtime theme flash (inline script applies theme before paint).
- **Accessibility** — WCAG AA contrast tokens, global `:focus-visible` rings, skip link, `aria-current` navigation, `prefers-reduced-motion` honoured across the orbit canvas.
- **SEO** — static prerender of all routes, JSON-LD Person schema, OG images, sitemap + robots.
- **Content as data** — case studies live in `lib/data/projects.ts` with typed problem/decisions/constraints/outcome models.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

The contact form at `/contact` posts to `app/api/contact/route.ts`, which needs
two variables to actually deliver mail:

```bash
RESEND_API_KEY=...          # from resend.com
CONTACT_TO_EMAIL=...        # where submissions land
```

Without them the endpoint returns `503` and the form surfaces the direct email
address instead — a form that accepts a message and quietly drops it is worse
than no form, so an unconfigured deploy fails loudly rather than pretending to
work.

## Contact

tousifarsen@gmail.com · [LinkedIn](https://www.linkedin.com/in/tousif-ali--/) · [GitHub](https://github.com/arsen0007)

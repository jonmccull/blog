# Project: jonm.cc (personal blog & portfolio)

Next.js 16 (App Router) + Tailwind 3.4 + TypeScript. Content in MDX. Deployed on Vercel.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build (also runs as pre-push hook)
- `npm run lint:fix` — ESLint
- `npm run format` — Prettier
- `npm run test` — Jest unit tests
- `npm run test:e2e` — Playwright

## Design System

### Typography (three-font system)

- **Fraunces** (`--font-display`) — display/headings. Used for page titles, section headings on CV. Settings: `font-weight: 500`, `font-variation-settings: 'WONK' 0, 'SOFT' 50`.
- **Nunito Sans** (`--font-body`) — body text. Used for prose content, CV descriptions, blog posts.
- **Geist Sans / Geist Mono** — UI chrome only: nav, footer links, metadata, code blocks.

### Color Palette (ink & paper)

Warm-shifted neutrals defined as CSS variables in `app/styles/base.css`. Tailwind's `neutral-*` scale is remapped to these in `tailwind.config.js`.

| Token                 | Light                    | Dark                   |
| --------------------- | ------------------------ | ---------------------- |
| `--color-surface`     | `#F9F6F1` (cream)        | `#1C1917` (warm black) |
| `--color-primary`     | `#B85C38` (burnt sienna) | `#D4825E` (lighter)    |
| `--color-neutral-800` | `#2A2520` (text)         | —                      |
| `--color-neutral-100` | `#F0EBE3`                | —                      |

Full neutral scale: 100–900, all warm-shifted (brown undertone, not cool gray).

### Key Patterns

- **Link hover**: animated underline via `background-size` transition (prose) or `scaleX` pseudo-element (nav/footer)
- **Dark mode**: class-based (`darkMode: 'class'`), stored in localStorage, respects system preference
- **Layout width**: animated container that expands for portfolio pages (narrow: 36rem, wide: 56rem)
- **Motion**: Framer Motion on CV page (staggered fade-in). Respects `prefers-reduced-motion`.
- **Selection**: warm sienna tint (`rgba(184, 92, 56, 0.15)`)

## Content

- Blog posts: `content/blog/*.mdx`
- Portfolio projects: `content/portfolio/*.mdx`
- CV jobs: `content/cv/*.mdx`

## Conventions

- Pre-commit hook runs Prettier check; pre-push runs full build
- Use CSS custom properties for colors, not hardcoded hex in components
- Prefer CSS classes in `base.css` over inline Tailwind for complex/reusable styles

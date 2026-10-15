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

The site uses the **Foundations kit** (restyle in progress on branch `foundations-kit`: phase 1 shell + home done; blog, portfolio, CV, now pages are phase 2). Read `app/styles/foundations/README.md` first.

- **Vendored kit**: `app/styles/foundations/tokens.css` and `bundle.css` are byte-identical copies of the kit, imported in `app/layout.tsx` before `base.css`. Never edit them; never retype a token value. Colours and fonts come from `var(--token)`, a kit type class (`display-xl`, `lead`, `body`, `small`, `footnote`, ...) or a `fdn-` class (`fdn-btn`, `fdn-link`, `fdn-bar`, `fdn-wordmark`, ...).
- **Tailwind names**: `ground`, `surface`, `ink`, `ink-secondary`, `ink-muted`, `hairline`, `underline`, `lime`, `lime-glow`, `on-lime`; `font-sans` (Outfit), `font-mono` (JetBrains Mono). The old `neutral-*` scale is a temporary bridge onto kit tokens (`base.css`), removed in phase 2.
- **Fonts**: one Google Fonts link in `app/layout.tsx` (from the kit's `fonts.html`). No next/font.
- **Dark mode**: `data-theme="dark"` on `<html>` (light = no attribute). Set before paint by the inline script in `layout.tsx` (stored `theme`, else OS), kept in sync by `ThemeContext`. Tailwind `dark:` uses `['selector', '[data-theme="dark"]']`.
- **The three rules**: flat page on `ground`, no cards/panels/shadows, square corners; hairlines (`--hairline`) are the only edge; lime is one block per view (the home page's Mail button), never text or border, text on it is `on-lime`.
- **Motion**: none. No hover motion; links darken. Focus is the kit's 2px `ink` outline, offset 2px.
- **Layout width**: home and portfolio detail pages use the wide container (56rem), others narrow (36rem); see `LayoutWidthContext.tsx`.
- **Home portrait**: two dither files (`public/images/jon-dither-{light,dark}-1024.webp`) swapped by CSS on `data-theme`, shown at exactly 256px with `image-rendering: pixelated`. Never resize to an in-between size.

## Content

- Blog posts: `content/blog/*.mdx`
- Portfolio projects: `content/portfolio/*.mdx`
- CV jobs: `content/cv/*.mdx`

## Conventions

- Pre-commit hook runs Prettier check; pre-push runs full build
- Use CSS custom properties for colors, not hardcoded hex in components
- Prefer CSS classes in `base.css` over inline Tailwind for complex/reusable styles

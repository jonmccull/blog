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

The site uses the **Foundations kit** on every page (shell, home, blog, posts, portfolio, CV, now, error and 404). Read `app/styles/foundations/README.md` first.

- **Vendored kit**: `app/styles/foundations/tokens.css` and `bundle.css` are byte-identical copies of the kit, imported in `app/layout.tsx` before `base.css`. Never edit them; never retype a token value. Colours and fonts come from `var(--token)`, a kit type class (`display-xl`, `lead`, `body`, `small`, `footnote`, ...) or a `fdn-` class (`fdn-btn`, `fdn-link`, `fdn-bar`, `fdn-wordmark`, ...).
- **Tailwind names**: `ground`, `surface`, `ink`, `ink-secondary`, `ink-muted`, `hairline`, `underline`, `lime`, `lime-glow`, `on-lime`; `font-sans` (Outfit), `font-mono` (JetBrains Mono). The old `neutral-*` scale and the `--color-*` variables are gone; don't bring them back.
- **Fonts**: one Google Fonts link in `app/layout.tsx` (from the kit's `fonts.html`). No next/font.
- **Dark mode**: `data-theme="dark"` on `<html>` (light = no attribute). Set before paint by the inline script in `layout.tsx` (stored `theme`, else OS), kept in sync by `ThemeContext`. Tailwind `dark:` uses `['selector', '[data-theme="dark"]']`.
- **The three rules**: flat page on `ground`, no cards/panels/shadows, square corners; hairlines (`--hairline`) are the only edge; lime is one block per view at rest ("Try again" on the error page); the home and CV contact links (CV, LinkedIn, Mail) rest as plain text and take the lime block only on hover or focus, on Jon's call; lime is also the stroke of the link underlines and the theme toggle's hover fill; `lime-glow` for quiet highlights (the blog's Portfolio label), never text or border, text on it is `on-lime`.
- **Syntax colours**: the `--sh-*` variables in `base.css` are site colours, not kit tokens, each checked at 4.5:1 on ground and surface in its theme.
- **Motion**: hover only, the kit's `--motion-hover` (200ms), collapsed under `prefers-reduced-motion`. In-copy links (the kit's `fdn-link`, prose, CV job copy) rest on a thin `--underline` line that a 0.1em lime stroke covers from the centre; nav links (the kit's `.fdn-bar nav a`) and footer links (the same rule in `base.css`) have no resting line and grow the same lime stroke. Focus is the kit's 2px `ink` outline, offset 2px.
- **Nav bar**: no wordmark on home (the page headline carries the name); the links stay right-aligned.
- **Layout width**: home and portfolio detail pages use the wide container (56rem), others narrow (36rem); see `LayoutWidthContext.tsx`.
- **Home portrait**: one dither portrait per theme with soft bottom and right edges, swapped by CSS on `data-theme`, shown at exactly 256px with `image-rendering: pixelated`. A plain `<img>` with a 1x/2x `srcset`: `jon-dither-{light,dark}-soft-256.webp` (1px cells) for 1x screens, `-soft-1024.webp` (2px cells) for 2x. Never resize to an in-between size; re-export from the masters in `docs/portrait/` (`jon-dither-{light,dark}-soft.svg`, a 512-cell grid drawn `crispEdges`, so 1024 is 2px cells; the 256 files are a separate 256-cell dither, not a resize). Desktop and tablet only: under 768px the home page is text only, on Jon's call (a 128px byline beside the name was tried and dropped). The imgs load lazily, so phones never fetch them.
- **Home field**: from 768px up, the kit's Field (`app/styles/foundations/field.js`, vendored, loaded by `HomeField.tsx` with a code-split `import()`) runs full bleed behind the home block, from the bar's hairline. The copy is its quiet zone; the portrait is a `figure`: `fieldPortrait.ts` redraws it on a canvas from the same files, paper transparent, ink shifted by the ripple's tilt and lit lime at its front (`WARP`, `LIME`, `CURVE` at the top of that file, tuned by Jon). The imgs stay underneath at `opacity: 0` for the alt text and no-JS. Phones have no portrait. Measured cost: about 7 KB gzipped of script, plus the JetBrains Mono 400 file (31 KB, after load); ~100ms of sliced build after load; ~4ms a frame at rest (20fps) and ~6ms during a ripple at 1440px, 2x, on an M3.

## Content

- Blog posts: `content/blog/*.mdx`
- Portfolio projects: `content/portfolio/*.mdx`
- CV jobs: `content/cv/*.mdx`
- Images: `public/images-blog/` (posts, now) and `public/images/` (portfolio, home), webp at about 1200px wide. Markdown images (`![alt](/path)`) on every MDX page render through `app/components/MdxImage.tsx`, which reads the file's real size at build time; there is no need to give a width or height.

## Conventions

- Pre-commit hook runs Prettier check; pre-push runs full build
- Use CSS custom properties for colors, not hardcoded hex in components
- Prefer CSS classes in `base.css` over inline Tailwind for complex/reusable styles

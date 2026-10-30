# jonm.cc

My personal website and blog. Built with Next.js, TypeScript, and Tailwind CSS. Deployed on Vercel.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Content**: MDX via next-mdx-remote
- **Styling**: Tailwind CSS on the Foundations kit (Outfit + JetBrains Mono); see `app/styles/foundations/README.md`
- **Testing**: Jest + Playwright
- **Deployment**: Vercel

## Local development

```bash
npm install
npm run dev
```

## Scripts

| Command              | Description              |
| -------------------- | ------------------------ |
| `npm run dev`        | Start dev server         |
| `npm run build`      | Production build         |
| `npm run test`       | Run unit tests           |
| `npm run test:e2e`   | Run Playwright E2E tests |
| `npm run format`     | Format with Prettier     |
| `npm run lint`       | Lint with ESLint         |
| `npm run type-check` | TypeScript check         |

CI also runs the Foundations kit check: `node app/styles/foundations/check-kit.mjs`.

## Design system

Every page uses the [Foundations kit](https://github.com/jonmccull/foundations-kit). Its stylesheets and the home page's Field script are vendored, byte-identical, in `app/styles/foundations/`. Never edit them there. Site styles live in `app/styles/base.css`. The kit check fails CI if a vendored file drifts from the pinned commit in `kit.lock.json`, or if the site uses a `var(--token)` that nothing declares.

- **Updating the kit**: the kit repo opens a "Foundations kit update" PR. The steps for reviewing it are in `app/styles/foundations/README.md`.
- **Using it**: the design rules (tokens, Tailwind names, dark mode, lime, motion) are in `CLAUDE.md` under Design System.
- **Restyle screenshots**: before and after, in `docs/foundations-kit/screenshots/`.

## Project structure

```
app/
  blog/           Blog pages
  cv/             CV page + job MDX files
  portfolio/      Portfolio pages
  photos/         Photos page + its list (not in the nav)
  components/     Shared components
  context/        Theme context
  lib/            Utilities (MDX parsing, etc.)
  styles/
    base.css      Site styles, on top of the kit
    foundations/  Vendored Foundations kit + its check (don't edit)
content/
  blog/           Blog post MDX files
  portfolio/      Portfolio MDX files
docs/
  foundations-kit/  Restyle before/after screenshots
e2e/              Playwright tests
public/
  images-blog/    Blog post images
  images/
    photos/       Photos page pictures (scripts/photo-prep.mjs writes them)
    portfolio/    Portfolio project images
```

## Images

All images live in the repo under `public/` and are served as static assets by Next.js.

| Directory                  | Used for                 |
| -------------------------- | ------------------------ |
| `public/images-blog/`      | Blog post images         |
| `public/images/portfolio/` | Portfolio project images |

Reference images in MDX using root-relative paths:

```md
![Alt text](/images-blog/my-image.webp)
```

Prefer `.webp` for photos/screenshots. Use `.png` for diagrams or images requiring transparency.

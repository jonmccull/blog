# jonm.cc

My personal website and blog. Built with Next.js, TypeScript, and Tailwind CSS. Deployed on Vercel.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Content**: MDX via next-mdx-remote
- **Styling**: Tailwind CSS + Geist font
- **Animations**: Framer Motion (CV page)
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

## Project structure

```
app/
  blog/           Blog pages
  cv/             CV page + job MDX files
  portfolio/      Portfolio pages
  components/     Shared components
  lib/            Utilities (MDX parsing, etc.)
content/
  blog/           Blog post MDX files
  portfolio/      Portfolio MDX files
e2e/              Playwright tests
public/           Static assets
```

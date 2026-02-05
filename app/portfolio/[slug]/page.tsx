import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPortfolioProject, getPortfolioProjects, type PortfolioProject } from '@/app/lib/mdx'
import { CustomMDX } from '@/app/components/mdx'
import type { Metadata } from 'next'
import { baseUrl } from '@/app/sitemap'

export async function generateStaticParams() {
  const projects = getPortfolioProjects()
  return projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getPortfolioProject(slug)

  if (!project) {
    return {}
  }

  const { title, summary, date } = project.metadata

  return {
    title,
    description: summary,
    openGraph: {
      title,
      description: summary,
      type: 'article',
      publishedTime: date,
      url: `${baseUrl}/portfolio/${slug}`,
    },
  }
}

export default async function PortfolioProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getPortfolioProject(slug)

  if (!project) {
    notFound()
  }

  const { metadata, content } = project as PortfolioProject

  return (
    <div className="portfolio-container">
      <article className="portfolio-page">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-12 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rotate-180"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Blog
        </Link>

        {/* Header */}
        <header className="mb-16">
          <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-3">{metadata.subtitle}</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {metadata.title}
          </h1>
        </header>

        {/* Content */}
        <div className="portfolio-content prose prose-neutral dark:prose-invert max-w-none">
          <CustomMDX source={content} />
        </div>
      </article>
    </div>
  )
}

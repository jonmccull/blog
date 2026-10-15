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
    <article className="portfolio-page">
      <Link href="/blog" className="portfolio-back small">
        ← Blog
      </Link>

      <header className="portfolio-header">
        <p className="fdn-eyebrow m-0">{metadata.subtitle}</p>
        <h1 className="page-title display-xl">{metadata.title}</h1>
      </header>

      <div className="portfolio-content prose body max-w-none">
        <CustomMDX source={content} />
      </div>
    </article>
  )
}

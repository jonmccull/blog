import Link from 'next/link'
import { getAllPosts, getPortfolioProjects } from '../lib/mdx'

export const metadata = {
  title: 'Blog',
  description: 'Read my thoughts on product marketing, technology, and life in Norway.',
}

type FeedItem = {
  type: 'post' | 'portfolio'
  slug: string
  title: string
  subtitle?: string
  excerpt: string
  date: string
  readingTime?: string
}

export default async function BlogPage() {
  const posts = await getAllPosts()
  const portfolioProjects = getPortfolioProjects()

  // Create unified feed
  const feedItems: FeedItem[] = [
    ...posts.map((post) => ({
      type: 'post' as const,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      readingTime: post.readingTime,
    })),
    ...portfolioProjects.map((project) => ({
      type: 'portfolio' as const,
      slug: project.slug,
      title: project.metadata.title,
      subtitle: project.metadata.subtitle,
      excerpt: project.metadata.summary,
      date: project.metadata.date,
    })),
  ]

  // Sort by date, newest first
  const sortedFeed = feedItems.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <section className="blog-index">
      <h1 className="page-title display-lg">Blog</h1>
      <ol className="blog-list">
        {sortedFeed.map((item) => (
          <li key={`${item.type}-${item.slug}`} className="fdn-row">
            <Link
              href={item.type === 'post' ? `/blog/${item.slug}` : `/portfolio/${item.slug}`}
              className="blog-row-link"
              prefetch={true}
            >
              <h2 className="blog-row-title title">{item.title}</h2>
              <p className="page-meta fdn-eyebrow">
                {item.type === 'portfolio' && <span className="fdn-label is-on">Portfolio</span>}
                <time dateTime={item.date}>
                  {new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                {item.readingTime && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{item.readingTime}</span>
                  </>
                )}
                {item.subtitle && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{item.subtitle}</span>
                  </>
                )}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

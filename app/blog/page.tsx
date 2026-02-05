import Link from 'next/link'
import { getAllPosts, getPortfolioProjects } from '../lib/mdx'
import { Suspense } from 'react'

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

function PostSkeleton() {
  return (
    <div className="animate-pulse mb-8">
      <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  )
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
    <section>
      <h1 className="font-bold text-2xl mb-8 tracking-tighter text-neutral-900 dark:text-neutral-100">
        Blog
      </h1>
      <Suspense
        fallback={Array(3)
          .fill(0)
          .map((_, i) => (
            <PostSkeleton key={i} />
          ))}
      >
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {sortedFeed.map((item) => (
            <article key={`${item.type}-${item.slug}`} className="mb-6">
              <Link
                href={item.type === 'post' ? `/blog/${item.slug}` : `/portfolio/${item.slug}`}
                className={`block no-underline group ${item.type === 'portfolio' ? 'blog-card-rainbow' : 'blog-card'}`}
                prefetch={true}
              >
                <h2 className="font-bold text-xl mb-1 tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-800 dark:group-hover:text-neutral-200">
                  {item.title}
                </h2>
                <div className="flex gap-3 items-center text-sm text-neutral-600 dark:text-neutral-400">
                  <time dateTime={item.date}>
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  {(item.readingTime || item.subtitle) && (
                    <>
                      <span>•</span>
                      <span>{item.readingTime || item.subtitle}</span>
                    </>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </Suspense>
    </section>
  )
}

import Link from 'next/link'
import { getAllPosts } from '../lib/blog'
import { Suspense } from 'react'

export const metadata = {
  title: 'Blog',
  description: 'Read my thoughts on product marketing, technology, and life in Norway.',
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

  return (
    <section>
      <h1 className="font-bold text-2xl mb-8 tracking-tighter text-neutral-900 dark:text-neutral-100">Blog</h1>
      <Suspense
        fallback={Array(3)
          .fill(0)
          .map((_, i) => (
            <PostSkeleton key={i} />
          ))}
      >
        <div className="prose prose-neutral dark:prose-invert">
          {posts.map((post) => (
            <article key={post.slug} className="mb-8">
              <Link
                href={`/blog/${post.slug}`}
                className="no-underline group"
                prefetch={true}
              >
                <h2 className="font-bold text-xl mb-2 tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-800 dark:group-hover:text-neutral-200">
                  {post.title}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-1">{post.excerpt}</p>
                <div className="flex gap-3 items-center text-sm text-neutral-600 dark:text-neutral-400">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </Suspense>
    </section>
  )
}

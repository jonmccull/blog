import Link from 'next/link'
import { getAllPosts } from '../lib/blog'

export const metadata = {
  title: 'Blog',
  description: 'Read my thoughts on product marketing, technology, and life in Norway.',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <section>
      <h1 className="font-bold text-2xl mb-8 tracking-tighter">Blog</h1>
      <div className="prose prose-neutral dark:prose-invert">
        {posts.map((post) => (
          <article key={post.slug} className="mb-8">
            <Link
              href={`/blog/${post.slug}`}
              className="no-underline hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              <h2 className="font-bold text-xl mb-2 tracking-tight">{post.title}</h2>
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
    </section>
  )
}

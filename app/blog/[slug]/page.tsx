import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllPosts, type Post } from '../../lib/mdx'
import { mdxComponents } from '../../components/mdx-components'
import type { Metadata } from 'next'
import JsonLd from '../../components/JsonLd'
import { baseUrl } from '../../sitemap'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {}
  }

  const { title, excerpt, date } = post

  return {
    title,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      type: 'article',
      publishedTime: date,
    },
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const { title, date, readingTime, content, excerpt } = post as Post

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    datePublished: date,
    author: {
      '@type': 'Person',
      name: 'Jon McCullough',
    },
    description: excerpt,
    url: `${baseUrl}/blog/${slug}`,
  }

  return (
    <>
      <JsonLd data={blogPostingSchema} />
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="font-bold tracking-tighter text-neutral-900 dark:text-neutral-100">
          {title}
        </h1>
        <div className="flex gap-3 items-center text-sm text-neutral-600 dark:text-neutral-400 mb-8">
          <time dateTime={date}>{formatDate(date)}</time>
          <span>•</span>
          <span>{readingTime}</span>
        </div>
        <div className="prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-800 prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-neutral-700">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </article>
    </>
  )
}

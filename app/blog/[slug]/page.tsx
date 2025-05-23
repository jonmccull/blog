import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllPosts } from '../../lib/blog'
import { mdxComponents } from '../../components/mdx-components'
import type { Post, GenerateMetadata } from '../../types/blog'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(({ slug }) => ({ slug }))
}

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const post = await getPostBySlug(params.slug)

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

export default async function BlogPost({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const { title, date, readingTime, content } = post as Post

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="font-bold tracking-tighter text-neutral-900 dark:text-neutral-100">{title}</h1>
      <div className="flex gap-3 items-center text-sm text-neutral-600 dark:text-neutral-400 mb-8">
        <time dateTime={date}>{formatDate(date)}</time>
        <span>•</span>
        <span>{readingTime}</span>
      </div>
      <div className="prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-800 prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-neutral-700">
        <MDXRemote source={content} components={mdxComponents} />
      </div>
    </article>
  )
}

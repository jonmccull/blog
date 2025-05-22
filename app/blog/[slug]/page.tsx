import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllPosts } from '../../lib/blog'
import Image from '../../components/Image'

type Post = {
  title: string
  date: string
  readingTime: string
  content: string
  excerpt: string
  slug: string
}

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const components = {
  Image,
}

// Generate static pages at build time
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const { title, date, readingTime, content } = post as Post

  return (
    <article className="prose prose-neutral dark:prose-invert">
      <h1 className="font-bold tracking-tighter">{title}</h1>
      <div className="flex gap-3 items-center text-sm text-neutral-600 dark:text-neutral-400 mb-8">
        <time dateTime={date}>
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <span>•</span>
        <span>{readingTime}</span>
      </div>
      {/* @ts-expect-error - MDXRemote types are not properly set up for RSC */}
      <MDXRemote source={content} components={components} />
    </article>
  )
}

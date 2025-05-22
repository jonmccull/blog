import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug } from '../../lib/blog'
import Image from '../../components/Image'

interface Props {
  params: {
    slug: string
  }
}

const components = {
  Image,
}

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPost({ params }: Props) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="prose prose-neutral dark:prose-invert">
      <h1 className="font-bold tracking-tighter">{post.title}</h1>
      <div className="flex gap-3 items-center text-sm text-neutral-600 dark:text-neutral-400 mb-8">
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
      <MDXRemote source={post.content} components={components} />
    </article>
  )
}

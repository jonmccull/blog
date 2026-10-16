import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllPosts, type Post } from '../../lib/mdx'
import { mdxComponents } from '../../components/mdx-components'
import type { Metadata } from 'next'
import JsonLd from '../../components/JsonLd'
import IcdRain from '../../components/IcdRain'
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

// Drawn headers a post can opt into with `header:` in its frontmatter
const headers: Record<string, () => React.JSX.Element> = { 'icd-rain': IcdRain }

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

  const { title, date, readingTime, content, excerpt, header } = post as Post
  const Header = header ? headers[header] : undefined

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
      <article className="post">
        <header className="post-header">
          {Header && <Header />}
          <h1 className="page-title display-lg">{title}</h1>
          <p className="page-meta fdn-eyebrow">
            <time dateTime={date}>{formatDate(date)}</time>
            <span aria-hidden="true">·</span>
            <span>{readingTime}</span>
          </p>
        </header>
        <div className="prose body max-w-none">
          <MDXRemote source={content} options={{ blockJS: false }} components={mdxComponents} />
        </div>
      </article>
    </>
  )
}

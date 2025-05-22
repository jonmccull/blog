import type { Metadata } from 'next'

export type Post = {
  title: string
  date: string
  readingTime: string
  content: string
  excerpt: string
  slug: string
}

type SearchParams = { [key: string]: string | string[] | undefined }

export type BlogParams = {
  params: { slug: string }
  searchParams?: SearchParams
}

export type GenerateMetadata = (props: BlogParams) => Promise<Metadata>

export type PageProps<P = {}, SP = {}> = {
  params: P
  searchParams: SP
}

export type BlogPageProps = PageProps<{ slug: string }, SearchParams> 
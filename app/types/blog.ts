import type { Metadata } from 'next'

export type Post = {
  title: string
  date: string
  readingTime: string
  content: string
  excerpt: string
  slug: string
}

export type BlogParams = {
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export type GenerateMetadata = (props: BlogParams) => Promise<Metadata>

export type BlogPageProps = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
} 
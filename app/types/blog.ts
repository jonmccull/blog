export type Post = {
  title: string
  date: string
  readingTime: string
  content: string
  excerpt: string
  slug: string
}

export type BlogPageProps = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
} 
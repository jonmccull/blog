import fs from 'fs'
import path from 'path'

// Generic metadata types
export type BlogMetadata = {
  title: string
  date: string
  excerpt: string
  image?: string
}

export type CVMetadata = {
  title: string
  position: string
  companyLink: string
  location?: string
  startDate: string
  endDate: string
  description: string
}

export type PortfolioMetadata = {
  title: string
  subtitle: string
  date: string
  summary: string
  image?: string
}

export type MDXData<T> = {
  metadata: T
  slug: string
  content: string
}

export type BlogPost = MDXData<BlogMetadata>
export type CVJob = MDXData<CVMetadata>
export type PortfolioProject = MDXData<PortfolioMetadata>

// Shared frontmatter parser
export function parseFrontmatter<T = Record<string, string>>(
  fileContent: string
): {
  metadata: T
  content: string
} {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)

  if (!match) {
    throw new Error('No frontmatter found in file')
  }

  const frontMatterBlock = match[1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: Partial<T> = {}

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[key.trim() as keyof T] = value as T[keyof T]
  })

  return { metadata: metadata as T, content }
}

// Shared MDX file utilities
export function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return []
  }
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

export function readMDXFile<T>(filePath: string): {
  metadata: T
  content: string
} {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter<T>(rawContent)
}

function getMDXData<T>(dir: string): MDXData<T>[] {
  const mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile<T>(path.join(dir, file))
    const slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

// Blog-specific functions
export function getBlogPosts(): BlogPost[] {
  return getMDXData<BlogMetadata>(path.join(process.cwd(), 'content', 'blog'))
}

// CV-specific functions
export function getCVJobs(): CVJob[] {
  return getMDXData<CVMetadata>(path.join(process.cwd(), 'app', 'cv', 'jobs'))
}

// Portfolio-specific functions
export function getPortfolioProjects(): PortfolioProject[] {
  return getMDXData<PortfolioMetadata>(path.join(process.cwd(), 'content', 'portfolio'))
}

export function getPortfolioProject(slug: string): PortfolioProject | null {
  try {
    const fullPath = path.join(process.cwd(), 'content', 'portfolio', `${slug}.mdx`)
    const { metadata, content } = readMDXFile<PortfolioMetadata>(fullPath)

    return {
      metadata,
      slug,
      content,
    }
  } catch (error) {
    console.error(`[mdx] Failed to load portfolio project "${slug}":`, error)
    return null
  }
}

// Date formatting utilities
export function formatDate(date: string, includeRelative = false): string {
  const currentDate = new Date()

  // Handle "Present" for CV dates
  if (date.includes('Present')) {
    return 'Present'
  }

  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  const targetDate = new Date(date)

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

// CV-specific date formatter (shorter format)
export function formatCVDate(date: string, includeRelative = false): string {
  const currentDate = new Date()

  if (date.includes('Present')) {
    return 'Present'
  }

  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  const targetDate = new Date(date)

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'short',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

// Legacy support: Keep the gray-matter based functions for backward compatibility
// These maintain the exact interface from app/lib/blog.ts
export type Post = {
  title: string
  date: string
  readingTime: string
  content: string
  excerpt: string
  slug: string
}

// Simple in-memory cache
let postsCache: Post[] | null = null
let postCache: Record<string, Post> = {}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

export async function getAllPosts(): Promise<Post[]> {
  // Return cached posts if available
  if (postsCache) {
    return postsCache
  }

  const blogPosts = getBlogPosts()

  const allPostsData = blogPosts.map((post) => {
    const readingTime = calculateReadingTime(post.content)

    const postData: Post = {
      slug: post.slug,
      title: post.metadata.title,
      date: post.metadata.date,
      excerpt: post.metadata.excerpt || '',
      content: post.content,
      readingTime,
    }

    // Cache individual post
    postCache[post.slug] = postData

    return postData
  })

  // Sort and cache posts
  postsCache = allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
  return postsCache
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Return cached post if available
  if (postCache[slug]) {
    return postCache[slug]
  }

  try {
    const fullPath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`)
    const { metadata, content } = readMDXFile<BlogMetadata>(fullPath)

    const readingTime = calculateReadingTime(content)

    const post: Post = {
      slug,
      title: metadata.title,
      date: metadata.date,
      excerpt: metadata.excerpt || '',
      content,
      readingTime,
    }

    // Cache the post
    postCache[slug] = post

    return post
  } catch (error) {
    console.error(`[mdx] Failed to load post "${slug}":`, error)
    return null
  }
}

// Clear cache in development when module is reloaded
if (process.env.NODE_ENV === 'development') {
  postsCache = null
  postCache = {}
}

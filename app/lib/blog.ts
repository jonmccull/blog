import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type Post = {
  title: string
  date: string
  excerpt: string
  slug: string
  content: string
  readingTime: string
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

// Simple in-memory cache
let postsCache: Post[] | null = null
let postCache: Record<string, Post> = {}

export async function getAllPosts(): Promise<Post[]> {
  // Return cached posts if available
  if (postsCache) {
    return postsCache
  }

  // Ensure the directory exists
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      const readingTime = calculateReadingTime(content)

      const post = {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt || '',
        content,
        readingTime,
      }

      // Cache individual post
      postCache[slug] = post

      return post
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
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const readingTime = calculateReadingTime(content)

    const post = {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || '',
      content,
      readingTime,
    }

    // Cache the post
    postCache[slug] = post

    return post
  } catch {
    return null
  }
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

// Clear cache in development when module is reloaded
if (process.env.NODE_ENV === 'development') {
  postsCache = null
  postCache = {}
}

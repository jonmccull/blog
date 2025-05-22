import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface Post {
  title: string
  date: string
  slug: string
  excerpt: string
  content: string
}

export async function getAllPosts(): Promise<Post[]> {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      // Remove ".mdx" from file name to get slug
      const slug = fileName.replace(/\.mdx$/, '')

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // Use gray-matter to parse the post metadata section
      const { data, content } = matter(fileContents)

      // Combine the data with the slug
      return {
        slug,
        content,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt || '',
      }
    })
    // Sort posts by date
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return allPostsData
}

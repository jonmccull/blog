import { getBlogPosts } from 'app/lib/mdx'

export const baseUrl = 'https://www.jonm.cc'

export default async function sitemap() {
  const blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.date,
  }))

  const routes = ['', '/blog', '/cv'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}

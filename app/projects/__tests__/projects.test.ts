import fs from 'fs'
import path from 'path'
import { projects } from '../projects'

const links = projects.flatMap((project) => project.links)

describe('Projects list', () => {
  it.each([
    ['/blog/', 'content/blog'],
    ['/portfolio/', 'content/portfolio'],
  ])('points each %s link at a file that exists', (prefix, dir) => {
    for (const link of links.filter((link) => link.href.startsWith(prefix))) {
      const file = path.join(process.cwd(), dir, `${link.href.slice(prefix.length)}.mdx`)
      expect(fs.existsSync(file)).toBe(true)
    }
  })

  it('only links to pages that exist or to other sites', () => {
    for (const { href } of links) {
      expect(href).toMatch(/^(https:\/\/|\/blog\/|\/portfolio\/)/)
    }
  })

  it('gives every project a description and at least one link', () => {
    for (const project of projects) {
      expect(project.description.length).toBeGreaterThan(0)
      expect(project.links.length).toBeGreaterThan(0)
    }
  })
})

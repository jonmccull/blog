import fs from 'fs'
import path from 'path'
import {
  formatDate,
  formatCVDate,
  parseFrontmatter,
  getBlogPosts,
  getCVJobs,
  getMDXFiles,
  readMDXFile,
  type BlogMetadata,
  type CVMetadata,
} from '../mdx'

// Mock fs module
jest.mock('fs')
const mockedFs = jest.mocked(fs)

describe('MDX Utilities', () => {
  beforeAll(() => {
    // Use a fixed current date so relative time tests are stable over time
    jest.useFakeTimers().setSystemTime(new Date('2025-06-15T00:00:00Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('formatDate', () => {
    it('should handle "Present" date', () => {
      const result = formatDate('Present')
      expect(result).toBe('Present')
    })

    it('should format a date without relative time', () => {
      const result = formatDate('2024-01-15', false)
      expect(result).toMatch(/January 15, 2024/)
    })

    it('should format a date with relative time', () => {
      const result = formatDate('2024-01-15', true)
      expect(result).toContain('January 15, 2024')
      expect(result).toContain('ago')
    })

    it('should handle dates without time component', () => {
      const result = formatDate('2024-06-01')
      expect(result).toMatch(/June 1, 2024/)
    })

    it('should handle dates with time component', () => {
      const result = formatDate('2024-06-01T12:00:00')
      expect(result).toMatch(/June 1, 2024/)
    })

    it('should calculate "Today" for current date', () => {
      const today = new Date().toISOString().split('T')[0]
      const result = formatDate(today, true)
      expect(result).toContain('Today')
    })

    it('should calculate days ago for recent dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 5)
      const dateString = yesterday.toISOString().split('T')[0]
      const result = formatDate(dateString, true)
      expect(result).toMatch(/\d+d ago/)
    })

    it('should calculate months ago for dates within a year', () => {
      const monthsAgo = new Date()
      monthsAgo.setMonth(monthsAgo.getMonth() - 3)
      const dateString = monthsAgo.toISOString().split('T')[0]
      const result = formatDate(dateString, true)
      expect(result).toMatch(/\d+mo ago/)
    })

    it('should calculate years ago for older dates', () => {
      const yearsAgo = new Date()
      yearsAgo.setFullYear(yearsAgo.getFullYear() - 2)
      const dateString = yearsAgo.toISOString().split('T')[0]
      const result = formatDate(dateString, true)
      expect(result).toMatch(/\d+y ago/)
    })
  })

  describe('formatCVDate', () => {
    it('should handle "Present" date', () => {
      const result = formatCVDate('Present')
      expect(result).toBe('Present')
    })

    it('should format a date with short month format', () => {
      const result = formatCVDate('2024-01-15', false)
      expect(result).toMatch(/Jan 2024/)
    })

    it('should format a date with relative time', () => {
      const result = formatCVDate('2024-01-15', true)
      expect(result).toContain('Jan 2024')
      expect(result).toContain('ago')
    })

    it('should handle dates without time component', () => {
      const result = formatCVDate('2024-06-01')
      expect(result).toMatch(/Jun 2024/)
    })

    it('should use abbreviated month names', () => {
      const result = formatCVDate('2024-12-01')
      expect(result).toMatch(/Dec 2024/)
    })

    it('should calculate relative time correctly', () => {
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      const dateString = oneYearAgo.toISOString().split('T')[0]
      const result = formatCVDate(dateString, true)
      expect(result).toMatch(/\d+y ago/)
    })
  })

  describe('parseFrontmatter', () => {
    it('should parse valid frontmatter from MDX content', () => {
      const mdxContent = `---
title: Test Post
date: 2024-01-15
excerpt: This is a test excerpt
---

This is the content.`

      const result = parseFrontmatter<BlogMetadata>(mdxContent)

      expect(result.metadata.title).toBe('Test Post')
      expect(result.metadata.date).toBe('2024-01-15')
      expect(result.metadata.excerpt).toBe('This is a test excerpt')
      expect(result.content).toBe('This is the content.')
    })

    it('should remove quotes from frontmatter values', () => {
      const mdxContent = `---
title: "Quoted Title"
date: '2024-01-15'
excerpt: "Test excerpt"
---

Content here.`

      const result = parseFrontmatter<BlogMetadata>(mdxContent)

      expect(result.metadata.title).toBe('Quoted Title')
      expect(result.metadata.date).toBe('2024-01-15')
      expect(result.metadata.excerpt).toBe('Test excerpt')
    })

    it('should handle frontmatter with colons in values', () => {
      const mdxContent = `---
title: Test: Advanced Topics
description: Learn more: A comprehensive guide
---

Content.`

      const result = parseFrontmatter(mdxContent)

      expect(result.metadata.title).toBe('Test: Advanced Topics')
      expect(result.metadata.description).toBe('Learn more: A comprehensive guide')
    })

    it('should throw error when no frontmatter is found', () => {
      const mdxContent = 'Just some content without frontmatter'

      expect(() => parseFrontmatter(mdxContent)).toThrow('No frontmatter found in file')
    })

    it('should handle empty content after frontmatter', () => {
      const mdxContent = `---
title: Test
---`

      const result = parseFrontmatter(mdxContent)

      expect(result.metadata.title).toBe('Test')
      expect(result.content).toBe('')
    })

    it('should parse CV metadata correctly', () => {
      const mdxContent = `---
title: Software Engineer
position: Senior Developer
companyLink: https://example.com
startDate: 2022-01-01
endDate: Present
description: Building great software
---

Job details here.`

      const result = parseFrontmatter<CVMetadata>(mdxContent)

      expect(result.metadata.title).toBe('Software Engineer')
      expect(result.metadata.position).toBe('Senior Developer')
      expect(result.metadata.companyLink).toBe('https://example.com')
      expect(result.metadata.startDate).toBe('2022-01-01')
      expect(result.metadata.endDate).toBe('Present')
      expect(result.metadata.description).toBe('Building great software')
    })

    it('should handle multiline content correctly', () => {
      const mdxContent = `---
title: Test Post
date: 2024-01-15
---

Line 1
Line 2
Line 3`

      const result = parseFrontmatter(mdxContent)

      expect(result.content).toBe('Line 1\nLine 2\nLine 3')
    })
  })

  describe('getMDXFiles', () => {
    it('should return empty array when directory does not exist', () => {
      mockedFs.existsSync.mockReturnValue(false)

      const result = getMDXFiles('/nonexistent/path')

      expect(result).toEqual([])
      expect(mockedFs.existsSync).toHaveBeenCalledWith('/nonexistent/path')
    })

    it('should return only .mdx files from directory', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue([
        'post1.mdx',
        'post2.mdx',
        'readme.md',
        'image.png',
        'post3.mdx',
      ] as any)

      const result = getMDXFiles('/test/path')

      expect(result).toEqual(['post1.mdx', 'post2.mdx', 'post3.mdx'])
      expect(mockedFs.readdirSync).toHaveBeenCalledWith('/test/path')
    })

    it('should return empty array when no .mdx files exist', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['readme.md', 'image.png', 'data.json'] as any)

      const result = getMDXFiles('/test/path')

      expect(result).toEqual([])
    })
  })

  describe('readMDXFile', () => {
    it('should read and parse an MDX file correctly', () => {
      const mockContent = `---
title: Test Post
date: 2024-01-15
excerpt: Test excerpt
---

This is the content.`

      mockedFs.readFileSync.mockReturnValue(mockContent)

      const result = readMDXFile<BlogMetadata>('/test/file.mdx')

      expect(mockedFs.readFileSync).toHaveBeenCalledWith('/test/file.mdx', 'utf-8')
      expect(result.metadata.title).toBe('Test Post')
      expect(result.metadata.date).toBe('2024-01-15')
      expect(result.metadata.excerpt).toBe('Test excerpt')
      expect(result.content).toBe('This is the content.')
    })

    it('should handle CV job MDX files', () => {
      const mockContent = `---
title: Company Name
position: Software Engineer
companyLink: https://example.com
startDate: 2022-01-01
endDate: 2024-01-01
description: Worked on amazing projects
---

Job responsibilities and achievements.`

      mockedFs.readFileSync.mockReturnValue(mockContent)

      const result = readMDXFile<CVMetadata>('/test/job.mdx')

      expect(result.metadata.title).toBe('Company Name')
      expect(result.metadata.position).toBe('Software Engineer')
      expect(result.metadata.companyLink).toBe('https://example.com')
      expect(result.metadata.startDate).toBe('2022-01-01')
      expect(result.metadata.endDate).toBe('2024-01-01')
      expect(result.content).toBe('Job responsibilities and achievements.')
    })
  })

  describe('getBlogPosts', () => {
    beforeEach(() => {
      // Mock process.cwd()
      jest.spyOn(process, 'cwd').mockReturnValue('/mock/project')
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should return empty array when blog directory does not exist', () => {
      mockedFs.existsSync.mockReturnValue(false)

      const result = getBlogPosts()

      expect(result).toEqual([])
      expect(mockedFs.existsSync).toHaveBeenCalledWith('/mock/project/content/blog')
    })

    it('should return blog posts with correct structure', () => {
      const mockPost1 = `---
title: First Post
date: 2024-01-15
excerpt: First post excerpt
---

First post content.`

      const mockPost2 = `---
title: Second Post
date: 2024-02-20
excerpt: Second post excerpt
image: /images/second.jpg
---

Second post content.`

      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['first-post.mdx', 'second-post.mdx'] as any)
      mockedFs.readFileSync.mockReturnValueOnce(mockPost1).mockReturnValueOnce(mockPost2)

      const result = getBlogPosts()

      expect(result).toHaveLength(2)

      expect(result[0].slug).toBe('first-post')
      expect(result[0].metadata.title).toBe('First Post')
      expect(result[0].metadata.date).toBe('2024-01-15')
      expect(result[0].metadata.excerpt).toBe('First post excerpt')
      expect(result[0].content).toBe('First post content.')

      expect(result[1].slug).toBe('second-post')
      expect(result[1].metadata.title).toBe('Second Post')
      expect(result[1].metadata.date).toBe('2024-02-20')
      expect(result[1].metadata.excerpt).toBe('Second post excerpt')
      expect(result[1].metadata.image).toBe('/images/second.jpg')
      expect(result[1].content).toBe('Second post content.')
    })

    it('should handle posts with optional image field', () => {
      const mockPost = `---
title: Post Without Image
date: 2024-01-15
excerpt: Test excerpt
---

Content here.`

      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['test-post.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue(mockPost)

      const result = getBlogPosts()

      expect(result).toHaveLength(1)
      expect(result[0].metadata.image).toBeUndefined()
    })

    it('should extract slug from filename correctly', () => {
      const mockPost = `---
title: Test
date: 2024-01-15
excerpt: Test
---

Content.`

      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['my-awesome-post.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue(mockPost)

      const result = getBlogPosts()

      expect(result[0].slug).toBe('my-awesome-post')
    })
  })

  describe('getCVJobs', () => {
    beforeEach(() => {
      jest.spyOn(process, 'cwd').mockReturnValue('/mock/project')
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should return empty array when CV jobs directory does not exist', () => {
      mockedFs.existsSync.mockReturnValue(false)

      const result = getCVJobs()

      expect(result).toEqual([])
      expect(mockedFs.existsSync).toHaveBeenCalledWith('/mock/project/app/cv/jobs')
    })

    it('should return CV jobs with correct structure', () => {
      const mockJob1 = `---
title: Tech Corp
position: Senior Engineer
companyLink: https://techcorp.com
startDate: 2022-01-01
endDate: 2024-01-01
description: Led development team
---

Achievements and responsibilities.`

      const mockJob2 = `---
title: Startup Inc
position: Tech Lead
companyLink: https://startup.com
startDate: 2020-01-01
endDate: 2022-01-01
description: Built products from scratch
---

More details here.`

      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['techcorp.mdx', 'startup.mdx'] as any)
      mockedFs.readFileSync.mockReturnValueOnce(mockJob1).mockReturnValueOnce(mockJob2)

      const result = getCVJobs()

      expect(result).toHaveLength(2)

      expect(result[0].slug).toBe('techcorp')
      expect(result[0].metadata.title).toBe('Tech Corp')
      expect(result[0].metadata.position).toBe('Senior Engineer')
      expect(result[0].metadata.companyLink).toBe('https://techcorp.com')
      expect(result[0].metadata.startDate).toBe('2022-01-01')
      expect(result[0].metadata.endDate).toBe('2024-01-01')
      expect(result[0].metadata.description).toBe('Led development team')
      expect(result[0].content).toBe('Achievements and responsibilities.')

      expect(result[1].slug).toBe('startup')
      expect(result[1].metadata.title).toBe('Startup Inc')
      expect(result[1].metadata.position).toBe('Tech Lead')
    })

    it('should handle jobs with Present as end date', () => {
      const mockJob = `---
title: Current Company
position: Principal Engineer
companyLink: https://current.com
startDate: 2023-01-01
endDate: Present
description: Currently working here
---

Current role details.`

      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['current.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue(mockJob)

      const result = getCVJobs()

      expect(result).toHaveLength(1)
      expect(result[0].metadata.endDate).toBe('Present')
    })

    it('should extract slug from filename correctly', () => {
      const mockJob = `---
title: Company
position: Engineer
companyLink: https://example.com
startDate: 2020-01-01
endDate: 2021-01-01
description: Test
---

Content.`

      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['my-company-name.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue(mockJob)

      const result = getCVJobs()

      expect(result[0].slug).toBe('my-company-name')
    })
  })
})

import type { ReactNode } from 'react'
import Image from './Image'
import MdxImage from './MdxImage'
import { headingClass } from './mdx'

// Blog post headings take the same kit classes as the other MDX pages, without anchor links.
function heading(level: 1 | 2 | 3 | 4) {
  const Tag = `h${level}` as const
  const Heading = ({ children }: { children: ReactNode }) => (
    <Tag className={headingClass[level]}>{children}</Tag>
  )
  Heading.displayName = `PostHeading${level}`
  return Heading
}

export const mdxComponents = {
  Image,
  img: MdxImage,
  h1: heading(1),
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),
} as const

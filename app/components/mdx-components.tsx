import NextImage from 'next/image'
import type { ReactNode } from 'react'
import Image from './Image'
import ThemeImage from './ThemeImage'
import { headingClass } from './mdx'

function MdxImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt } = props
  if (!src || typeof src !== 'string') return null
  return (
    <NextImage
      src={src}
      alt={alt || ''}
      width={800}
      height={450}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 672px"
      quality={85}
      style={{ width: '100%', height: 'auto' }}
    />
  )
}

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
  ThemeImage,
  img: MdxImage,
  h1: heading(1),
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),
} as const

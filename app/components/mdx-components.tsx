import NextImage from 'next/image'
import Image from './Image'

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
      className="rounded-lg"
      style={{ width: '100%', height: 'auto' }}
    />
  )
}

export const mdxComponents = {
  Image,
  img: MdxImage,
} as const

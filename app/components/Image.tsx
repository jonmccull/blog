import NextImage, { ImageProps as NextImageProps } from 'next/image'

type ImageProps = {
  alt: string
  caption?: string
  /** Set to true for above-fold images to prioritize loading */
  priority?: boolean
} & Omit<NextImageProps, 'alt' | 'priority'>

// An image straight on the ground: square, no frame, no load animation. The caption is a mono label.
export default function Image({ alt, caption, priority = false, ...props }: ImageProps) {
  return (
    <figure className="figure">
      <NextImage
        alt={alt}
        priority={priority}
        quality={85}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 672px"
        {...props}
      />
      {caption && <figcaption className="fdn-caption">{caption}</figcaption>}
    </figure>
  )
}

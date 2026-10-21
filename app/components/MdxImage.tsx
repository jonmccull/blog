import { readFileSync } from 'node:fs'
import path from 'node:path'
import NextImage from 'next/image'
import { imageSize } from 'image-size'

const publicDir = path.join(process.cwd(), 'public')

// Reads a local image's real size at build time, so the page reserves the right box before it loads.
function localImageSize(src: string): { width: number; height: number } | null {
  const file = path.join(publicDir, decodeURI(src))
  if (!file.startsWith(publicDir + path.sep)) return null
  try {
    const { width, height } = imageSize(readFileSync(file))
    return width && height ? { width, height } : null
  } catch {
    return null
  }
}

// A markdown image (`![alt](src)`) in any MDX page. Local files go through next/image at their own size; anything else stays a plain img.
export default function MdxImage({ src, alt, title }: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src || typeof src !== 'string') return null
  const size = src.startsWith('/') ? localImageSize(src) : null
  if (!size) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || ''} title={title} loading="lazy" />
  }
  return (
    <NextImage
      src={src}
      alt={alt || ''}
      title={title}
      width={size.width}
      height={size.height}
      sizes="(max-width: 640px) 100vw, 576px"
      quality={85}
      style={{ width: '100%', height: 'auto' }}
    />
  )
}

// Turns an original into a Photos page file: 3000px on the long edge, WebP at 85, metadata dropped
// (the camera's EXIF can carry GPS coordinates). The EXIF is read first, for the caption.
import { basename, join } from 'node:path'
import sharp from 'sharp'
import exifReader from 'exif-reader'
import { metaFrom, slugOf } from './caption.mjs'

export const LONG_EDGE = 3000
export const QUALITY = 85
export const OUT_DIR = join(process.cwd(), 'public', 'images', 'photos')
export const LIST_FILE = join(process.cwd(), 'app', 'photos', 'photos.ts')
export const INPUT_TYPES = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif'])

export async function prepare(input, outDir = OUT_DIR) {
  const slug = slugOf(basename(input))
  const output = join(outDir, `${slug}.webp`)
  const source = sharp(input)
  const { exif } = await source.metadata()
  let meta = {}
  if (exif) {
    try {
      meta = metaFrom(exifReader(exif))
    } catch {
      meta = {}
    }
  }
  const { width, height } = await source
    .clone()
    .rotate() // bake the orientation in before the EXIF goes
    .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output)
  return { slug, output, width, height, meta }
}

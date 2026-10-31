// Turns an original into a Photos page file: 3000px on the long edge, WebP at 85, metadata dropped
// (the camera's EXIF can carry GPS coordinates). The EXIF is read first, for the caption.
import { basename, join } from 'node:path'
import sharp from 'sharp'
import exifReader from 'exif-reader'
import { fallbackSlug, metaFrom, slugOf } from './caption.mjs'
import { existsSync } from 'node:fs'

export const LONG_EDGE = 3000
export const QUALITY = 85
export const OUT_DIR = join(process.cwd(), 'public', 'images', 'photos')
export const LIST_FILE = join(process.cwd(), 'app', 'photos', 'photos.ts')
export const INPUT_TYPES = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif'])

// taken(slug): true when a slug is already in use by the caller (the list being built), on
// top of the files already in outDir; only consulted for a file that arrived without a name
export async function prepare(input, outDir = OUT_DIR, { taken = () => false } = {}) {
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
  const stem = slugOf(basename(input))
  const slug =
    fallbackSlug(stem, meta, (s) => taken(s) || existsSync(join(outDir, `${s}.webp`))) ?? stem
  const output = join(outDir, `${slug}.webp`)
  const { width, height } = await source
    .clone()
    .rotate() // bake the orientation in before the EXIF goes
    .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output)
  return { slug, output, width, height, meta }
}

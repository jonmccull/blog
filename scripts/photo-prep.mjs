#!/usr/bin/env node
// Prepare photos for the Photos page: resize to 2048px on the long edge, write WebP at quality 85
// into public/images/photos/, and drop the metadata (the camera's EXIF can carry GPS coordinates).
// Usage: node scripts/photo-prep.mjs <original.jpg> [more originals...]
// Each file is named after its original (lowercased, spaces to dashes). Prints the import line and
// list entry to paste into app/photos/photos.ts.
import { basename, extname, join } from 'node:path'
import sharp from 'sharp'

const LONG_EDGE = 2048
const QUALITY = 85
const OUT_DIR = join(process.cwd(), 'public', 'images', 'photos')

const inputs = process.argv.slice(2)
if (inputs.length === 0) {
  console.error('Usage: node scripts/photo-prep.mjs <original.jpg> [more originals...]')
  process.exit(1)
}

// Local date, so a run after midnight here is not stamped with yesterday in UTC
const today = new Date().toLocaleDateString('sv-SE')

for (const input of inputs) {
  const slug = basename(input, extname(input))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const output = join(OUT_DIR, `${slug}.webp`)
  const { width, height } = await sharp(input)
    .rotate() // bake the orientation in before the EXIF goes
    .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output)
  const name = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()).replace(/^\d/, 'p$&')
  console.log(`${output}  ${width}×${height}`)
  console.log(`import ${name} from '@/public/images/photos/${slug}.webp'`)
  console.log(
    `  { image: ${name}, alt: '', camera: 'Fujifilm X100VI', location: 'Haugesund', date: '${today}' },`
  )
  console.log()
}

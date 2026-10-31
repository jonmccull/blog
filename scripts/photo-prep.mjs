#!/usr/bin/env node
// Prepare photos for the Photos page by hand. Writes public/images/photos/<slug>.webp (see
// scripts/lib/photo.mjs) and prints the import line and list entry to paste into
// app/photos/photos.ts, with the camera, exposure and date read from the original's EXIF.
// Usage: node scripts/photo-prep.mjs <original.jpg> [more originals...]
import { entryLines } from './lib/caption.mjs'
import { prepare } from './lib/photo.mjs'

const inputs = process.argv.slice(2)
if (inputs.length === 0) {
  console.error('Usage: node scripts/photo-prep.mjs <original.jpg> [more originals...]')
  process.exit(1)
}

for (const input of inputs) {
  const { slug, output, width, height, meta } = await prepare(input)
  const { importLine, entry } = entryLines(slug, meta)
  console.log(`${output}  ${width}×${height}`)
  console.log(importLine)
  console.log(entry)
  console.log()
}

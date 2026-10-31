// Caption fields and list edits for the Photos page, with nothing in here that touches a file:
// the EXIF comes in as exif-reader's object, the list as the text of app/photos/photos.ts.

// File name to slug: "DSCF0141.JPG" -> "dscf0141"
export function slugOf(name) {
  return name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Slug to identifier: "2026-10-30-dscf0141" -> "p20261030Dscf0141"
export function varName(slug) {
  const camel = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
  return /^\d/.test(camel) ? `p${camel}` : camel
}

// "FUJIFILM" + "X100VI" -> "Fujifilm X100VI"; "Canon" + "Canon EOS R6" -> "Canon EOS R6"
export function cameraName(make, model) {
  const m = (model ?? '').trim()
  let k = (make ?? '').trim()
  if (!m) return k
  if (k && k === k.toUpperCase()) k = k[0] + k.slice(1).toLowerCase()
  if (!k || m.toLowerCase().startsWith(k.toLowerCase())) return m
  return `${k} ${m}`
}

// 1/34 s or 2 s
export function shutter(seconds) {
  if (!(seconds > 0)) return ''
  if (seconds >= 1) return `${Number(seconds.toFixed(1))} s`
  return `1/${Math.round(1 / seconds)} s`
}

// "23mm · f/8 · 1/34 s · ISO 640", from whichever of the four are present
export function formatSettings(photo = {}) {
  const parts = []
  if (photo.FocalLength > 0) parts.push(`${Math.round(photo.FocalLength)}mm`)
  if (photo.FNumber > 0) parts.push(`f/${Number(photo.FNumber.toFixed(1))}`)
  const s = shutter(photo.ExposureTime)
  if (s) parts.push(s)
  const iso = photo.ISOSpeedRatings ?? photo.PhotographicSensitivity
  if (iso > 0) parts.push(`ISO ${iso}`)
  return parts.join(' · ')
}

// exif-reader's object to the caption fields. The camera's clock is local time, which exif-reader
// parses as UTC, so the date is read back with the UTC getters.
export function metaFrom(exif = {}) {
  const image = exif.Image ?? {}
  const photo = exif.Photo ?? {}
  const meta = {}
  const camera = cameraName(image.Make, image.Model)
  if (camera) meta.camera = camera
  const lens = (photo.LensModel ?? '').trim()
  if (lens) meta.lens = lens
  const settings = formatSettings(photo)
  if (settings) meta.settings = settings
  const d = photo.DateTimeOriginal
  if (d instanceof Date && !Number.isNaN(d.getTime())) {
    meta.date = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
  }
  return meta
}

const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

// The import line and the list entry for one photo, in the shape of app/photos/photos.ts
export function entryLines(slug, meta = {}, { alt = '', location = '' } = {}) {
  const name = varName(slug)
  const fields = [
    `image: ${name}`,
    `alt: ${q(alt)}`,
    `camera: ${q(meta.camera ?? '')}`,
    meta.lens && `lens: ${q(meta.lens)}`,
    meta.film && `film: ${q(meta.film)}`,
    meta.settings && `settings: ${q(meta.settings)}`,
    `location: ${q(location)}`,
    meta.date && `date: ${q(meta.date)}`,
  ].filter(Boolean)
  return {
    importLine: `import ${name} from '@/public/images/photos/${slug}.webp'`,
    entry: `  {\n${fields.map((f) => `    ${f},`).join('\n')}\n  },`,
  }
}

const LIST_OPEN = /export const photos: Photo\[\] = \[/

// Adds a photo at the top of the list (newest first) and its import after the last image import
export function addToList(source, slug, meta, options) {
  const { importLine, entry } = entryLines(slug, meta, options)
  if (source.includes(importLine)) throw new Error(`${slug} is already in the list`)
  const imports = [...source.matchAll(/^import .* from '@\/public\/images\/photos\/.*'\n/gm)]
  const anchor = imports.length
    ? imports[imports.length - 1]
    : source.match(/^import type \{ StaticImageData \} from 'next\/image'\n/m)
  if (!anchor) throw new Error('no import to put the new one after')
  const at = anchor.index + anchor[0].length
  let out = source.slice(0, at) + importLine + '\n' + source.slice(at)
  if (/export const photos: Photo\[\] = \[\]/.test(out)) {
    return out.replace(
      /export const photos: Photo\[\] = \[\]/,
      `export const photos: Photo[] = [\n${entry}\n]`
    )
  }
  const open = out.match(LIST_OPEN)
  if (!open) throw new Error('no photos list found')
  const after = open.index + open[0].length
  return out.slice(0, after) + '\n' + entry + out.slice(after)
}

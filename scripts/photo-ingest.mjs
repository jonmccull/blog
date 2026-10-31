#!/usr/bin/env node
// The photos inbox (.github/workflows/photos.yml): every image in photos/inbox/ becomes a Photos page
// file and a list entry at the top of app/photos/photos.ts, with alt text and location left for the
// pull request. The original is deleted. Writes a markdown summary for the PR body.
// Usage: node scripts/photo-ingest.mjs [--branch <name>] [--summary <file>]
import { readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { addToList } from './lib/caption.mjs'
import { INPUT_TYPES, LIST_FILE, prepare } from './lib/photo.mjs'

const args = process.argv.slice(2)
const option = (name, fallback) => {
  const i = args.indexOf(name)
  return i === -1 ? fallback : args[i + 1]
}
const branch = option('--branch', 'main')
const summaryFile = option('--summary', '/tmp/photo-ingest.md')
const inbox = join(process.cwd(), 'photos', 'inbox')
const repo = process.env.GITHUB_REPOSITORY ?? 'jonmccull/blog'
const rawBase = `https://raw.githubusercontent.com/${repo}/${branch}/public/images/photos`

const files = readdirSync(inbox).filter((f) => !f.startsWith('.') && f !== 'README.md')
const done = []
const skipped = []
let list = readFileSync(LIST_FILE, 'utf-8')

for (const file of files) {
  const input = join(inbox, file)
  if (!INPUT_TYPES.has(extname(file).toLowerCase())) {
    skipped.push(`${file}: not an image type the script reads (${[...INPUT_TYPES].join(', ')})`)
    continue
  }
  try {
    const { slug, width, height, meta } = await prepare(input)
    list = addToList(list, slug, meta)
    unlinkSync(input)
    done.push({ file, slug, width, height, meta })
  } catch (error) {
    skipped.push(`${file}: ${error.message}`)
  }
}

if (done.length) {
  writeFileSync(LIST_FILE, list)
  execFileSync('npx', ['prettier', '--write', LIST_FILE], { stdio: 'inherit' })
}

const lines = [
  done.length
    ? `${done.length} photo${done.length === 1 ? '' : 's'} from \`photos/inbox/\`, resized and stripped of metadata. **Before merging, fill in \`alt\` and \`location\` for each in \`app/photos/photos.ts\`** (edit the file on this branch). Rename the file and its import too if you want a better name than the camera's.`
    : 'Nothing to ingest.',
  '',
]
for (const p of done) {
  const caption =
    [p.meta.camera, p.meta.lens, p.meta.settings].filter(Boolean).join(' · ') || 'no EXIF found'
  lines.push(
    `### ${p.slug}`,
    '',
    `![${p.slug}](${rawBase}/${p.slug}.webp)`,
    '',
    `${caption}${p.meta.date ? ` · ${p.meta.date}` : ''} · ${p.width}×${p.height}`,
    ''
  )
}
if (skipped.length) lines.push('### Left in the inbox', '', ...skipped.map((s) => `- ${s}`), '')
writeFileSync(summaryFile, lines.join('\n'))
console.log(lines.join('\n'))
console.log(`\ningested=${done.length}`)

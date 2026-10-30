import fs from 'fs'
import path from 'path'
import { photos } from '../photos'

// Jest mocks every image import to one placeholder, so the files are checked through the source instead
const source = fs.readFileSync(path.join(process.cwd(), 'app', 'photos', 'photos.ts'), 'utf-8')
const imported = [...source.matchAll(/from '@\/public\/(images\/photos\/[^']+)'/g)].map((m) => m[1])

describe('Photos list', () => {
  it('gives every photo alt text, a camera and a location', () => {
    for (const photo of photos) {
      expect(photo.alt.length).toBeGreaterThan(0)
      expect(photo.camera.length).toBeGreaterThan(0)
      expect(photo.location.length).toBeGreaterThan(0)
    }
  })

  it('dates every dated photo with an ISO date', () => {
    for (const { date } of photos) {
      if (date === undefined) continue
      expect(date).toMatch(/^\d{4}-\d{2}(-\d{2})?$/)
      expect(Number.isNaN(new Date(date).getTime())).toBe(false)
    }
  })

  it('imports each picture once, from a file in public/images/photos', () => {
    expect(imported.length).toBe(photos.length)
    expect(new Set(imported).size).toBe(imported.length)
    for (const file of imported) {
      expect(fs.existsSync(path.join(process.cwd(), 'public', file))).toBe(true)
    }
  })
})

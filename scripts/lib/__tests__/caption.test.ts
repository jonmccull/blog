import {
  addToList,
  cameraName,
  entryLines,
  formatSettings,
  metaFrom,
  shutter,
  slugOf,
  varName,
} from '../caption.mjs'

const emptyList = `import type { StaticImageData } from 'next/image'

export type Photo = { image: StaticImageData }

export const photos: Photo[] = []
`

describe('photo captions', () => {
  it('names files and identifiers from the camera file name', () => {
    expect(slugOf('DSCF0141.JPG')).toBe('dscf0141')
    expect(slugOf('Firebird on the bench.jpeg')).toBe('firebird-on-the-bench')
    expect(varName('firebird-on-the-bench')).toBe('firebirdOnTheBench')
    expect(varName('2026-10-30-dscf0141')).toBe('p20261030Dscf0141')
  })

  it('writes the camera name the way the site does', () => {
    expect(cameraName('FUJIFILM', 'X100VI')).toBe('Fujifilm X100VI')
    expect(cameraName('Canon', 'Canon EOS R6')).toBe('Canon EOS R6')
    expect(cameraName(undefined, undefined)).toBe('')
  })

  it('formats exposure as the camera reports it', () => {
    expect(shutter(1 / 34)).toBe('1/34 s')
    expect(shutter(2)).toBe('2 s')
    expect(
      formatSettings({ FocalLength: 23, FNumber: 8, ExposureTime: 1 / 34, ISOSpeedRatings: 640 })
    ).toBe('23mm · f/8 · 1/34 s · ISO 640')
    expect(formatSettings({ FNumber: 5.6 })).toBe('f/5.6')
    expect(formatSettings({})).toBe('')
  })

  it('reads the caption fields from EXIF, keeping the camera clock as the date', () => {
    const meta = metaFrom({
      Image: { Make: 'FUJIFILM', Model: 'X100VI' },
      Photo: {
        FocalLength: 23,
        FNumber: 16,
        ExposureTime: 1 / 52,
        ISOSpeedRatings: 500,
        DateTimeOriginal: new Date('2026-10-29T23:30:00.000Z'),
      },
    })
    expect(meta).toEqual({
      camera: 'Fujifilm X100VI',
      settings: '23mm · f/16 · 1/52 s · ISO 500',
      date: '2026-10-29',
    })
    expect(metaFrom({})).toEqual({})
  })

  it('puts a new photo at the top of the list, newest first', () => {
    const first = addToList(emptyList, 'dscf0141', {
      camera: 'Fujifilm X100VI',
      date: '2026-10-30',
    })
    expect(first).toContain("import dscf0141 from '@/public/images/photos/dscf0141.webp'")
    expect(first).toMatch(/photos: Photo\[\] = \[\n  \{\n    image: dscf0141,\n    alt: '',\n/)
    const second = addToList(first, 'dscf0083', { camera: 'Fujifilm X100VI' })
    expect(second.indexOf('image: dscf0083')).toBeLessThan(second.indexOf('image: dscf0141'))
    expect(second.indexOf('import dscf0083')).toBeGreaterThan(second.indexOf('import dscf0141'))
    expect(() => addToList(second, 'dscf0083', {})).toThrow(/already/)
  })

  it('leaves out caption fields it does not have', () => {
    const { entry } = entryLines('x', { camera: 'Praktica MTL5B', film: 'HP5' })
    expect(entry).toContain("film: 'HP5'")
    expect(entry).not.toContain('settings:')
    expect(entry).not.toContain('date:')
  })
})

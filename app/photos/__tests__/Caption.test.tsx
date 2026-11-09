import { gear, monthYear } from '../Caption'
import { photos } from '../__fixtures__/photos'

describe('Caption', () => {
  it('builds the caption from whichever gear fields are given', () => {
    expect(gear(photos[0])).toBe('Fujifilm X100VI · 23mm · f/8 · 1/34 s · ISO 640')
    expect(gear(photos[1])).toBe('Praktica MTL5B · HP5')
    expect(monthYear('2026-10-30')).toBe('October 2026')
  })
})

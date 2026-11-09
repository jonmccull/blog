import { fireEvent, render, screen } from '@testing-library/react'
import Gallery from '../Gallery'
import { fitWidth, neighbourIndices } from '../Lightbox'
import { fakeDialogs, image, photos } from '../__fixtures__/photos'

beforeAll(fakeDialogs)

const dialog = () => screen.getByRole('dialog', { hidden: true })

// The lightbox's open photo lives in the gallery, so these drive it through the gallery
describe('Lightbox', () => {
  it('steps along the list with the arrow keys and wraps', () => {
    render(<Gallery photos={photos} />)
    fireEvent.click(screen.getByRole('button', { name: 'A red guitar' }))
    fireEvent.keyDown(dialog(), { key: 'ArrowRight' })
    expect(screen.getAllByRole('img', { name: 'Church windows' })).toHaveLength(2)
    fireEvent.keyDown(dialog(), { key: 'ArrowRight' })
    expect(screen.getAllByRole('img', { name: 'A red guitar' })).toHaveLength(2)
    fireEvent.keyDown(dialog(), { key: 'ArrowLeft' })
    expect(screen.getAllByRole('img', { name: 'Church windows' })).toHaveLength(2)
  })

  it('closes on a click beside the photo, not on the photo', () => {
    render(<Gallery photos={photos} />)
    fireEvent.click(screen.getByRole('button', { name: 'A red guitar' }))
    fireEvent.click(screen.getAllByRole('img', { name: 'A red guitar' })[1])
    expect(dialog()).toHaveAttribute('open')
    fireEvent.click(dialog())
    expect(dialog()).not.toHaveAttribute('open')
  })

  it('offers no side marks for a single photo', () => {
    render(<Gallery photos={[photos[0]]} />)
    expect(screen.queryByRole('button', { name: 'Next photo', hidden: true })).toBeNull()
  })
})

describe('neighbourIndices', () => {
  it('has none for one photo', () => {
    expect(neighbourIndices(0, 1)).toEqual([])
  })

  it('has the other photo once for two', () => {
    expect(neighbourIndices(0, 2)).toEqual([1])
    expect(neighbourIndices(1, 2)).toEqual([0])
  })

  it('has both others for three, next first', () => {
    expect(neighbourIndices(0, 3)).toEqual([1, 2])
    expect(neighbourIndices(1, 3)).toEqual([2, 0])
    expect(neighbourIndices(2, 3)).toEqual([0, 1])
  })

  it('wraps at both ends of a long list', () => {
    expect(neighbourIndices(0, 10)).toEqual([1, 9])
    expect(neighbourIndices(5, 10)).toEqual([6, 4])
    expect(neighbourIndices(9, 10)).toEqual([0, 8])
  })
})

describe('fitWidth', () => {
  const height = 'calc((100dvh - var(--space-9) - var(--space-5))'
  const width = 'calc(100vw - 2 * var(--space-5))'

  it("scales the height allowance by a landscape photo's ratio", () => {
    expect(fitWidth({ ...photos[0], image: image('/l.webp', 3000, 2000) })).toBe(
      `min(${width}, ${height} * 1.5000))`
    )
  })

  it("scales the height allowance by a portrait photo's ratio", () => {
    expect(fitWidth({ ...photos[0], image: image('/p.webp', 2000, 3000) })).toBe(
      `min(${width}, ${height} * 0.6667))`
    )
  })
})

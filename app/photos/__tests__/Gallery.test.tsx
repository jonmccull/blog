import { fireEvent, render, screen } from '@testing-library/react'
import type { StaticImageData } from 'next/image'
import Gallery, { gear, monthYear } from '../Gallery'
import type { Photo } from '../photos'

const image = (src: string): StaticImageData => ({
  src,
  width: 2048,
  height: 1365,
  blurDataURL: 'data:image/webp;base64,UklGRg==',
})

const photos: Photo[] = [
  {
    image: image('/a.webp'),
    alt: 'A red guitar',
    camera: 'Fujifilm X100VI',
    settings: '23mm · f/8 · 1/34 s · ISO 640',
    location: 'MusikkHuset, Haugesund',
    date: '2026-10-30',
  },
  {
    image: image('/b.webp'),
    alt: 'Church windows',
    camera: 'Praktica MTL5B',
    film: 'HP5',
    location: 'Haugesund',
  },
]

// jsdom has no modal dialogs; these stand in for showModal and close, firing close like a browser does
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
})

const dialog = () => screen.getByRole('dialog', { hidden: true })

describe('Gallery', () => {
  it('builds the caption from whichever gear fields are given', () => {
    expect(gear(photos[0])).toBe('Fujifilm X100VI · 23mm · f/8 · 1/34 s · ISO 640')
    expect(gear(photos[1])).toBe('Praktica MTL5B · HP5')
    expect(monthYear('2026-10-30')).toBe('October 2026')
  })

  it('opens a photo in the lightbox and closes it again', () => {
    render(<Gallery photos={photos} />)
    expect(dialog()).not.toHaveAttribute('open')
    fireEvent.click(screen.getByRole('button', { name: 'A red guitar' }))
    expect(dialog()).toHaveAttribute('open')
    expect(screen.getAllByRole('img', { name: 'A red guitar' })).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(dialog()).not.toHaveAttribute('open')
    expect(screen.getAllByRole('img', { name: 'A red guitar' })).toHaveLength(1)
  })

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

import { fireEvent, render, screen } from '@testing-library/react'
import Gallery from '../Gallery'
import { fakeDialogs, photos } from '../__fixtures__/photos'

beforeAll(fakeDialogs)

const dialog = () => screen.getByRole('dialog', { hidden: true })

describe('Gallery', () => {
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
})

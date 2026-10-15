import { render, screen } from '@testing-library/react'
import Footer from '../footer'

describe('Footer', () => {
  it('renders RSS link', () => {
    render(<Footer />)

    const rssLink = screen.getByRole('link', { name: /rss/i })
    expect(rssLink).toBeInTheDocument()
    expect(rssLink).toHaveAttribute('href', '/rss')
  })

  it('renders GitHub source link', () => {
    render(<Footer />)

    const githubLink = screen.getByRole('link', { name: /view source/i })
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('href', 'https://github.com/jonmccull/blog/')
  })

  it('links have correct href values', () => {
    render(<Footer />)

    const rssLink = screen.getByRole('link', { name: /rss/i })
    expect(rssLink).toHaveAttribute('href', '/rss')
    expect(rssLink).toHaveAttribute('target', '_blank')
    expect(rssLink).toHaveAttribute('rel', 'noopener noreferrer')

    const githubLink = screen.getByRole('link', { name: /view source/i })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/jonmccull/blog/')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders the now link', () => {
    render(<Footer />)

    expect(screen.getByRole('link', { name: /now page/i })).toHaveAttribute('href', '/now')
  })

  it('uses the kit type sizes and no theme-class styling', () => {
    const { container } = render(<Footer />)

    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${currentYear} Jon McCullough`))).toHaveClass('footnote')
    expect(container.querySelector('.site-footer-links')).toHaveClass('small')
    expect(container.innerHTML).not.toMatch(/\b(dark:|rounded|ring-)/)
  })

  it('renders copyright text with current year', () => {
    render(<Footer />)

    const currentYear = new Date().getFullYear()
    const copyrightText = screen.getByText(new RegExp(`© ${currentYear} Jon McCullough`, 'i'))
    expect(copyrightText).toBeInTheDocument()
  })
})

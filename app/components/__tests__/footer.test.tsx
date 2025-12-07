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

  it('renders copyright text with current year', () => {
    render(<Footer />)

    const currentYear = new Date().getFullYear()
    const copyrightText = screen.getByText(new RegExp(`© ${currentYear} Jon McCullough`, 'i'))
    expect(copyrightText).toBeInTheDocument()
  })
})

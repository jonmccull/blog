import { render, screen } from '@testing-library/react'
import { Navbar } from '../nav'
import { ThemeProvider } from '../../context/ThemeContext'

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    )

    // Check if home link is present
    const homeLink = screen.getByRole('link', { name: /home page/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')

    // Check if blog link is present
    const blogLink = screen.getByRole('link', { name: /blog posts/i })
    expect(blogLink).toBeInTheDocument()
    expect(blogLink).toHaveAttribute('href', '/blog')
  })

  it('renders the wordmark linking home', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    )

    const wordmark = screen.getByRole('link', { name: 'Jon McCullough' })
    expect(wordmark).toHaveAttribute('href', '/')
    expect(wordmark).toHaveClass('fdn-wordmark')
  })

  it('marks the current page and uses the kit bar', () => {
    const { container } = render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    )

    expect(screen.getByRole('link', { name: /home page/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /blog posts/i })).not.toHaveAttribute('aria-current')
    expect(container.querySelector('header')).toHaveClass('fdn-bar')
    expect(container.innerHTML).not.toMatch(/\b(dark:|rounded|ring-)/)
  })

  it('has proper accessibility attributes', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    )

    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    expect(nav).toBeInTheDocument()

    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()
  })
})

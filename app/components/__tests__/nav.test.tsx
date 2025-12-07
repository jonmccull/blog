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

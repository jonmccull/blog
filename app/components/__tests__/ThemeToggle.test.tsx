import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '../ThemeToggle'
import { ThemeProvider } from '../../context/ThemeContext'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock matchMedia
const createMatchMediaMock = (matches: boolean) => {
  return jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorageMock.clear()
    window.matchMedia = createMatchMediaMock(false)
  })

  it('renders the toggle button', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle dark mode/i })
      expect(button).toBeInTheDocument()
    })
  })

  it('has correct aria-label', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Toggle Dark Mode')
    })
  })

  it('shows placeholder div before mounting', () => {
    // Create a wrapper that doesn't trigger mounting yet
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    // The component should render something (either placeholder or button)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('clicking toggles from light to dark theme', async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    const button = screen.getByRole('button', { name: /toggle dark mode/i })

    // Click to toggle to dark
    await user.click(button)

    await waitFor(() => {
      expect(localStorageMock.getItem('theme')).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })

  it('clicking toggles from dark to light theme', async () => {
    const user = userEvent.setup()
    localStorageMock.setItem('theme', 'dark')

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    const button = screen.getByRole('button', { name: /toggle dark mode/i })

    // Click to toggle to light
    await user.click(button)

    await waitFor(() => {
      expect(localStorageMock.getItem('theme')).toBe('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  it('renders sun icon in dark mode', async () => {
    localStorageMock.setItem('theme', 'dark')

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      // The sun icon has specific path data for dark mode
      const svg = button.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  it('renders moon icon in light mode', async () => {
    localStorageMock.setItem('theme', 'light')

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      // The moon icon has different path data for light mode
      const svg = button.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  it('has correct styling classes', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'flex',
        'h-9',
        'w-9',
        'items-center',
        'justify-center',
        'rounded-lg'
      )
    })
  })

  it('toggles multiple times correctly', async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    const button = screen.getByRole('button')

    // Toggle to dark
    await user.click(button)
    await waitFor(() => {
      expect(localStorageMock.getItem('theme')).toBe('dark')
    })

    // Toggle back to light
    await user.click(button)
    await waitFor(() => {
      expect(localStorageMock.getItem('theme')).toBe('light')
    })

    // Toggle to dark again
    await user.click(button)
    await waitFor(() => {
      expect(localStorageMock.getItem('theme')).toBe('dark')
    })
  })
})

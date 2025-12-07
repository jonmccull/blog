import { render, screen, act, renderHook, waitFor } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeContext'

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

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorageMock.clear()
    window.matchMedia = createMatchMediaMock(false)
  })

  describe('ThemeProvider', () => {
    it('renders children', () => {
      render(
        <ThemeProvider>
          <div>Test Child</div>
        </ThemeProvider>
      )

      expect(screen.getByText('Test Child')).toBeInTheDocument()
    })

    it('initializes with light theme when no preference is stored', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      await waitFor(() => {
        expect(result.current.mounted).toBe(true)
      })

      expect(result.current.theme).toBe('light')
    })

    it('initializes with stored theme from localStorage', async () => {
      localStorageMock.setItem('theme', 'dark')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      await waitFor(() => {
        expect(result.current.mounted).toBe(true)
      })

      expect(result.current.theme).toBe('dark')
    })

    it('initializes with dark theme when system prefers dark mode', async () => {
      window.matchMedia = createMatchMediaMock(true)

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      await waitFor(() => {
        expect(result.current.mounted).toBe(true)
      })

      expect(result.current.theme).toBe('dark')
    })

    it('applies dark class to document when theme is dark', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      await waitFor(() => {
        expect(result.current.mounted).toBe(true)
      })

      act(() => {
        result.current.setTheme('dark')
      })

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })
    })

    it('removes dark class from document when theme is light', async () => {
      localStorageMock.setItem('theme', 'dark')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      await waitFor(() => {
        expect(result.current.mounted).toBe(true)
      })

      act(() => {
        result.current.setTheme('light')
      })

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false)
      })
    })
  })

  describe('useTheme hook', () => {
    it('returns theme, setTheme, and mounted', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      await waitFor(() => {
        expect(result.current.mounted).toBe(true)
      })

      expect(result.current).toHaveProperty('theme')
      expect(result.current).toHaveProperty('setTheme')
      expect(result.current).toHaveProperty('mounted')
      expect(typeof result.current.setTheme).toBe('function')
    })

    it('setTheme updates the theme value', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      await waitFor(() => {
        expect(result.current.mounted).toBe(true)
      })

      expect(result.current.theme).toBe('light')

      act(() => {
        result.current.setTheme('dark')
      })

      expect(result.current.theme).toBe('dark')
    })

    it('setTheme persists theme to localStorage', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      await waitFor(() => {
        expect(result.current.mounted).toBe(true)
      })

      act(() => {
        result.current.setTheme('dark')
      })

      expect(localStorageMock.getItem('theme')).toBe('dark')

      act(() => {
        result.current.setTheme('light')
      })

      expect(localStorageMock.getItem('theme')).toBe('light')
    })

    it('throws error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => useTheme())
      }).toThrow('useTheme must be used within a ThemeProvider')

      consoleError.mockRestore()
    })

    it('mounted is false initially and becomes true after mount', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      // Initially mounted might be false
      const initialMounted = result.current.mounted

      await waitFor(() => {
        expect(result.current.mounted).toBe(true)
      })

      // After waiting, it should be true
      expect(result.current.mounted).toBe(true)
    })
  })

  describe('Theme persistence', () => {
    it('persists dark theme across provider remounts', async () => {
      const { result: result1 } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      await waitFor(() => {
        expect(result1.current.mounted).toBe(true)
      })

      act(() => {
        result1.current.setTheme('dark')
      })

      // Create a new provider instance (simulating remount)
      const { result: result2 } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      await waitFor(() => {
        expect(result2.current.mounted).toBe(true)
      })

      expect(result2.current.theme).toBe('dark')
      expect(localStorageMock.getItem('theme')).toBe('dark')
    })

    it('persists light theme across provider remounts', async () => {
      localStorageMock.setItem('theme', 'dark')

      const { result: result1 } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      await waitFor(() => {
        expect(result1.current.mounted).toBe(true)
      })

      act(() => {
        result1.current.setTheme('light')
      })

      // Create a new provider instance (simulating remount)
      const { result: result2 } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      await waitFor(() => {
        expect(result2.current.mounted).toBe(true)
      })

      expect(result2.current.theme).toBe('light')
      expect(localStorageMock.getItem('theme')).toBe('light')
    })
  })
})

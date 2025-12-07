'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  useCallback,
} from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getThemeSnapshot(): Theme {
  const stored = localStorage.getItem('theme')
  const isDark =
    stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
  return isDark ? 'dark' : 'light'
}

function getServerSnapshot(): Theme {
  return 'light'
}

function subscribeToTheme(callback: () => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', callback)
  window.addEventListener('storage', callback)
  return () => {
    mediaQuery.removeEventListener('change', callback)
    window.removeEventListener('storage', callback)
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const externalTheme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerSnapshot)
  const [theme, setThemeState] = useState<Theme>(externalTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setThemeState(externalTheme)
  }, [externalTheme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme, mounted])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mounted }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

function getThemeSnapshot(): 'light' | 'dark' {
  const stored = localStorage.getItem('theme')
  const isDark =
    stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
  return isDark ? 'dark' : 'light'
}

function getServerSnapshot(): 'light' | 'dark' {
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

export default function ThemeToggle() {
  const externalTheme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerSnapshot)
  const [theme, setThemeState] = useState<'light' | 'dark'>(externalTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setThemeState(externalTheme)
  }, [externalTheme])

  useEffect(() => {
    if (!mounted) return
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  if (!mounted) {
    return null
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 ring-neutral-400/50 transition-all duration-200 hover:ring-2 hover:bg-neutral-200 dark:hover:bg-neutral-700"
      onClick={toggleTheme}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="h-5 w-5 text-neutral-600 dark:text-neutral-300 transition-colors duration-200"
        strokeWidth={1.5}
      >
        {theme === 'dark' ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        )}
      </svg>
    </button>
  )
}

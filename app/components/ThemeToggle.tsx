'use client'

import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return <div className="h-9 w-9" />
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="theme-toggle flex h-9 w-9 items-center justify-center text-ink-muted hover:text-ink"
      onClick={toggleTheme}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="h-5 w-5"
        strokeWidth={1.5}
        aria-hidden="true"
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

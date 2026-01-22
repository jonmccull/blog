'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[app] Error boundary caught:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-2xl font-medium mb-4">Something went wrong</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
      >
        Try again
      </button>
    </div>
  )
}

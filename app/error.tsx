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
    <section className="notice">
      <h1 className="page-title display-lg">Something went wrong</h1>
      <p className="body">An unexpected error occurred. Please try again.</p>
      <button type="button" onClick={() => reset()} className="fdn-btn">
        Try again
      </button>
    </section>
  )
}

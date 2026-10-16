'use client'

import { useEffect, useRef } from 'react'

// The Diagnoseovergang post header (frontmatter `header: icd-rain`): ICD-10 rains into the kit's glyph cloth
// and turns into ICD-11, on a loop. The drawing lives in icdRainField.ts, code-split to this one post.
export default function IcdRain() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let handle: { destroy: () => void } | undefined
    let alive = true
    let idle = 0
    const start = async () => {
      const { mountIcdRain } = await import('./icdRainField')
      if (!alive || !ref.current) return
      handle = mountIcdRain(ref.current, { from: 'ICD-10', to: 'ICD-11', speed: 0.7 })
    }
    // Start after the page has loaded, so the title never waits on the drawing
    const idleOk = typeof window.requestIdleCallback === 'function'
    const go = () => {
      if (idleOk) idle = window.requestIdleCallback(() => start(), { timeout: 600 })
      else idle = window.setTimeout(start, 50)
    }
    if (document.readyState === 'complete') go()
    else addEventListener('load', go, { once: true })
    return () => {
      alive = false
      removeEventListener('load', go)
      if (idleOk) window.cancelIdleCallback(idle)
      else clearTimeout(idle)
      handle?.destroy()
    }
  }, [])

  return (
    <div className="icd-rain">
      <canvas
        ref={ref}
        role="img"
        aria-label="ICD-10 written in small code characters, revealed by falling rain; its last digit rains again and becomes ICD-11."
      />
    </div>
  )
}

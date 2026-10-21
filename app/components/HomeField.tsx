'use client'

import { ReactNode, useRef } from 'react'
import { FieldFrame, mountPortrait } from './fieldPortrait'
import { useField } from './useField'

// The kit's Field behind the home block, full bleed, from 768px up (on phones the copy covers it).
// The copy is the quiet zone; the portrait is a figure the ripples pass through.
export default function HomeField({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null)

  useField(stage, (el) => {
    const quiet = [...el.querySelectorAll<HTMLElement>('.home-header, .home-body, .home-links')]
    const box = el.querySelector<HTMLElement>('.home-portrait')
    const portrait = box ? mountPortrait(box, el) : undefined
    return {
      options: {
        quiet,
        figure: box ? [box] : [],
        onFrame: (f: FieldFrame) => portrait?.onFrame(f),
      },
      cleanup: () => portrait?.destroy(),
    }
  })

  return (
    <div ref={stage} className="home-field">
      {children}
    </div>
  )
}

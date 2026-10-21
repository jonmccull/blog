'use client'

import { ReactNode, useRef } from 'react'
import { useField } from '../components/useField'

// Shortest gap between two hover pulses, so sweeping the mouse across the grid doesn't flood the cloth
const PULSE_GAP = 700
// The kit's recommended hover pulse (components/Field/README.md): a faint tilt with a trace of lime
const PULSE = { strength: 0.35, life: 0.6 }

// The home page's Field, full bleed behind the Projects grid from 768px up. The cards sit on it as solid
// tiles, so the cloth shows in the gaps; the header and the call to action are quiet zones, and clicks on a card make no ripple.
// Entering a card with a mouse starts a quiet ripple under its centre, which shows in the gaps as it spreads.
export default function ProjectsField({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null)

  useField(stage, (el, field) => {
    let current: Element | null = null
    let last = 0
    const onOver = (ev: PointerEvent) => {
      if (ev.pointerType !== 'mouse') return
      const cell = (ev.target as Element).closest('.project-cell')
      if (cell === current) return
      current = cell
      const now = performance.now()
      if (!cell || now - last < PULSE_GAP) return
      last = now
      const r = cell.getBoundingClientRect()
      field.current?.ripple(r.left + r.width / 2, r.top + r.height / 2, PULSE)
    }
    el.addEventListener('pointerover', onOver)

    return {
      options: {
        quiet: [...el.querySelectorAll<HTMLElement>('.projects-header, .contact-cta')],
        ignore: 'a, button, input, label, select, textarea, .project-cell',
      },
      cleanup: () => el.removeEventListener('pointerover', onOver),
    }
  })

  return (
    <div ref={stage} className="projects-field">
      {children}
    </div>
  )
}

'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { FieldFrame, mountPortrait } from './fieldPortrait'

type FieldHandle = { destroy: () => void }
declare global {
  interface Window {
    FoundationsField?: { mount: (stage: HTMLElement, options?: object) => FieldHandle }
  }
}

// The kit's Field behind the home block, full bleed, from 768px up (on phones the copy covers it).
// The copy is the quiet zone; the portrait is a figure the ripples pass through.
const WIDE = '(min-width: 768px)'

export default function HomeField({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wide = matchMedia(WIDE)
    let handle: FieldHandle | undefined
    let portrait: ReturnType<typeof mountPortrait> | undefined
    let alive = true

    const stop = () => {
      handle?.destroy()
      portrait?.destroy()
      handle = portrait = undefined
    }
    const start = async () => {
      // The vendored kit script assigns window.FoundationsField; the import code-splits it to this page
      // @ts-expect-error -- a classic script, not a module (the vendored dir holds kit files only, so no .d.ts beside it)
      await import('../styles/foundations/field.js')
      const el = stage.current
      if (!alive || !el || !wide.matches || handle || !window.FoundationsField) return
      const quiet = [...el.querySelectorAll<HTMLElement>('.home-header, .home-body, .home-links')]
      const box = el.querySelector<HTMLElement>('.home-portrait')
      if (box) portrait = mountPortrait(box, el)
      handle = window.FoundationsField.mount(el, {
        quiet,
        figure: box ? [box] : [],
        onFrame: (f: FieldFrame) => portrait?.onFrame(f),
      })
    }
    const onChange = () => (wide.matches ? start() : stop())

    if (wide.matches) start()
    wide.addEventListener('change', onChange)
    return () => {
      alive = false
      wide.removeEventListener('change', onChange)
      stop()
    }
  }, [])

  return (
    <div ref={stage} className="home-field">
      {children}
    </div>
  )
}

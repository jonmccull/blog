'use client'

import { RefObject, useEffect, useRef } from 'react'

export type RippleOptions = { strength?: number; life?: number }
export type FieldHandle = {
  destroy: () => void
  // Field v3: a ripple from the page at a viewport point; false when none started (reduced motion, no cloth there)
  ripple: (clientX: number, clientY: number, options?: RippleOptions) => boolean
}
declare global {
  interface Window {
    FoundationsField?: { mount: (stage: HTMLElement, options?: object) => FieldHandle }
  }
}

// Called once per mount with the stage element and a ref to the live handle (set once mounted, for calls
// such as ripple()); returns the options for FoundationsField.mount plus an optional cleanup run when the
// field is torn down. Returning undefined skips mounting.
export type FieldSetup = (
  stage: HTMLElement,
  live: RefObject<FieldHandle | null>
) => { options: object; cleanup?: () => void } | undefined

// Mounts the kit's Field on the stage while the media query matches, and tears it down otherwise.
export function useField(
  stage: RefObject<HTMLElement | null>,
  setup: FieldSetup,
  media = '(min-width: 768px)'
): void {
  const live = useRef<FieldHandle | null>(null)
  const latest = useRef(setup)
  useEffect(() => {
    latest.current = setup
  })

  useEffect(() => {
    const query = matchMedia(media)
    let handle: FieldHandle | undefined
    let cleanup: (() => void) | undefined
    let alive = true

    const stop = () => {
      handle?.destroy()
      cleanup?.()
      handle = cleanup = undefined
      live.current = null
    }
    const start = async () => {
      // The vendored kit script assigns window.FoundationsField; the import code-splits it to this page
      // @ts-expect-error -- a classic script, not a module (the vendored dir holds kit files only, so no .d.ts beside it)
      await import('../styles/foundations/field.js')
      const el = stage.current
      if (!alive || !el || !query.matches || handle || !window.FoundationsField) return
      const field = latest.current(el, live)
      if (!field) return
      cleanup = field.cleanup
      handle = live.current = window.FoundationsField.mount(el, field.options)
    }
    const onChange = () => (query.matches ? start() : stop())

    if (query.matches) start()
    query.addEventListener('change', onChange)
    return () => {
      alive = false
      query.removeEventListener('change', onChange)
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per mount; setup is read through the ref
  }, [])
}

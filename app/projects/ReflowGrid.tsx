'use client'

import { ReactNode, useEffect, useRef } from 'react'

const DURATION = 480
const EASING = 'cubic-bezier(0.2, 0.7, 0.2, 1)'

// A grid whose cells glide to their new places when the column count changes (FLIP: measure, move, animate back).
// Between column changes the cells just track the viewport; reduced motion turns the glide off.
export default function ReflowGrid({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) {
  const grid = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = grid.current
    if (!el) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')
    const cells = () => [...el.children] as HTMLElement[]
    const columns = () => getComputedStyle(el).gridTemplateColumns.split(' ').length
    // Layout positions relative to the grid, so page scroll never counts as movement
    const measure = () => {
      const origin = el.getBoundingClientRect()
      return cells().map((cell) => {
        const r = cell.getBoundingClientRect()
        return { x: r.left - origin.left, y: r.top - origin.top }
      })
    }
    const settle = () => cells().forEach((cell) => cell.getAnimations().forEach((a) => a.cancel()))

    let count = columns()
    settle()
    let last = measure()

    const ro = new ResizeObserver(() => {
      const next = columns()
      if (next === count || reduce.matches) {
        count = next
        last = measure()
        return
      }
      count = next
      settle()
      const now = measure()
      cells().forEach((cell, i) => {
        const dx = last[i].x - now[i].x
        const dy = last[i].y - now[i].y
        if (!dx && !dy) return
        cell.animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
          { duration: DURATION, easing: EASING }
        )
      })
      last = now
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      settle()
    }
  }, [])

  return (
    <ul ref={grid} className={className}>
      {children}
    </ul>
  )
}

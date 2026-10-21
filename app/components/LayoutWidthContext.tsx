'use client'

import { createContext, useContext, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

type LayoutWidthContextType = {
  isWide: boolean
}

const LayoutWidthContext = createContext<LayoutWidthContextType>({ isWide: false })

export function useLayoutWidth() {
  return useContext(LayoutWidthContext)
}

export function LayoutWidthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  // Portfolio detail pages, the home page (copy plus portrait column) and the Projects grid use the wide layout.
  // Derived from the path on every render, so a page loads at its width instead of animating to it.
  const isWide =
    pathname === '/' || pathname === '/projects' || (pathname?.startsWith('/portfolio/') ?? false)

  return <LayoutWidthContext.Provider value={{ isWide }}>{children}</LayoutWidthContext.Provider>
}

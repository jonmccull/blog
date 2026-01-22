'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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
  const [isWide, setIsWide] = useState(false)

  useEffect(() => {
    // Portfolio detail pages should use wide layout
    const shouldBeWide = pathname?.startsWith('/portfolio/') ?? false
    setIsWide(shouldBeWide)
  }, [pathname])

  return <LayoutWidthContext.Provider value={{ isWide }}>{children}</LayoutWidthContext.Provider>
}

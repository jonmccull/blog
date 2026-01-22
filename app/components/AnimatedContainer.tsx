'use client'

import { useLayoutWidth } from './LayoutWidthContext'
import { ReactNode } from 'react'

type AnimatedContainerProps = {
  children: ReactNode
  className?: string
}

export default function AnimatedContainer({ children, className = '' }: AnimatedContainerProps) {
  const { isWide } = useLayoutWidth()

  return (
    <div
      className={`
        layout-container
        ${isWide ? 'layout-wide' : 'layout-narrow'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

'use client'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '../context/ThemeContext'
import { LayoutWidthProvider } from './LayoutWidthContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LayoutWidthProvider>{children}</LayoutWidthProvider>
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  )
}

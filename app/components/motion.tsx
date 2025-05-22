'use client'

import { motion as m } from 'framer-motion'

// Re-export specific components we need
export const motion = {
  div: m.div,
  article: m.article,
  section: m.section,
  h2: m.h2,
  h3: m.h3,
  span: m.span,
  p: m.p,
  a: m.a,
}

export { AnimatePresence } from 'framer-motion'

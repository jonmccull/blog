'use client'

import { motion } from 'framer-motion'

interface MotionDivProps {
  children: React.ReactNode
  initial?: any
  animate?: any
  transition?: any
}

export default function MotionDiv({ children, initial, animate, transition }: MotionDivProps) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
    >
      {children}
    </motion.div>
  )
} 
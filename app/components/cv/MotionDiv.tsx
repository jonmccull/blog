'use client'

import { motion, HTMLMotionProps } from 'framer-motion'

interface MotionDivProps {
  children: React.ReactNode
  initial?: HTMLMotionProps<'div'>['initial']
  animate?: HTMLMotionProps<'div'>['animate']
  transition?: HTMLMotionProps<'div'>['transition']
}

export default function MotionDiv({ children, initial, animate, transition }: MotionDivProps) {
  return (
    <motion.div initial={initial} animate={animate} transition={transition}>
      {children}
    </motion.div>
  )
}

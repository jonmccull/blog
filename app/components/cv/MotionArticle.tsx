'use client'

import { motion } from 'framer-motion'

interface MotionArticleProps {
  children: React.ReactNode
  initial?: any
  animate?: any
  variants?: any
  className?: string
}

export default function MotionArticle({ children, initial, animate, variants, className }: MotionArticleProps) {
  return (
    <motion.article
      initial={initial}
      animate={animate}
      variants={variants}
      className={className}
    >
      {children}
    </motion.article>
  )
} 
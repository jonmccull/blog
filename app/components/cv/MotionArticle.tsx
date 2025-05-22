'use client'

import { motion, HTMLMotionProps } from 'framer-motion'

interface MotionArticleProps {
  children: React.ReactNode
  initial?: HTMLMotionProps<'article'>['initial']
  animate?: HTMLMotionProps<'article'>['animate']
  variants?: HTMLMotionProps<'article'>['variants']
  className?: string
}

export default function MotionArticle({
  children,
  initial,
  animate,
  variants,
  className,
}: MotionArticleProps) {
  return (
    <motion.article initial={initial} animate={animate} variants={variants} className={className}>
      {children}
    </motion.article>
  )
}

import { motion } from 'framer-motion'

interface SectionProps {
  title: string
  children: React.ReactNode
}

export function Section({ title, children }: SectionProps) {
  return (
    <motion.section
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.h2
        className="font-semibold text-2xl mb-6 tracking-tighter"
        layout
      >
        {title}
      </motion.h2>
      {children}
    </motion.section>
  )
} 
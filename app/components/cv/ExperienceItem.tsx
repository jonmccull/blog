'use client'

import { motion } from '../motion'

interface ExperienceItemProps {
  position: string
  company: string
  companyLink?: string
  startDate: string
  endDate: string
  description?: string
}

export function ExperienceItem({
  position,
  company,
  companyLink,
  startDate,
  endDate,
  description,
}: ExperienceItemProps) {
  return (
    <motion.div className="mb-6 last:mb-0" whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
      <div className="flex justify-between items-start mb-1">
        <motion.h3 className="font-semibold text-neutral-900 dark:text-neutral-100" layout>
          {position}
          {company && (
            <>
              {' // '}
              {companyLink ? (
                <motion.a
                  href={companyLink}
                  className="link-underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {company}
                </motion.a>
              ) : (
                company
              )}
            </>
          )}
        </motion.h3>
        <motion.span
          className="text-sm text-neutral-600 dark:text-neutral-400 tabular-nums whitespace-nowrap ml-4"
          layout
        >
          {startDate} → {endDate}
        </motion.span>
      </div>
      {description && (
        <motion.p
          className="text-neutral-700 dark:text-neutral-300"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}

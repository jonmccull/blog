'use client'

import { motion } from '../motion'

interface ExperienceItemProps {
  position: string
  company: string
  companyLink?: string
  startDate: string
  endDate: string
  description?: string
  jobContent?: string
  isExpanded?: boolean
  onToggle?: () => void
}

export function ExperienceItem({
  position,
  company,
  companyLink,
  startDate,
  endDate,
  description,
  jobContent,
  isExpanded = false,
  onToggle,
}: ExperienceItemProps) {
  const hasExpandableContent = jobContent && jobContent.trim().length > 0

  return (
    <motion.div className="cv-experience-item" whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1 gap-1">
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
          className="text-sm text-neutral-600 dark:text-neutral-400 tabular-nums whitespace-nowrap md:ml-4 md:self-start"
          layout
        >
          {startDate} → {endDate}
        </motion.span>
      </div>
      {description && <p className="text-neutral-700 dark:text-neutral-300">{description}</p>}

      {/* Expandable chevron and content - hidden on mobile via CSS */}
      {hasExpandableContent && (
        <div className="cv-expand-wrapper">
          {/* Chevron toggle */}
          <button
            onClick={onToggle}
            className={`cv-expand-chevron ${isExpanded ? 'is-expanded' : ''}`}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse job details' : 'Expand job details'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`cv-expand-chevron-icon ${isExpanded ? 'expanded' : ''}`}
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Expandable content */}
          <div className={`cv-expand-content ${isExpanded ? 'is-expanded' : ''}`}>
            <div className="cv-job-description" dangerouslySetInnerHTML={{ __html: jobContent }} />
          </div>
        </div>
      )}
    </motion.div>
  )
}

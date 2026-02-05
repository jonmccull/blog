'use client'

import { motion } from '../motion'

interface ExperienceItemProps {
  position: string
  company: string
  companyLink?: string
  location?: string
  startDate: string
  endDate: string
  description?: string
  jobContent?: string
}

export function ExperienceItem({
  position,
  company,
  companyLink,
  location,
  startDate,
  endDate,
  description,
  jobContent,
}: ExperienceItemProps) {
  return (
    <motion.div className="cv-experience-item">
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase">{position}</h3>
      <div className="text-neutral-600 dark:text-neutral-400 mb-1">
        {companyLink ? (
          <a
            href={companyLink}
            className="link-underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            {company}
          </a>
        ) : (
          <span>{company}</span>
        )}
        {location && <span> ({location})</span>}
        <span> • </span>
        <span className="tabular-nums">
          {startDate} → {endDate}
        </span>
      </div>
      {description && (
        <p className="italic text-neutral-700 dark:text-neutral-300">{description}</p>
      )}
      {jobContent && jobContent.trim().length > 0 && (
        <div className="cv-job-description" dangerouslySetInnerHTML={{ __html: jobContent }} />
      )}
    </motion.div>
  )
}

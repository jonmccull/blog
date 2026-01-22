'use client'

import { useState } from 'react'
import { ExperienceItem } from './cv/ExperienceItem'

// Pre-formatted job data passed from server component
export interface FormattedJob {
  key: string
  position: string
  company: string
  companyLink?: string
  startDate: string
  endDate: string
  description?: string
  content: string
}

interface JobExperienceProps {
  jobs: FormattedJob[]
}

export function JobExperience({ jobs }: JobExperienceProps) {
  const [expandedJob, setExpandedJob] = useState<string | null>(null)

  const handleToggle = (jobKey: string) => {
    setExpandedJob((current) => (current === jobKey ? null : jobKey))
  }

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <ExperienceItem
          key={job.key}
          position={job.position}
          company={job.company}
          companyLink={job.companyLink}
          startDate={job.startDate}
          endDate={job.endDate}
          description={job.description}
          jobContent={job.content}
          isExpanded={expandedJob === job.key}
          onToggle={() => handleToggle(job.key)}
        />
      ))}
    </div>
  )
}

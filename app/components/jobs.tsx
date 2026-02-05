'use client'

import { ExperienceItem } from './cv/ExperienceItem'

// Pre-formatted job data passed from server component
export interface FormattedJob {
  key: string
  position: string
  company: string
  companyLink?: string
  location?: string
  startDate: string
  endDate: string
  description?: string
  content: string
}

interface JobExperienceProps {
  jobs: FormattedJob[]
}

export function JobExperience({ jobs }: JobExperienceProps) {
  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <ExperienceItem
          key={job.key}
          position={job.position}
          company={job.company}
          companyLink={job.companyLink}
          location={job.location}
          startDate={job.startDate}
          endDate={job.endDate}
          description={job.description}
          jobContent={job.content}
        />
      ))}
    </div>
  )
}

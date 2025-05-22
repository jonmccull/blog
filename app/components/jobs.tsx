import { ExperienceItem } from './cv/ExperienceItem'
import { formatDate, getJobs } from 'app/cv/utils'

export function JobExperience() {
  const allJobs = getJobs()

  return (
    <div className="space-y-6">
      {allJobs
        .sort((a, b) => {
          if (new Date(a.metadata.startDate) > new Date(b.metadata.startDate)) {
            return -1
          }
          return 1
        })
        .map((job) => (
          <ExperienceItem
            key={`${job.metadata.title}-${job.metadata.startDate}`}
            position={job.metadata.position}
            company={job.metadata.title}
            companyLink={job.metadata.companyLink}
            startDate={formatDate(job.metadata.startDate, false)}
            endDate={formatDate(job.metadata.endDate, false)}
            description={job.metadata.description}
          />
        ))}
    </div>
  )
}

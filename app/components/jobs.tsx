import { ExperienceItem } from './cv/ExperienceItem'
import { formatCVDate, getCVJobs } from 'app/lib/mdx'

export function JobExperience() {
  const allJobs = getCVJobs()

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
            startDate={formatCVDate(job.metadata.startDate, false)}
            endDate={formatCVDate(job.metadata.endDate, false)}
            description={job.metadata.description}
          />
        ))}
    </div>
  )
}

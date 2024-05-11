import Link from 'next/link'
import { formatDate, getJobs } from 'app/cv/utils'

export function JobExperience() {
  let allJobs = getJobs()

  return (
    <div>
      {allJobs
        .sort((a, b) => {
          if (
            new Date(a.metadata.startDate) > new Date(b.metadata.startDate)
          ) {
            return -1
          }
          return 1
        })
        .map((job) => (
          <Link
            key={job.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/cv/${job.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 tabular-nums">
                {formatDate(job.metadata.startDate, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {job.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}

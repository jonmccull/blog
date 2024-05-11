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
            <div className="grid w-full grid-cols-5 grid-flow-row gap-2">
                <p className="col-span-2 font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {job.metadata.position}
                </p>

                <p className="col-span-1 font-semibold text-right text-neutral-900 dark:text-neutral-100 tracking-tight">
                  // {job.metadata.title}
                </p>
                
                <p className="col-span-2 text-right text-neutral-600 dark:text-neutral-400 tabular-nums">
                  {formatDate(job.metadata.startDate, false)} → {formatDate(job.metadata.endDate, false)}
                </p>
              
              <p className="col-span-3 text-neutral-900 dark:text-neutral-100 tracking-tight mb-8">
                {job.metadata.description}
              </p>
             
            </div>
            
            
          
        ))}
    </div>
  )
}

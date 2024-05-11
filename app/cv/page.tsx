import { JobExperience } from 'app/components/jobs'

export const metadata = {
  title: 'Job Experience'
}

export default function Page() {
  return (
    <section>
      <h1 className="mb-2 text-2xl font-semibold tracking-tighter">
        Jon McCullough
      </h1>
      <p className="job-dates mb-8 text-neutral-900 dark:text-neutral-100 tracking-tight">
        <a href="https://www.linkedin.com/in/jonmccullough/">LinkedIn</a> ⋅ <a href="mailto:hey@jonm.cc">hey@jonm.cc</a>
      </p>
      <h2 className="font-semibold text-2xl mb-8 tracking-tighter">
        Profile
      </h2>
        <ul className="mb-8">
          <li>- A natural product marketing leader that brings calm and clarity.</li>
          <li>- 10+ years of marketing experience across B2C and B2B.</li>
          <li>- Structured and pragmatic, but highly creative. A data-driven decision maker.</li>
          <li>- Excellent, empathic communicator that thrives in remote.</li>
        </ul>

      <h2 className="font-semibold text-2xl mb-8 tracking-tighter">
        Experience
      </h2>
        <JobExperience />
      
      <h2 className="cv-section-title text-2xl mb-8 font-semibold tracking-tighter">
        Volunteer & Freelance
      </h2>
      
      <p className="font-semibold text-neutral-600 dark:text-neutral-400 tabular-nums">
        FOUNDER // MC Consulting</p>
      <p className="job-dates mb-4 text-neutral-900 dark:text-neutral-100 tracking-tight">
        Sep 2023 → Present
      </p>
        
      <p className="font-semibold text-neutral-600 dark:text-neutral-400 tabular-nums">
        AI TRAINER // <a href="https://iris.ai/">Iris AI</a></p>
      <p className="job-dates mb-4 text-neutral-900 dark:text-neutral-100 tracking-tight">
        Jun 2016 → Dec 2016
      </p>
        
      <p className="font-semibold text-neutral-600 dark:text-neutral-400 tabular-nums">
        PROJECT MANAGER // <a href="https://superside.com/">Superside</a></p>
      <p className="job-dates mb-4 text-neutral-900 dark:text-neutral-100 tracking-tight">
        Apr 2016 → Oct 2016
      </p>
        
      <p className="font-semibold text-neutral-600 dark:text-neutral-400 tabular-nums">
        SENIOR DIGITAL ADVISOR // Kry</p>
      <p className="job-dates mb-8 text-neutral-900 dark:text-neutral-100 tracking-tight">
        Apr 2016 → Dec 2016
      </p>
      
      <h2 className="cv-section-title text-2xl font-semibold tracking-tighter">
        Education
      </h2>
      
      <p className="font-semibold text-neutral-600 dark:text-neutral-400 tabular-nums">
        Bachelor's of Science (Biology)</p>
      University of Victoria, Canada
      <p className="job-dates mb-4 text-neutral-900 dark:text-neutral-100 tracking-tight">
        2001 → 2005
      </p>
        
      <p className="font-semibold text-neutral-600 dark:text-neutral-400 tabular-nums">
        High School Diploma (Honors with Distinction)</p>
      F.H. Collins Secondary, Canada
      <p className="job-dates mb-4 text-neutral-900 dark:text-neutral-100 tracking-tight">
        1997 → 2001
      </p>
      
      
    </section>
  )
}
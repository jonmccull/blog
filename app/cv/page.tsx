import { Section } from '../components/cv/Section'
import { ExperienceItem } from '../components/cv/ExperienceItem'
import { JobExperience, type FormattedJob } from '../components/jobs'
import { getCVJobs, formatCVDate } from '../lib/mdx'

export const metadata = {
  title: 'Jon McCullough - Product Marketer',
  description: 'Product marketing leader with 12+ years of experience in B2C and B2B.',
}

export default function CVPage() {
  // Fetch and format jobs server-side
  const rawJobs = getCVJobs()
  const jobs: FormattedJob[] = rawJobs
    .sort((a, b) => {
      if (new Date(a.metadata.startDate) > new Date(b.metadata.startDate)) {
        return -1
      }
      return 1
    })
    .map((job) => ({
      key: `${job.metadata.title}-${job.metadata.startDate}`,
      position: job.metadata.position,
      company: job.metadata.title,
      companyLink: job.metadata.companyLink,
      location: job.metadata.location,
      startDate: formatCVDate(job.metadata.startDate, false),
      endDate: formatCVDate(job.metadata.endDate, false),
      description: job.metadata.description,
      content: job.content,
    }))
  return (
    <article className="cv">
      {/* Header */}
      <header className="cv-header">
        <h1 className="page-title display-xl">Jon McCullough</h1>
        <p className="cv-role lead">Product Marketer</p>
        <nav className="cv-links body-sm" aria-label="Contact links">
          <a
            href="https://www.linkedin.com/in/jonmccullough/"
            className="fdn-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a href="mailto:hey@jonm.cc" className="fdn-btn">
            Mail
          </a>
        </nav>
      </header>

      {/* Profile */}
      <Section title="Profile">
        <p className="cv-profile body">
          <strong>Senior Product Marketer</strong> with 12+ years across{' '}
          <strong>B2C and B2B SaaS</strong>, from niche browsers to productivity tools used by 40M+
          people. Specializes in <strong>positioning and messaging frameworks</strong>, multi-phase{' '}
          <strong>product launches</strong>, and <strong>customer research synthesis</strong>.
          Builds <strong>AI-native workflows</strong> to scale marketing impact beyond headcount.
        </p>
      </Section>

      {/* Experience */}
      <Section title="Experience">
        <JobExperience jobs={jobs} />
      </Section>

      {/* Volunteer & Freelance */}
      <Section title="Volunteer & Freelance">
        <ExperienceItem
          position="Guitar Technician"
          company="MusikkHuset"
          companyLink="https://musikkhuset.com"
          startDate="May 2026"
          endDate="Present"
        />
        <ExperienceItem
          position="Founder"
          company="MC Consulting"
          startDate="Sep 2023"
          endDate="Present"
        />
        <ExperienceItem
          position="AI Trainer"
          company="Iris AI"
          companyLink="https://iris.ai/"
          startDate="Jun 2016"
          endDate="Dec 2016"
        />
        <ExperienceItem
          position="Project Manager"
          company="Superside"
          companyLink="https://superside.com/"
          startDate="Apr 2016"
          endDate="Oct 2016"
        />
        <ExperienceItem
          position="Senior Digital Advisor"
          company="Kry"
          startDate="Apr 2016"
          endDate="Dec 2016"
        />
      </Section>

      {/* Education */}
      <Section title="Education">
        <ExperienceItem
          position="Bachelor's of Science (Biology)"
          company="University of Victoria, Canada"
          startDate="2001"
          endDate="2005"
        />
        <ExperienceItem
          position="High School Diploma (Honors with Distinction)"
          company="F.H. Collins Secondary, Canada"
          startDate="1997"
          endDate="2001"
        />
      </Section>
    </article>
  )
}

import MotionArticle from '../components/cv/MotionArticle'
import { FadeIn } from '../components/cv/FadeIn'
import { Section } from '../components/cv/Section'
import { ExperienceItem } from '../components/cv/ExperienceItem'
import { JobExperience, type FormattedJob } from '../components/jobs'
import { getCVJobs, formatCVDate } from '../lib/mdx'

export const metadata = {
  title: 'Jon McCullough - CV',
  description: 'Product marketing leader with 10+ years of experience in B2C and B2B.',
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
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
    <MotionArticle
      initial="initial"
      animate="animate"
      variants={stagger}
      className="max-w-[1080px] mx-auto pr-2 md:pr-0"
    >
      {/* Header */}
      <FadeIn>
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Jon McCullough</h1>
          <div className="flex gap-3 text-neutral-700 dark:text-neutral-300">
            <a
              href="https://www.linkedin.com/in/jonmccullough/"
              className="link-underline hover:text-neutral-900 dark:hover:text-neutral-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <span>•</span>
            <a
              href="mailto:hey@jonm.cc"
              className="link-underline hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Mail
            </a>
          </div>
        </header>
      </FadeIn>

      {/* Profile */}
      <FadeIn delay={0.1}>
        <Section title="Profile">
          <p className="text-neutral-700 dark:text-neutral-300">
            <strong>Senior Product Marketer</strong> with 12+ years across{' '}
            <strong>B2C and B2B SaaS</strong>, from niche browsers to productivity tools used by
            40M+ people. Specializes in <strong>positioning and messaging frameworks</strong>,
            multi-phase <strong>product launches</strong>, and{' '}
            <strong>customer research synthesis</strong>. Builds{' '}
            <strong>AI-native workflows</strong> to scale marketing impact beyond headcount.
          </p>
        </Section>
      </FadeIn>

      {/* Experience */}
      <FadeIn delay={0.2}>
        <Section title="Experience">
          <JobExperience jobs={jobs} />
        </Section>
      </FadeIn>

      {/* Volunteer & Freelance */}
      <FadeIn delay={0.3}>
        <Section title="Volunteer & Freelance">
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
      </FadeIn>

      {/* Education */}
      <FadeIn delay={0.4}>
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
      </FadeIn>
    </MotionArticle>
  )
}

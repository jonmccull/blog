import { Section } from '../components/cv/Section'
import { ExperienceItem } from '../components/cv/ExperienceItem'
import { JobExperience } from '../components/jobs'
import { FadeIn } from '../components/cv/FadeIn'
import { motion } from 'framer-motion'

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
  return (
    <motion.article
      initial="initial"
      animate="animate"
      variants={stagger}
      className="max-w-2xl"
    >
      {/* Header */}
      <FadeIn>
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Jon McCullough</h1>
          <div className="flex gap-3 text-neutral-700 dark:text-neutral-300">
            <a
              href="https://www.linkedin.com/in/jonmccullough/"
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <span>•</span>
            <a
              href="mailto:hey@jonm.cc"
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              hey@jonm.cc
            </a>
          </div>
        </header>
      </FadeIn>

      {/* Profile */}
      <FadeIn delay={0.1}>
        <Section title="Profile">
          <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
            <li>• A natural product marketing leader that brings calm and clarity.</li>
            <li>• 10+ years of marketing experience across B2C and B2B.</li>
            <li>• Structured and pragmatic, but highly creative. A data-driven decision maker.</li>
            <li>• Excellent, empathic communicator that thrives in remote.</li>
          </ul>
        </Section>
      </FadeIn>

      {/* Experience */}
      <FadeIn delay={0.2}>
        <Section title="Experience">
          <JobExperience />
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
    </motion.article>
  )
}
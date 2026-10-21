import Link from 'next/link'
import type { ComponentProps } from 'react'
import { PixelIcon } from '../components/PixelIcon'
import { projects, type Project } from './projects'
import ProjectsField from './ProjectsField'
import ReflowGrid from './ReflowGrid'

const INTRO = 'Things I’ve built and products I’ve marketed in-house.'

export const metadata = {
  title: 'Projects',
  description: INTRO,
}

// A site page through next/link, anything else in a new tab
function AnyLink({ href, ...props }: ComponentProps<'a'> & { href: string }) {
  if (href.startsWith('/')) return <Link href={href} {...props} />
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
}

// The name's link: the write-up when there is one (post or case study), otherwise the first link
function primaryHref({ links }: Project) {
  return (links.find((link) => link.href.startsWith('/')) ?? links[0]).href
}

export default function ProjectsPage() {
  return (
    <ProjectsField>
      <section className="projects">
        <header className="projects-header">
          <h1 className="page-title display-lg">Projects</h1>
          <p className="projects-intro lead">{INTRO}</p>
        </header>
        <ReflowGrid className="projects-grid">
          {projects.map((project) => (
            <li key={project.name} className="project-cell">
              <div className="project-head">
                <p className="fdn-eyebrow">{project.years}</p>
                <ul className="project-tags" aria-label="Tags">
                  {project.tags.map((tag) => (
                    <li key={tag} className="project-tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
              <h2 className="project-name title">
                <AnyLink href={primaryHref(project)} className="fdn-row-title">
                  {project.name}
                </AnyLink>
              </h2>
              <p className="project-description body-sm">{project.description}</p>
              <nav className="project-links" aria-label={`${project.name} links`}>
                {project.links.map(({ icon, label, href }) => (
                  <AnyLink
                    key={href}
                    href={href}
                    className="project-link"
                    aria-label={label}
                    title={label}
                  >
                    <PixelIcon name={icon} />
                  </AnyLink>
                ))}
              </nav>
            </li>
          ))}
        </ReflowGrid>
        <aside className="projects-cta">
          <p className="title">Have an idea? Let’s chat. ✌️</p>
          <a className="fdn-btn" href="mailto:hey@jonm.cc">
            Get in Touch
          </a>
        </aside>
      </section>
    </ProjectsField>
  )
}

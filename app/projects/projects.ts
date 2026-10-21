import type { PixelIconName } from '../components/PixelIcon'

// The Projects page reads this list, in this order. Tags are the pills on each card, years the line beside them.

export type ProjectLink = {
  icon: PixelIconName
  label: string
  href: string
}

export type Project = {
  name: string
  tags: string[]
  years: string
  description: string
  links: ProjectLink[]
}

export const projects: Project[] = [
  {
    name: 'Diagnoseovergang',
    tags: ['Vibe coding', 'Open source'],
    years: '2026',
    description:
      'A free, Norwegian-language guide to what changes from ICD-10 to ICD-11 for mental disorders.',
    links: [
      { icon: 'site', label: 'Website', href: 'https://diagnoseovergang.no' },
      { icon: 'post', label: 'Blog post', href: '/blog/diagnoseovergang' },
      { icon: 'github', label: 'GitHub', href: 'https://github.com/jonmccull/diagnoseovergang' },
    ],
  },
  {
    name: 'DeepCut',
    tags: ['Vibe coding'],
    years: '2026',
    description: 'A vinyl discovery app for iOS, for finding the records worth digging for.',
    links: [
      { icon: 'site', label: 'Website', href: 'https://getdeepcut.app' },
      { icon: 'post', label: 'Blog post', href: '/blog/developing' },
    ],
  },
  {
    name: 'MusikkHuset',
    tags: ['Vibe coding'],
    years: '2026',
    description:
      'Guitar repairs, setups and restorations at a music shop in Haugesund. I’m the guitar tech, and I built the website.',
    links: [
      { icon: 'site', label: 'Website', href: 'https://musikkhuset.com' },
      {
        icon: 'instagram',
        label: 'Instagram',
        href: 'https://www.instagram.com/musikkhusethaugesund/',
      },
      {
        icon: 'facebook',
        label: 'Facebook',
        href: 'https://www.facebook.com/p/MusikkHuset-Haugesund-61576614929620/',
      },
    ],
  },
  {
    name: 'Rydoo',
    tags: ['In-house'],
    years: '2026–now',
    description:
      'Product marketing for accounts payable at Rydoo, which automates invoices and expenses for multinational finance teams.',
    links: [{ icon: 'site', label: 'Website', href: 'https://www.rydoo.com' }],
  },
  {
    name: 'Todoist',
    tags: ['In-house'],
    years: '2024–26',
    description: 'Product marketing for the to-do list app used by 40M+ people.',
    links: [{ icon: 'site', label: 'Website', href: 'https://www.todoist.com' }],
  },
  {
    name: 'Ask by Slite',
    tags: ['In-house'],
    years: '2023',
    description: 'Launching the beta of Ask, an AI assistant for team knowledge.',
    links: [
      { icon: 'post', label: 'Case study', href: '/portfolio/ask-by-slite' },
      { icon: 'site', label: 'Website', href: 'https://slite.com/ask' },
    ],
  },
  {
    name: 'Vivaldi',
    tags: ['In-house'],
    years: '2016–22',
    description: 'Growth and product marketing for the web browser and productivity suite.',
    links: [{ icon: 'site', label: 'Website', href: 'https://www.vivaldi.com' }],
  },
]

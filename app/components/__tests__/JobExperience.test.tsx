import { render, screen } from '@testing-library/react'
import { JobExperience, type FormattedJob } from '../jobs'

function createJobs(): FormattedJob[] {
  return [
    {
      key: 'job-1',
      position: 'Product Marketer',
      company: 'Acme',
      companyLink: 'https://example.com',
      startDate: 'Jan 2024',
      endDate: 'Present',
      description: 'First job description',
      content: '<ul class="job-description"><li>First job details</li></ul>',
    },
    {
      key: 'job-2',
      position: 'Marketing Lead',
      company: 'Beta Corp',
      companyLink: 'https://example.org',
      startDate: 'Jan 2022',
      endDate: 'Dec 2023',
      description: 'Second job description',
      content: '<ul class="job-description"><li>Second job details</li></ul>',
    },
  ]
}

describe('JobExperience', () => {
  it('renders job titles and companies', () => {
    render(<JobExperience jobs={createJobs()} />)

    expect(screen.getByText('Product Marketer')).toBeInTheDocument()
    expect(screen.getByText('Marketing Lead')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Acme' })).toHaveAttribute(
      'href',
      'https://example.com'
    )
    expect(screen.getByRole('link', { name: 'Beta Corp' })).toHaveAttribute(
      'href',
      'https://example.org'
    )
  })

  it('renders job content for every job', () => {
    const { container } = render(<JobExperience jobs={createJobs()} />)

    const contentBlocks = container.querySelectorAll('.cv-job-description')
    expect(contentBlocks).toHaveLength(2)
    expect(contentBlocks[0].textContent).toContain('First job details')
    expect(contentBlocks[1].textContent).toContain('Second job details')
  })
})

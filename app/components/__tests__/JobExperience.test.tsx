import { render, screen, fireEvent } from '@testing-library/react'
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
      content: '<ul class=\"job-description\"><li>First job details</li></ul>',
    },
    {
      key: 'job-2',
      position: 'Marketing Lead',
      company: 'Beta Corp',
      companyLink: 'https://example.org',
      startDate: 'Jan 2022',
      endDate: 'Dec 2023',
      description: 'Second job description',
      content: '<ul class=\"job-description\"><li>Second job details</li></ul>',
    },
  ]
}

describe('JobExperience', () => {
  it('renders job titles and companies', () => {
    render(<JobExperience jobs={createJobs()} />)

    expect(screen.getByText('Product Marketer //')).toBeInTheDocument()
    expect(screen.getByText('Marketing Lead //')).toBeInTheDocument()
  })

  it('toggles expandable job details for a single job', () => {
    const { container } = render(<JobExperience jobs={createJobs()} />)

    const toggles = screen.getAllByRole('button', { name: /expand job details/i })
    expect(toggles).toHaveLength(2)

    const firstContent = container.querySelectorAll('.cv-expand-content')[0]
    const secondContent = container.querySelectorAll('.cv-expand-content')[1]

    expect(firstContent?.classList.contains('is-expanded')).toBe(false)
    expect(secondContent?.classList.contains('is-expanded')).toBe(false)

    // Expand the first job
    fireEvent.click(toggles[0])
    expect(firstContent?.classList.contains('is-expanded')).toBe(true)
    expect(secondContent?.classList.contains('is-expanded')).toBe(false)

    // Expanding the second job should collapse the first
    fireEvent.click(toggles[1])
    expect(firstContent?.classList.contains('is-expanded')).toBe(false)
    expect(secondContent?.classList.contains('is-expanded')).toBe(true)

    // Clicking again should collapse the second job
    fireEvent.click(toggles[1])
    expect(secondContent?.classList.contains('is-expanded')).toBe(false)
  })
})

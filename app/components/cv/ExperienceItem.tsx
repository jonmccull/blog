interface ExperienceItemProps {
  position: string
  company: string
  companyLink?: string
  location?: string
  startDate: string
  endDate: string
  description?: string
  jobContent?: string
}

// One hairline row: role, company and dates, then the summary and the bullet points.
export function ExperienceItem({
  position,
  company,
  companyLink,
  location,
  startDate,
  endDate,
  description,
  jobContent,
}: ExperienceItemProps) {
  return (
    <div className="cv-experience-item fdn-row">
      <h3 className="cv-position title">{position}</h3>
      <p className="cv-meta body-sm">
        <span>
          {companyLink ? (
            <a href={companyLink} className="fdn-link" target="_blank" rel="noopener noreferrer">
              {company}
            </a>
          ) : (
            <span>{company}</span>
          )}
          {location && <span> ({location})</span>}
        </span>
        <span className="fdn-eyebrow tabular-nums">
          {startDate} → {endDate}
        </span>
      </p>
      {description && <p className="cv-summary body-sm">{description}</p>}
      {jobContent && jobContent.trim().length > 0 && (
        <div
          className="cv-job-description body-sm"
          dangerouslySetInnerHTML={{ __html: jobContent }}
        />
      )}
    </div>
  )
}

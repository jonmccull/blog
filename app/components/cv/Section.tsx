interface SectionProps {
  title: string
  children: React.ReactNode
}

export function Section({ title, children }: SectionProps) {
  return (
    <section className="cv-section">
      <h2 className="cv-section-title heading">{title}</h2>
      <div>{children}</div>
    </section>
  )
}

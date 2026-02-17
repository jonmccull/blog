import Link from 'next/link'

export const metadata = {
  title: 'Jon McCullough',
  description: 'Product marketing leader with 10+ years of experience in B2C and B2B.',
}

export default function HomePage() {
  return (
    <div className="home-editorial">
      <header className="mb-12 md:mb-16">
        <h1 className="home-name">Jon McCullough</h1>
        <p className="home-descriptor">Product marketer, positioning specialist, and builder.</p>
      </header>

      <div className="home-body">
        <p>
          I&apos;ve spent twelve years getting really good at the fundamentals&mdash;positioning,
          messaging, launching products that resonate&mdash;working with{' '}
          <a href="https://www.slite.com/" target="_blank" rel="noopener noreferrer">
            B2B startups
          </a>
          , leading{' '}
          <a href="https://www.todoist.com/" target="_blank" rel="noopener noreferrer">
            consumer apps
          </a>
          , and niche{' '}
          <a href="https://www.vivaldi.com/" target="_blank" rel="noopener noreferrer">
            web browsers
          </a>
          .
        </p>
        <p>
          In my work I strive for simplicity, making sure what we build connects with real people.
        </p>
        <p>I&apos;m open to new roles. Let&apos;s connect. &#x270C;&#xFE0F;</p>
      </div>

      <nav className="home-links" aria-label="Contact links">
        <Link href="/cv" className="home-link">
          CV
        </Link>
        <a
          href="https://www.linkedin.com/in/jonmccullough/"
          className="home-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a href="mailto:hey@jonm.cc" className="home-link">
          Mail
        </a>
      </nav>
    </div>
  )
}

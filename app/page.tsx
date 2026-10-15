import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Jon McCullough',
  description: 'Product marketing leader with 10+ years of experience in B2C and B2B.',
}

export default function HomePage() {
  return (
    <div className="home-editorial">
      <div className="home-copy">
        <header className="home-header">
          <h1 className="home-name display-xl">Jon McCullough</h1>
          <p className="home-descriptor lead">
            Product marketer, positioning specialist, and builder.
          </p>
        </header>

        <div className="home-body body">
          <p>
            I&apos;ve spent twelve years getting really good at the fundamentals&mdash;positioning,
            messaging, launching products that resonate&mdash;working with{' '}
            <a
              className="fdn-link"
              href="https://www.slite.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              B2B startups
            </a>
            , leading{' '}
            <a
              className="fdn-link"
              href="https://www.todoist.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              consumer apps
            </a>
            , and niche{' '}
            <a
              className="fdn-link"
              href="https://www.vivaldi.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              web browsers
            </a>
            .
          </p>
          <p>
            Lately, I&apos;ve been building as much as strategizing. AI workflows, automation
            systems, the infrastructure that lets small marketing teams punch well above their
            weight.
          </p>
          <p>
            {'I just joined '}
            <Link className="fdn-link" href="/cv">
              Rydoo
            </Link>
            {' as Product Marketing Manager. Let’s connect. ✌️'}
          </p>
        </div>

        <nav className="home-links body-sm" aria-label="Contact links">
          <Link href="/cv" className="fdn-link">
            CV
          </Link>
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
      </div>

      {/* Drawn on a 2px dither grid: shown at exactly 256px (1024 / 4) so the dots stay sharp.
          Two files, one per theme, swapped by CSS on data-theme (the toggle is manual, so no media query). */}
      <div className="home-portrait">
        <Image
          className="home-portrait-img is-light"
          src="/images/jon-dither-light-1024.webp"
          alt="Jon McCullough, one-bit dither portrait"
          width={256}
          height={256}
          unoptimized
          loading="eager"
        />
        <Image
          className="home-portrait-img is-dark"
          src="/images/jon-dither-dark-1024.webp"
          alt="Jon McCullough, one-bit dither portrait"
          width={256}
          height={256}
          unoptimized
          loading="eager"
        />
      </div>
    </div>
  )
}

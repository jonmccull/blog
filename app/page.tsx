import Link from 'next/link'
import HomeField from './components/HomeField'

export const metadata = {
  title: 'Jon McCullough',
  description: 'Product marketing leader with 10+ years of experience in B2C and B2B.',
}

export default function HomePage() {
  return (
    <HomeField>
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
              I&apos;ve spent twelve years getting really good at the
              fundamentals&mdash;positioning, messaging, launching products that
              resonate&mdash;working with{' '}
              <a
                className="link-underline"
                href="https://www.slite.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                B2B startups
              </a>
              , leading{' '}
              <a
                className="link-underline"
                href="https://www.todoist.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                consumer apps
              </a>
              , and niche{' '}
              <a
                className="link-underline"
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
              <Link className="link-underline" href="/cv">
                Rydoo
              </Link>
              {' as Product Marketing Manager. Let’s connect. ✌️'}
            </p>
          </div>

          <nav className="home-links body-sm" aria-label="Contact links">
            <Link href="/cv">CV</Link>
            <a
              href="https://www.linkedin.com/in/jonmccullough/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a href="mailto:hey@jonm.cc">Mail</a>
          </nav>
        </div>

        {/* One file per theme, swapped by CSS on data-theme (the toggle is manual, so no media query).
          Shown at exactly 256px: the 256 file has 1px cells for 1x screens, the 1024 file 2px cells for 2x. */}
        <div className="home-portrait">
          {/* A plain img because next/image can't take a hand-written 1x/2x srcset */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="home-portrait-img is-light"
            src="/images/jon-dither-light-soft-256.webp"
            srcSet="/images/jon-dither-light-soft-256.webp 1x, /images/jon-dither-light-soft-1024.webp 2x"
            alt="Jon McCullough, one-bit dither portrait"
            width={256}
            height={256}
            loading="eager"
            decoding="async"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="home-portrait-img is-dark"
            src="/images/jon-dither-dark-soft-256.webp"
            srcSet="/images/jon-dither-dark-soft-256.webp 1x, /images/jon-dither-dark-soft-1024.webp 2x"
            alt="Jon McCullough, one-bit dither portrait"
            width={256}
            height={256}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </HomeField>
  )
}

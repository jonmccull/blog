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
          Shown at exactly 256px: the 256 file has 1px cells for 1x screens, the 1024 file 2px cells for 2x.
          Phones show it at 128px from the 256 file alone, exact at 2x; the 1024 file would drop cells at 3x. */}
        <div className="home-portrait">
          {/* Plain imgs because next/image can't take a hand-written 1x/2x srcset */}
          <picture>
            <source media="(max-width: 767px)" srcSet="/images/jon-dither-light-soft-256.webp" />
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
          </picture>
          <picture>
            <source media="(max-width: 767px)" srcSet="/images/jon-dither-dark-soft-256.webp" />
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
          </picture>
        </div>
      </div>
    </HomeField>
  )
}

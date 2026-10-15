import Link from 'next/link'

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block ml-1"
      aria-hidden="true"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-links small">
        <Link className="site-footer-link" href="/now" aria-label="Now page">
          <span>now</span>
        </Link>
        <a
          className="site-footer-link"
          rel="noopener noreferrer"
          target="_blank"
          href="/rss"
          aria-label="RSS Feed"
        >
          <span>rss</span>
          <ArrowIcon />
        </a>
        <a
          className="site-footer-link"
          rel="noopener noreferrer"
          target="_blank"
          href="https://github.com/jonmccull/blog/"
          aria-label="View source code on GitHub"
        >
          <span>view source</span>
          <ArrowIcon />
        </a>
      </div>
      <p className="site-footer-copyright footnote">© {new Date().getFullYear()} Jon McCullough</p>
    </footer>
  )
}

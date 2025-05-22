function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block ml-1"
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
    <footer className="mt-12 mb-16 flex flex-col items-start">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-neutral-600 dark:text-neutral-400">
        <a
          className="group flex items-center hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          rel="noopener noreferrer"
          target="_blank"
          href="mailto:jon@jonmccullough.com"
        >
          <span>mail</span>
          <ArrowIcon />
        </a>
        <a
          className="group flex items-center hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          rel="noopener noreferrer"
          target="_blank"
          href="https://www.linkedin.com/in/jonmccullough/"
        >
          <span>linkedin</span>
          <ArrowIcon />
        </a>
        <a
          className="group flex items-center hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          rel="noopener noreferrer"
          target="_blank"
          href="/rss"
        >
          <span>rss</span>
          <ArrowIcon />
        </a>
        <a
          className="group flex items-center hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          rel="noopener noreferrer"
          target="_blank"
          href="https://github.com/jonmccull/blog/"
        >
          <span>view source</span>
          <ArrowIcon />
        </a>
      </div>
      <p className="mt-8 text-sm text-neutral-600 dark:text-neutral-400">
        © {new Date().getFullYear()} Jon McCullough ✌️
      </p>
    </footer>
  )
}

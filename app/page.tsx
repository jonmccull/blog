export const metadata = {
  title: 'Jon McCullough',
  description: 'Product marketing leader with 10+ years of experience in B2C and B2B.',
}

export default function HomePage() {
  return (
    <div className="max-w-2xl home-content">
      <h1 className="text-3xl font-bold tracking-tighter mb-8">Jon McCullough</h1>
      <p className="prose dark:prose-invert mb-8">
        I&apos;m a Canadian product marketer based in Norway, currently working at Doist, makers of{' '}
        <a href="https://www.todoist.com/" target="_blank" rel="noopener noreferrer">
          Todoist
        </a>{' '}
        .
      </p>
      <div className="flex gap-3 text-neutral-700 dark:text-neutral-300">
        <a href="/cv" className="link-underline hover:text-neutral-900 dark:hover:text-neutral-100">
          CV
        </a>
        <span>•</span>
        <a
          href="https://www.linkedin.com/in/jonmccullough/"
          className="link-underline hover:text-neutral-900 dark:hover:text-neutral-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <span>•</span>
        <a
          href="mailto:hey@jonm.cc"
          className="link-underline hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          Mail
        </a>
      </div>
    </div>
  )
}

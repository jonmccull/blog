import Link from 'next/link'

export const metadata = {
  title: 'Jon McCullough',
  description: 'Product marketing leader with 10+ years of experience in B2C and B2B.',
}

export default function HomePage() {
  return (
    <div className="max-w-2xl home-content home-card">
      <h1 className="text-3xl tracking-tighter mb-8">
        <span className="font-bold">Jon McCullough</span>{' '}
        <span className="font-normal text-neutral-500 dark:text-neutral-400">
          — Product marketer, positioning specialist, and builder.
        </span>
      </h1>
      <p className="prose dark:prose-invert mb-8">
        I&apos;ve spent fifteen years getting really good at the fundamentals&mdash;positioning,
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
      <p className="prose dark:prose-invert mb-8">
        In my work I strive for simplicity, making sure what we build connects with real people.
      </p>
      <p className="prose dark:prose-invert mb-8">I’m open to new roles. Let’s connect. ✌️</p>
      <div className="flex gap-3 text-neutral-700 dark:text-neutral-300">
        <Link
          href="/cv"
          className="link-underline hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          CV
        </Link>
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

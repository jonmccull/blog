export const metadata = {
  title: 'Jon McCullough',
  description: 'Product marketing leader with 10+ years of experience in B2C and B2B.',
}

export default function HomePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tighter mb-8">Jon McCullough</h1>
      <p className="prose dark:prose-invert mb-8">
        I&apos;m a Canadian product marketer based in Norway, and now I&apos;m a Product Marketer at Doist,
        working on taking a market-leading todo list app,{' '}
        <a
          href="https://www.todoist.com/"
          className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Todoist
        </a>
        , to new heights.{' '}
      </p>
    </div>
  )
}

import { BlogPosts } from 'app/components/posts'
import { JobExperience } from 'app/components/jobs'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Jon McCullough
      </h1>
      <p className="mb-4">
        I'm Jon, a marketer specializing in the positioning and growth of software products. Right now I'm a Product Marketer at Doist, working on taking a market-leading todo list app, <a href="https://www.todoist.com/" className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors" target="_blank" rel="noopener noreferrer">Todoist</a>, to the next level.
      </p>
      <p className="mb-4">
        <a href="https://www.linkedin.com/in/jonmccullough/">LinkedIn</a> ⋅ <a href="/cv">CV</a> ⋅ <a href="mailto:hey@jonm.cc">Mail</a> 
      </p>
    </section>
  )
}

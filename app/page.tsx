import { BlogPosts } from 'app/components/posts'
import { JobExperience } from 'app/components/jobs'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Jon McCullough
      </h1>
      <p className="mb-4">
        {`I'm Jon, a product marketer working with the positioning and growth of software products.`}
      </p>
      <p className="mb-4">
        <a href="/cv">CV</a>
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}

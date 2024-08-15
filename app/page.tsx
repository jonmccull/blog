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
        <a href="https://www.linkedin.com/in/jonmccullough/">LinkedIn</a> ⋅ <a href="/cv">CV</a> ⋅ <a href="mailto:hey@jonm.cc">Mail</a> 
      </p>
    </section>
  )
}

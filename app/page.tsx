import { BlogPosts } from 'app/components/posts'
import { JobExperience } from 'app/components/jobs'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Jon McCullough
      </h1>
      <p className="mb-4">
        {`Hi there, I'm Jon 👋, a marketer that loves working on bringing great products to market and keeping them there.
          
          Over the past ten or so years I’ve taken a journey through different corners of marketing. Early experience in editorial, content, and growth marketing led me to the niche where I plant my flag today: product marketing.
          
          Why product marketing? Because I’m a geek at heart. I love being close to the creation of a thing. And  see how that thing gets introduced, embraced, and maybe even loved by millions of people.
          
          Right now I’m a Product Marketer at Doist, working on taking a market-leading todo list  app, Todoist, to the next level.
          
          I work remotely from my home in Haugesund, on the west coast of Norway.
          
          If you're interested in a chat, drop me an email anytime to hey@jonm.cc`}
      </p>
      <p className="mb-4">
        <a href="https://www.linkedin.com/in/jonmccullough/">LinkedIn</a> ⋅ <a href="/cv">CV</a> ⋅ <a href="mailto:hey@jonm.cc">Mail</a> 
      </p>
    </section>
  )
}

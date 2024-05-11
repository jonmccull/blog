import { JobExperience } from 'app/components/jobs'

export const metadata = {
  title: 'Job Experience'
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Experience</h1>
      <JobExperience />
    </section>
  )
}

/*
 export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Jon McCullough
      </h1>
      <p className="mb-4">
        {`I'm Jon, a product marketer working with the positioning and growth of software products.`}
      </p>
      <div className="my-8">
      </div>
      <h2 className="cv-section-title text-2xl font-semibold tracking-tighter">
         PROFILE
      </h2>
      <ul>
        <li>- A natural product marketing leader that brings calm and clarity.</li>
        <li>- 10+ years of marketing experience across B2C and B2B.</li>
        <li>- Structured and pragmatic, but highly creative. A data-driven decision maker.</li>
        <li>- Excellent, empathic communicator that thrives in remote.</li>
      </ul>
      
      <h3 className="cv-section-title text-2xl font-semibold tracking-tighter">
        EXPERIENCE
      </h3>
        
      <div className="job">
        <h2 className="job-title mb-8 text-2xl font-semibold tracking-tighter">
          Product Marketer // <a href="https://doist.com/">Doist</a>
        </h2>
        <p className="job-dates mb-4">
          JAN 2024 → PRESENT
        </p>
          
        <p className="job-description mb-4">
          Doist is a fully remote software company that empowers people with simple yet powerful tools. I joined in January 2024 to lead on Go-to-Market efforts for updates to their flagship product, <a href="https://todoist.com/">Todoist</a>.
        </p>
      </div>
      
      <div className="job">
        <h2 className="job-title mb-8 text-2xl font-semibold tracking-tighter">
          Team Lead, Product Marketing // <a href="http://deel.com">Deel</a>
        </h2>
          
        <p className="job-dates mb-4">SEP 2023 → DEC 2023</p>
          
        <p className="job-description mb-4">
          Deel is the all-in-one HR platform for global teams. It helps companies simplify every aspect of managing an international workforce, from culture and onboarding, to local payroll and compliance. Deel works for independent contractors and full-time employees in more than 150 countries, compliantly.
        </p>
      </div>
      
      <div className="job">
        <h2 className="job-title mb-8 text-2xl font-semibold tracking-tighter">
            Senior Product Marketing Manager // <a href="https://slite.com/">Slite</a>
        </h2>
          
        <p className="job-dates mb-4">MAY 2022 → APR 2023</p>
          
        <p className="job-description mb-4">Slite is a Series A funded SaaS company making collaborative software. I joined as solo PMM to shepherd Slite through a period of re-positioning, bolster activation, lead on critical product launches and – as part of the Product Leadership group – help shape the roadmap for Slite’s future.</p>
        
        <ul class="job-description">
          <li>- Led on two critical product launches (Ask and Discussions)</li>
          <li>- Established product update comms workflow and cadence</li>
          <li>- Re-developed core product positioning, messaging and pitch</li>
        </ul>
      </div>
      
      <div className="job">
        <h2 className="job-title mb-8 text-2xl font-semibold tracking-tighter">
          Head of Product Marketing // <a href="https://vivaldi.com/">Vivaldi</a>
        </h2>
          
        <p className="job-dates mb-4">FEB 2021 → APR 2022</p>
          
        <p className="job-description mb-4">As the lead on Product Marketing I tackled branding, positioning, user acquisition and activation. I worked at the intersection of product development, marketing, PR, and community, with a view of gaining growth in the millions of users globally.</p>
        
        <ul class="job-description">
          <li>- Lead on brand, development of messaging, positioning and GTM strategies</li>
          <li>- DRI on flagship launches including <a href="https://play.google.com/store/apps/details?id=com.vivaldi.browser&hl=en&gl=US&pli=1">Vivaldi Android</a>, <a href="https://vivaldi.com/android/automotive/">Android Automotive</a> and <a href="https://vivaldi.com/features/mail/">Mail (beta)</a></li>
          <li>- Managed a cross-functional squad with ownership of Vivaldi’s main acquisition channels</li>
        </ul>
      </div>
      
      <div className="job">
        <h2 className="job-title mb-8 text-2xl font-semibold tracking-tighter">
          Growth Marketing Manager // <a href="https://vivaldi.com/">Vivaldi</a>
        </h2>
        
        <p className="job-dates mb-4">NOV 2016 → FEB 2021</p>
          
        <p className="job-description mb-4">I joined Vivaldi as Manager on a small marketing team of four. Areas of responsibility varied widely, but focused primarily on user acquisition, onboarding/ activation, establishing departmental strategy/workflow, KPIs and dashboards, and cross-channel content creation in support of product launches.</p>
          
        <ul class="job-description">
          <li>- Lead on product launch strategy and execution</li>
          <li>- MAU from 500,000 → 2.5M. Monthly unique visits to vivaldi.com from 600,000 → 1.6M</li>
          <li>- Consistent top tier PR coverage (e.g. <a href="https://www.theverge.com/2019/9/9/20853651/vivaldi-browser-android-mobile-beta-sync-chrome-firefox-opera">Verge</a>, <a href="https://techcrunch.com/tag/vivaldi/">TechCrunch</a>, <a href="https://www.wired.com/story/try-vivaldi-browser-android-chrome/">Wired</a>)</li>
        </ul>
      </div>
      
      <div className="job">
        <h2 className="job-title mb-8 text-2xl font-semibold tracking-tighter">
          Head of Editorial & Media // <a href="https://billetto.com/">Billetto</a>
        </h2>
          
        <p className="job-dates mb-4">FEB 2015 → MAR 2016</p>
          
        <p className="job-description mb-4">Strategic direction and implementation of global content and communication strategy during Billetto’s rapid European expansion.</p>
          
        <ul class="job-description">
          <li>- Led a remote, multi-national editorial team of six</li>
          <li>- Developed Billetto’s content curation, publishing and comms frameworks</li>
          <li>- Product owner on Billetto’s key B2C experience, event discovery</li>
        </ul>
      </div>
      
      <div className="job">
        <h2 className="job-title mb-8 text-2xl font-semibold tracking-tighter">
          Editorial Manager // <a href="https://billetto.com/">Billetto</a>
        </h2>
          
        <p className="job-dates mb-4">MAR 2013 → MAR 2015</p>
          
        <p className="job-description mb-4">Concept and launch of editorial and digital marketing strategies to penetrate the UK's extremely competitive online ticketing and event discovery market.</p>
          
        <ul class="job-description">
          <li>- Lead on brand, comms and content strategy</li>
          <li>- From zero → 700,000 new members, 50,000 MAUs, and 70,000 newsletter subscribers by end of year two in a new market</li>
          <li>- From zero → 100,000 unique visits and 500,000 page views per month</li>
        </ul>
      </div>
      
      <h3 className="cv-section-title text-2xl font-semibold tracking-tighter">
        VOLUNTEER & FREELANCE
      </h3>
        
      **FOUNDER** // MC Consulting 
      <p className="job-dates mb-4">
        SEP 2023 → PRESENT
      </p>
        
      **AI TRAINER** // [Iris AI](http://iris.ai/)
      <p className="job-dates mb-4">
        JUN 2016 → DEC 2016
      </p>
        
      **PROJECT MANAGER** // [Superside](https://superside.com/)
      <p className="job-dates mb-4">
        APR 2016 → OCT 2016
      </p>
        
      **SENIOR DIGITAL ADVISOR** // Kry
      <p className="job-dates mb-4">
        APR 2016 → DEC 2016
      </p>
        
      <h3 className="cv-section-title text-2xl font-semibold tracking-tighter">
        EDUCATION
      </h3>
        
      **Bachelor's of Science (Biology)**
      University of Victoria, Canada
      <p className="job-dates mb-4">
        2001 → 2005
      </p>
        
      **High School Diploma (Honors with Distinction)**
      F.H. Collins Secondary, Canada
      <p className="job-dates mb-4">
        1997 → 2001
      </p>
    </section>
  )
}
*/
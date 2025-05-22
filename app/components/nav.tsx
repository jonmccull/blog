import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = {
  '/': {
    name: 'home',
    label: 'Home page',
  },
  '/blog': {
    name: 'posts',
    label: 'Blog posts',
  },
}

export function Navbar() {
  const pathname = usePathname()

  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
          aria-label="Main navigation"
        >
          <div className="flex flex-row space-x-0 pr-10" role="list">
            {Object.entries(navItems).map(([path, { name, label }]) => {
              const isActive = pathname === path
              return (
                <Link
                  key={path}
                  href={path}
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    transition-all hover:text-neutral-800 dark:hover:text-neutral-200 
                    flex align-middle relative py-1 px-2 m-1 rounded
                    focus:outline-none focus:ring-2 focus:ring-neutral-400
                    ${isActive ? 'font-bold' : ''}
                  `}
                >
                  {name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </aside>
  )
}

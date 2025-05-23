'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

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
          className="flex flex-row items-center relative px-0 pb-0 fade md:overflow-visible scroll-pr-6 md:relative"
          id="nav"
          aria-label="Main navigation"
        >
          <div className="flex flex-row space-x-0" role="list">
            {Object.entries(navItems).map(([path, { name, label }]) => {
              const isActive = pathname === path
              return (
                <Link
                  key={path}
                  href={path}
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    nav-link
                    transition-all duration-200
                    text-neutral-600 dark:text-neutral-400
                    hover:text-neutral-900 dark:hover:text-neutral-100
                    flex align-middle relative py-1 px-2 m-1
                    focus:outline-none
                    ${isActive ? 'nav-link-active text-neutral-900 dark:text-neutral-100' : ''}
                  `}
                >
                  {name}
                </Link>
              )
            })}
          </div>
          <div className="flex items-center ml-auto">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </aside>
  )
}

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
    <header className="fdn-bar site-bar">
      <Link href="/" className="fdn-wordmark">
        Jon McCullough
      </Link>
      <nav id="nav" aria-label="Main navigation">
        <div className="site-bar-links" role="list">
          {Object.entries(navItems).map(([path, { name, label }]) => {
            const isActive = pathname === path
            return (
              <Link
                key={path}
                href={path}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
              >
                {name}
              </Link>
            )
          })}
        </div>
        <ThemeToggle />
      </nav>
    </header>
  )
}

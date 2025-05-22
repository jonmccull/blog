import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import JsonLd from './components/JsonLd'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Jon McCullough',
    template: '%s | Jon McCullough',
  },
  description: 'Jon McCullough is a Canadian product marketer based in Norway working at Doist. Welcome to his digital garden. 🌳',
  openGraph: {
    title: 'Jon McCullough',
    description: 'Jon McCullough is a Canadian product marketer based in Norway working at Doist. Welcome to his digital garden. 🌳',
    url: baseUrl,
    siteName: 'Jon McCullough',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og/default.png`,
        width: 1200,
        height: 630,
        alt: 'Jon McCullough',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jon McCullough',
    description: 'Jon McCullough is a Canadian product marketer based in Norway working at Doist. Welcome to his digital garden. 🌳',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Jon McCullough',
  description: 'Jon McCullough is a Canadian product marketer based in Norway working at Doist.',
  url: baseUrl,
  author: {
    '@type': 'Person',
    name: 'Jon McCullough',
    url: baseUrl,
    jobTitle: 'Product Marketer',
    worksFor: {
      '@type': 'Organization',
      name: 'Doist',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <head>
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <JsonLd data={websiteSchema} />
      </head>
      <body className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}

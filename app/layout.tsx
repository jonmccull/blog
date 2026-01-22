import './styles/base.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import JsonLd from './components/JsonLd'
import Script from 'next/script'
import Providers from './components/Providers'
import AnimatedContainer from './components/AnimatedContainer'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Jon McCullough',
    template: '%s | Jon McCullough',
  },
  description:
    'Jon McCullough is a Canadian product marketer based in Norway working at Doist. Welcome to his digital garden. 🌳',
  openGraph: {
    title: 'Jon McCullough',
    description:
      'Jon McCullough is a Canadian product marketer based in Norway working at Doist. Welcome to his digital garden. 🌳',
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
    description:
      'Jon McCullough is a Canadian product marketer based in Norway working at Doist. Welcome to his digital garden. 🌳',
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

const cx = (...classes: (string | boolean | undefined | null)[]): string =>
  classes.filter(Boolean).join(' ')

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cx('h-full', GeistSans.variable, GeistMono.variable)}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#171717" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.classList.add('no-transitions');
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
                requestAnimationFrame(function() {
                  requestAnimationFrame(function() {
                    document.documentElement.classList.remove('no-transitions');
                  });
                });
              })();
            `,
          }}
        />
        <JsonLd data={websiteSchema} />
      </head>
      <body className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 antialiased h-full">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-neutral-900 focus:text-white dark:focus:bg-white dark:focus:text-neutral-900 focus:rounded-md focus:outline-none"
        >
          Skip to main content
        </a>
        <Providers>
          <AnimatedContainer className="mx-4 mt-8 lg:mx-auto">
            <main id="main-content" className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
              <Navbar />
              {children}
              <Footer />
            </main>
          </AnimatedContainer>
        </Providers>
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}

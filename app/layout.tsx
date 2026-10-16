import './styles/foundations/tokens.css'
import './styles/foundations/bundle.css'
import './styles/base.css'
import type { Metadata } from 'next'
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

// Sets data-theme before first paint: the stored choice, else the OS preference. Light is no attribute.
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    if (theme !== 'dark' && theme !== 'light') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  } catch (e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* These two mirror --ground in app/styles/foundations/tokens.css (light and dark). */}
        <meta name="theme-color" content="#151a17" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f2f3f1" media="(prefers-color-scheme: light)" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* The kit's one fonts link (foundations-kit fonts.html). The root layout covers every page. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className="fdn-page h-full">
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only">
          Skip to main content
        </a>
        <Providers>
          <AnimatedContainer className="mx-4 lg:mx-auto">
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main
                id="main-content"
                className="flex-auto min-w-0 mt-[var(--main-top)] flex flex-col"
              >
                {children}
              </main>
              <Footer />
            </div>
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

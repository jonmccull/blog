const CACHE_NAME = 'blog-cache-v1'

// Assets to cache
const STATIC_ASSETS = ['/', '/blog']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle GET requests with http/https schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return
  }

  event.respondWith(
    caches.match(request).then((response) => {
      // Return cached version or fetch new version
      return (
        response ||
        fetch(request).then((response) => {
          // Cache new successful responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
      )
    })
  )
})

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
})

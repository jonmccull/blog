// Bump the name whenever the site's look changes, so returning visitors drop the old cache.
const CACHE_NAME = 'blog-cache-v2'

// Assets to cache
const STATIC_ASSETS = ['/', '/blog']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
})

function cacheResponse(request, response) {
  if (response.ok) {
    const responseClone = response.clone()
    caches.open(CACHE_NAME).then((cache) => {
      cache.put(request, responseClone)
    })
  }
  return response
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle GET requests with http/https schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return
  }

  // Pages: network first, so a new deploy shows at once; the cache is the offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => cacheResponse(request, response))
        .catch(() => caches.match(request))
    )
    return
  }

  // Everything else: cache first
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).then((fresh) => cacheResponse(request, fresh))
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

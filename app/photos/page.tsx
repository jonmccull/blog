import Gallery from './Gallery'
import { photos } from './photos'

export const metadata = {
  title: 'Photos',
  description: 'Photographs by Jon McCullough.',
  // A quiet page: reachable by its address, not from the nav, the sitemap or search engines.
  robots: { index: false, follow: false },
}

export default function PhotosPage() {
  return (
    <section className="photos">
      <h1 className="page-title display-lg">Photos</h1>
      {photos.length === 0 ? (
        <p className="photos-empty body">Nothing here yet.</p>
      ) : (
        <Gallery photos={photos} />
      )}
    </section>
  )
}

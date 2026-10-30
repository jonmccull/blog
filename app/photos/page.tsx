import NextImage from 'next/image'
import { photos, type Photo } from './photos'

export const metadata = {
  title: 'Photos',
  description: 'Photographs by Jon McCullough.',
  // A quiet page: reachable by its address, not from the nav, the sitemap or search engines.
  robots: { index: false, follow: false },
}

// The gear side of a caption: camera, then lens, film stock and exposure, whichever are given
function gear({ camera, lens, film, settings }: Photo) {
  return [camera, lens, film, settings].filter(Boolean).join(' · ')
}

function monthYear(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

export default function PhotosPage() {
  return (
    <section className="photos">
      <h1 className="page-title display-lg">Photos</h1>
      {photos.length === 0 ? (
        <p className="photos-empty body">Nothing here yet.</p>
      ) : (
        <ol className="photos-list">
          {photos.map((photo, index) => (
            <li key={photo.image.src}>
              <figure className="photo">
                <NextImage
                  src={photo.image}
                  alt={photo.alt}
                  className="photo-image"
                  quality={85}
                  sizes="(max-width: 896px) 100vw, 896px"
                  placeholder="blur"
                  priority={index === 0}
                />
                <figcaption className="photo-caption">
                  <span>{gear(photo)}</span>
                  <span>
                    {photo.location}
                    {photo.date && (
                      <>
                        {' · '}
                        <time dateTime={photo.date}>{monthYear(photo.date)}</time>
                      </>
                    )}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

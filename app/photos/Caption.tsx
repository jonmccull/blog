import type { Photo } from './photos'

// The gear side of a caption: camera, then lens, film stock and exposure, whichever are given
export function gear({ camera, lens, film, settings }: Photo) {
  return [camera, lens, film, settings].filter(Boolean).join(' · ')
}

export function monthYear(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

export function Caption({ photo }: { photo: Photo }) {
  return (
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
  )
}

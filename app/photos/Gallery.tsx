'use client'

import NextImage from 'next/image'
import { useCallback, useRef, useState } from 'react'
import type { Photo } from './photos'

// The gear side of a caption: camera, then lens, film stock and exposure, whichever are given
export function gear({ camera, lens, film, settings }: Photo) {
  return [camera, lens, film, settings].filter(Boolean).join(' · ')
}

export function monthYear(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

function Caption({ photo }: { photo: Photo }) {
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

const SWIPE = 40 // px of horizontal travel that counts as a swipe

// The column of photos, and the lightbox: a native dialog on the page ground that shows one photo
// fitted to the screen with its caption. Esc, the mark in the corner or a click outside close it;
// the arrow keys, the side marks or a swipe move along the list. No motion, like the rest of the site.
export default function Gallery({ photos }: { photos: Photo[] }) {
  const [current, setCurrent] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const touchStart = useRef<number | null>(null)

  const open = (index: number) => {
    setCurrent(index)
    dialog.current?.showModal()
  }
  const close = () => dialog.current?.close()
  const step = useCallback(
    (by: number) =>
      setCurrent((index) =>
        index === null ? index : (index + by + photos.length) % photos.length
      ),
    [photos.length]
  )

  const photo = current === null ? null : photos[current]

  return (
    <>
      <ol className="photos-list">
        {photos.map((item, index) => (
          <li key={item.image.src}>
            <figure className="photo">
              <button
                type="button"
                className="photo-open"
                onClick={() => open(index)}
                aria-haspopup="dialog"
              >
                <NextImage
                  src={item.image}
                  alt={item.alt}
                  className="photo-image"
                  quality={85}
                  sizes="(max-width: 896px) 100vw, 896px"
                  placeholder="blur"
                  priority={index === 0}
                />
              </button>
              <Caption photo={item} />
            </figure>
          </li>
        ))}
      </ol>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Photo"
        onClose={() => setCurrent(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) close()
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1)
          if (event.key === 'ArrowLeft') step(-1)
        }}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return
          const travel = event.changedTouches[0].clientX - touchStart.current
          touchStart.current = null
          if (travel <= -SWIPE) step(1)
          if (travel >= SWIPE) step(-1)
        }}
      >
        {photo && (
          <figure className="lightbox-figure">
            <NextImage
              src={photo.image}
              alt={photo.alt}
              className="lightbox-image"
              quality={85}
              sizes="100vw"
              priority
            />
            <Caption photo={photo} />
          </figure>
        )}
        <button type="button" className="lightbox-mark is-close" onClick={close} aria-label="Close">
          ×
        </button>
        {photos.length > 1 && (
          <>
            <button
              type="button"
              className="lightbox-mark is-prev"
              onClick={() => step(-1)}
              aria-label="Previous photo"
            >
              ←
            </button>
            <button
              type="button"
              className="lightbox-mark is-next"
              onClick={() => step(1)}
              aria-label="Next photo"
            >
              →
            </button>
          </>
        )}
      </dialog>
    </>
  )
}

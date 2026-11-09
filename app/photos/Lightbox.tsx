'use client'

import NextImage from 'next/image'
import { useCallback, useRef, type Dispatch, type RefObject, type SetStateAction } from 'react'
import { Caption } from './Caption'
import type { Photo } from './photos'

const SWIPE = 40 // px of horizontal travel that counts as a swipe

// The width that fits the screen with the caption under it: the screen's width less the padding, or what the
// screen's height allows at the picture's own shape, whichever is less. Set as a width (not left to the
// picture's own size) because a browser served a smaller file than it asked for would shrink it otherwise.
export function fitWidth({ image }: Photo) {
  const ratio = (image.width / image.height).toFixed(4)
  return `min(calc(100vw - 2 * var(--space-5)), calc((100dvh - var(--space-9) - var(--space-5)) * ${ratio}))`
}

// The indices either side of the open one, each once, so the next step finds its file already fetched. It wraps at
// both ends; with two photos both sides are the same photo, and with one there are none.
export function neighbourIndices(current: number, count: number) {
  return [...new Set([(current + 1) % count, (current - 1 + count) % count])].filter(
    (index) => index !== current
  )
}

// The lightbox: a native dialog on the page ground that shows one photo fitted to the screen with its
// caption. Esc, the mark in the corner or a click outside close it; the arrow keys, the side marks or a swipe
// move along the list. No motion, like the rest of the site. The gallery owns which photo is open (`current`,
// null when closed) and opens the dialog; this draws it and moves along the list.
export default function Lightbox({
  photos,
  current,
  setCurrent,
  dialog,
}: {
  photos: Photo[]
  current: number | null
  setCurrent: Dispatch<SetStateAction<number | null>>
  dialog: RefObject<HTMLDialogElement | null>
}) {
  const touchStart = useRef<number | null>(null)

  const close = () => dialog.current?.close()
  const step = useCallback(
    (by: number) =>
      setCurrent((index) =>
        index === null ? index : (index + by + photos.length) % photos.length
      ),
    [photos.length, setCurrent]
  )

  const photo = current === null ? null : photos[current]
  const neighbours =
    current === null ? [] : neighbourIndices(current, photos.length).map((index) => photos[index])

  return (
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
            style={{ width: fitWidth(photo) }}
          />
          <Caption photo={photo} />
        </figure>
      )}
      {neighbours.length > 0 && (
        // Same props as the open photo so the browser asks for the same file; hidden, so it is neither seen nor read
        <div hidden aria-hidden="true">
          {neighbours.map((item) => (
            <NextImage
              key={item.image.src}
              src={item.image}
              alt=""
              quality={85}
              sizes="100vw"
              loading="eager"
            />
          ))}
        </div>
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
  )
}

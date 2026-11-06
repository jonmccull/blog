'use client'

import NextImage from 'next/image'
import { useRef, useState, type CSSProperties } from 'react'
import { Caption } from './Caption'
import Lightbox from './Lightbox'
import type { Photo } from './photos'

// The column of photos. Opening one hands it to the lightbox.
export default function Gallery({ photos }: { photos: Photo[] }) {
  const [current, setCurrent] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  const open = (index: number) => {
    setCurrent(index)
    dialog.current?.showModal()
  }

  return (
    <>
      <ol className="photos-list">
        {photos.map((item, index) => (
          <li key={item.image.src}>
            <figure
              className="photo"
              style={{ '--photo-ratio': item.image.width / item.image.height } as CSSProperties}
            >
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
      <Lightbox photos={photos} current={current} setCurrent={setCurrent} dialog={dialog} />
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'

type ImageSlideshowProps = {
  images: {
    src: string
    alt: string
  }[]
  interval?: number
}

// Steps through the images on a timer. The kit allows no motion, so each step is a cut, not a slide,
// and under reduced motion it does not advance on its own.
export default function ImageSlideshow({ images, interval = 4000 }: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className="slideshow-container">
      <div className="slideshow-viewport">
        <div
          className="slideshow-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={`${image.src}-${index}`}
              src={image.src}
              alt={image.alt}
              className="slideshow-image"
              aria-hidden={index !== currentIndex}
            />
          ))}
        </div>
      </div>
      <div className="slideshow-dots">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={`slideshow-dot ${index === currentIndex ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  )
}

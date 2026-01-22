'use client'

import { useState, useEffect, useRef } from 'react'

type ImageSlideshowProps = {
  images: {
    src: string
    alt: string
  }[]
  interval?: number
}

export default function ImageSlideshow({ images, interval = 4000 }: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const trackRef = useRef<HTMLDivElement>(null)

  // Create extended array with first image cloned at the end for seamless looping
  const extendedImages = [...images, images[0]]

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  // Handle the seamless reset when reaching the cloned slide
  useEffect(() => {
    if (currentIndex === images.length) {
      // We're at the cloned first image, wait for transition to finish then reset
      const timeout = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(0)
      }, 500) // Match the CSS transition duration

      return () => clearTimeout(timeout)
    } else if (!isTransitioning) {
      // Re-enable transitions after the instant reset
      requestAnimationFrame(() => {
        setIsTransitioning(true)
      })
    }
  }, [currentIndex, images.length, isTransitioning])

  const handleDotClick = (index: number) => {
    setIsTransitioning(true)
    setCurrentIndex(index)
  }

  // Calculate which dot should be active (wrap around for the cloned slide)
  const activeDotIndex = currentIndex >= images.length ? 0 : currentIndex

  return (
    <div className="slideshow-container">
      <div
        ref={trackRef}
        className="slideshow-track"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
        }}
      >
        {extendedImages.map((image, index) => (
          <img
            key={`${image.src}-${index}`}
            src={image.src}
            alt={image.alt}
            className="slideshow-image"
          />
        ))}
      </div>
      <div className="slideshow-dots">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`slideshow-dot ${index === activeDotIndex ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

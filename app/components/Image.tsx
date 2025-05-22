'use client'

import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { useState } from 'react'

type ImageProps = {
  alt: string
  caption?: string
} & Omit<NextImageProps, 'alt'>

export default function Image({ alt, caption, ...props }: ImageProps) {
  const [isLoading, setLoading] = useState(true)

  return (
    <figure className="my-8">
      <div
        className={`overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 transition-opacity ${
          isLoading ? 'animate-pulse' : ''
        }`}
      >
        <NextImage
          className={`
            duration-700 ease-in-out
            ${isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-100'}
          `}
          onLoadingComplete={() => setLoading(false)}
          alt={alt}
          {...props}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
} 
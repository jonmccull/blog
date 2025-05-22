import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { useState } from 'react'

type ImageProps = {
  alt: string
  caption?: string
} & Omit<NextImageProps, 'alt'>

export default function Image({ alt, caption, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true)

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
            ${isLoading ? 'scale-[1.02] blur-xl grayscale' : 'scale-100 blur-0 grayscale-0'}
          `}
          onLoadingComplete={() => setIsLoading(false)}
          alt={alt}
          quality={100}
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
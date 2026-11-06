import MdxImage from './MdxImage'

type ThemedImageProps = {
  src: string
  darkSrc: string
  alt: string
}

// One image per theme, swapped by CSS on data-theme like the home portrait. The hidden one is display: none,
// so screen readers hear the alt text once, and next/image's lazy loading never fetches it.
export default function ThemedImage({ src, darkSrc, alt }: ThemedImageProps) {
  return (
    <span className="themed-image">
      <span className="themed-image-light">
        <MdxImage src={src} alt={alt} />
      </span>
      <span className="themed-image-dark">
        <MdxImage src={darkSrc} alt={alt} />
      </span>
    </span>
  )
}

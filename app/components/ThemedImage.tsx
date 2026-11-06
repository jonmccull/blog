import MdxImage from './MdxImage'

type ThemedImageProps = {
  src: string
  darkSrc: string
  alt: string
}

// One image per theme, swapped by CSS on data-theme like the home portrait (.theme-light, .theme-dark in base.css).
// The hidden one is display: none, so screen readers hear the alt text once, and next/image's lazy loading never fetches it.
export default function ThemedImage({ src, darkSrc, alt }: ThemedImageProps) {
  return (
    <>
      <MdxImage src={src} alt={alt} className="theme-light" />
      <MdxImage src={darkSrc} alt={alt} className="theme-dark" />
    </>
  )
}

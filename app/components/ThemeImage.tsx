type ThemeImageProps = {
  light: string
  dark: string
  alt: string
  width: number
  height: number
  caption?: string
}

// A figure with one render per theme, swapped by CSS on data-theme like the home portrait. Never filter one render.
// Plain imgs so the one-bit files reach the screen untouched: next/image would resample and re-encode them.
export default function ThemeImage({ light, dark, alt, width, height, caption }: ThemeImageProps) {
  return (
    <figure className="figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="theme-image is-light"
        src={light}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="theme-image is-dark"
        src={dark}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
      {caption && <figcaption className="fdn-caption">{caption}</figcaption>}
    </figure>
  )
}

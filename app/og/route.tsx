import { ImageResponse } from 'next/og'

// The OG renderer cannot read CSS variables, so these two literals mirror the kit's light
// --ground and --ink (app/styles/foundations/tokens.css). Update them with the kit.
const GROUND = '#f2f3f1'
const INK = '#2b302d'

export function GET(request: Request) {
  const url = new URL(request.url)
  const title = url.searchParams.get('title') || 'Jon McCullough | Product Marketer'

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full items-center justify-center"
        style={{ backgroundColor: GROUND, color: INK }}
      >
        <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
          <h2 tw="flex flex-col text-4xl font-bold tracking-tight text-left">{title}</h2>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

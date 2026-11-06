// Drafts alt text for a prepared photo with Claude, for the pull request to check. Reads the resized
// WebP (EXIF already stripped, so no GPS leaves the runner) at 1568px, the size the API reads images
// at. Needs ANTHROPIC_API_KEY; the photos workflow passes the repository secret of that name.
import sharp from 'sharp'

export const MODEL = 'claude-opus-5-5'

const SYSTEM = `You write alt text for photographs on a personal website's photo page. Screen readers read it aloud to people who cannot see the picture, so it should give a listener what a sighted visitor takes in at a glance.

- Lead with the subject, then the setting, then the one or two details that make the photo what it is (light, weather, colour, mood, composition) when they matter.
- One or two plain sentences, usually under 150 characters and never over 250.
- Do not start with "Image of", "Photo of" or "Picture of": the screen reader already announces an image. Do say if the photo is black and white.
- Name a thing (a guitar model, a landmark) only when you are sure; otherwise describe it plainly.
- Include any legible text that matters to the picture.
- The page shows the camera, place and date in a caption next to the photo, so do not repeat them.

Reply with the alt text only: no quotes, labels or preamble.`

// The model's reply as a list field: one line, no wrapping quotes, label or redundant lead-in
export function cleanAlt(text) {
  return String(text)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^alt(?:\s+text)?:\s*/i, '')
    .replace(/^["'“‘](.*)["'”’]$/, '$1')
    .replace(/^(?:an?\s+)?(?:image|photo|photograph|picture)\s+of\s+/i, '')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

// One request per photo; throws with a reason the pull request summary can show. The SDK loads
// only when a request is made, so a run without the key never needs it.
/** @param {string} file @param {{ location?: string, client?: any }} [options] */
export async function draftAlt(file, { location = '', client } = {}) {
  if (!client) {
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    client = new Anthropic()
  }
  const image = await sharp(file)
    .resize({ width: 1568, height: 1568, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer()
  const context = location
    ? ` It was taken in ${location}; that is in the caption, so use it only to recognise what is shown.`
    : ''
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium' },
    system: SYSTEM,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: image.toString('base64') },
          },
          { type: 'text', text: `Write the alt text for this photo.${context}` },
        ],
      },
    ],
  })
  if (response.stop_reason === 'refusal') throw new Error('the model declined to describe it')
  if (response.stop_reason === 'max_tokens') throw new Error('the reply was cut off')
  const alt = cleanAlt(
    response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join(' ')
  )
  if (!alt) throw new Error('the reply was empty')
  return alt
}

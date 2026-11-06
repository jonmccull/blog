import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { MODEL, cleanAlt, draftAlt } from '../alt-text.mjs'

type Reply = { stop_reason: string; content: { type: string; text?: string }[] }

// Stands in for the SDK client: records the request, returns a canned reply
function fakeClient(reply: Reply) {
  const calls: Record<string, unknown>[] = []
  return {
    calls,
    client: {
      beta: {
        messages: { create: async (body: Record<string, unknown>) => (calls.push(body), reply) },
      },
    },
  }
}

async function photo() {
  const file = join(mkdtempSync(join(tmpdir(), 'alt-')), 'p.webp')
  await sharp({ create: { width: 3000, height: 2000, channels: 3, background: '#88a' } })
    .webp()
    .toFile(file)
  return file
}

describe('alt text', () => {
  it('cleans the reply into one plain line', () => {
    expect(cleanAlt('  "A red guitar\n on a bench."  ')).toBe('A red guitar on a bench.')
    expect(cleanAlt('Alt text: Photo of a church window')).toBe('A church window')
    expect(cleanAlt('An image of fog on a bus stop')).toBe('Fog on a bus stop')
    expect(cleanAlt('Black and white: fencing and grass')).toBe(
      'Black and white: fencing and grass'
    )
    expect(cleanAlt('')).toBe('')
  })

  it('sends the photo at 1568px with the location as context', async () => {
    const { client, calls } = fakeClient({
      stop_reason: 'end_turn',
      content: [
        { type: 'thinking' },
        { type: 'text', text: 'A wire fence runs towards a grey sea.' },
      ],
    })
    const alt = await draftAlt(await photo(), { location: 'Haugesund, Norway', client })
    expect(alt).toBe('A wire fence runs towards a grey sea.')
    const body = calls[0] as {
      model: string
      messages: { content: { type: string; source?: { data: string }; text?: string }[] }[]
    }
    expect(body.model).toBe(MODEL)
    const [image, text] = body.messages[0].content
    const { width, height } = await sharp(Buffer.from(image.source!.data, 'base64')).metadata()
    expect([width, height]).toEqual([1568, 1045])
    expect(text.text).toContain('Haugesund, Norway')
  })

  it('throws a reason instead of writing a refusal or an empty reply', async () => {
    const file = await photo()
    const refused = fakeClient({ stop_reason: 'refusal', content: [] }).client
    await expect(draftAlt(file, { client: refused })).rejects.toThrow('declined')
    const empty = fakeClient({
      stop_reason: 'end_turn',
      content: [{ type: 'text', text: ' ' }],
    }).client
    await expect(draftAlt(file, { client: empty })).rejects.toThrow('empty')
  })
})

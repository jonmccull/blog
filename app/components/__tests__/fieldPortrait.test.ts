import { mountPortrait, type FieldFrame } from '../fieldPortrait'

// The portrait draws only the cells a ripple moves. These check that every frame still matches a full redraw
// pixel for pixel (the loop the file used before), and that a ripple away from the portrait draws nothing.

const SIZE = 256 // jsdom's devicePixelRatio is 1
const GROUND = [0xf4, 0xf1, 0xea]
const LIME = [0xc6, 0xff, 0x3d]

// A made-up portrait: paper, ink and some in-between greys, from a fixed hash so every run is the same
const source = new Uint8ClampedArray(SIZE * SIZE * 4)
for (let p = 0; p < SIZE * SIZE; p++) {
  const n = (Math.imul(p ^ (p >> 7), 2654435761) >>> 24) / 255
  const v = n < 0.5 ? 1 : n < 0.8 ? 0 : n
  for (let c = 0; c < 3; c++) source[p * 4 + c] = Math.round(0x1a + (GROUND[c] - 0x1a) * v)
  source[p * 4 + 3] = 255
}

const canvases = new Map<HTMLCanvasElement, Uint8ClampedArray>()
const puts: number[][] = []

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement) {
    const { width } = this
    const pixels = new Uint8ClampedArray(width * this.height * 4)
    canvases.set(this, pixels)
    return {
      drawImage() {},
      getImageData: () => ({ data: source }),
      createImageData: (w: number, h: number) => ({
        data: new Uint8ClampedArray(w * h * 4),
        width: w,
        height: h,
      }),
      putImageData(
        image: ImageData,
        _dx: number,
        _dy: number,
        x: number,
        y: number,
        w: number,
        h: number
      ) {
        puts.push([x, y, w, h])
        for (let row = y; row < y + h; row++) {
          const from = (row * width + x) * 4
          pixels.set(image.data.subarray(from, from + w * 4), from)
        }
      },
    } as unknown as CanvasRenderingContext2D
  } as unknown as typeof HTMLCanvasElement.prototype.getContext
  window.getComputedStyle = (() => ({
    getPropertyValue: (name: string) =>
      ({ '--ground': '#f4f1ea', '--lime': '#c6ff3d' })[name] ?? '',
  })) as unknown as typeof window.getComputedStyle
  window.ResizeObserver = class {
    observe() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  window.Image = class {
    onload: (() => void) | null = null
    set src(_: string) {
      setTimeout(() => this.onload?.())
    }
  } as unknown as typeof Image
})

// The reference: every pixel, every frame, as the file drew before
const weights = (() => {
  const w = new Float32Array(SIZE * SIZE)
  let max = 0
  let best = 0
  for (let p = 0; p < w.length; p++) {
    w[p] = Math.hypot(
      source[p * 4] - GROUND[0],
      source[p * 4 + 1] - GROUND[1],
      source[p * 4 + 2] - GROUND[2]
    )
    if (w[p] > max) {
      max = w[p]
      best = p
    }
  }
  for (let p = 0; p < w.length; p++) w[p] /= max
  return { w, ink: [source[best * 4], source[best * 4 + 1], source[best * 4 + 2]] }
})()

function sample(a: Float32Array, f: FieldFrame, sx: number, sy: number) {
  const gx = sx / f.cellWidth - 0.5
  const gy = sy / f.cellHeight - 0.5
  const x0 = Math.max(0, Math.min(f.cols - 2, Math.floor(gx)))
  const y0 = Math.max(0, Math.min(f.rows - 2, Math.floor(gy)))
  const tx = Math.min(1, Math.max(0, gx - x0))
  const ty = Math.min(1, Math.max(0, gy - y0))
  const i = y0 * f.cols + x0
  const top = a[i] + (a[i + 1] - a[i]) * tx
  const bot = a[i + f.cols] + (a[i + f.cols + 1] - a[i + f.cols]) * tx
  return top + (bot - top) * ty
}

function reference(f: FieldFrame | null) {
  const o = new Uint8ClampedArray(SIZE * SIZE * 4)
  const g = Math.ceil(SIZE / 4) + 1
  const dx = new Float32Array(g * g)
  const dy = new Float32Array(g * g)
  const le = new Float32Array(g * g)
  if (f && f.rippling)
    for (let j = 0; j < g; j++)
      for (let k = 0; k < g; k++) {
        const q = j * g + k
        dx[q] = sample(f.tiltX, f, k * 4, j * 4) * 8
        dy[q] = sample(f.tiltY, f, k * 4, j * 4) * 8
        le[q] = Math.min(1, sample(f.light, f, k * 4, j * 4) * f.lime * 1.2)
      }
  const { w: ink, ink: rgb } = weights
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++) {
      const q = ((y / 4) | 0) * g + ((x / 4) | 0)
      const sx = Math.round(x - dx[q])
      const sy = Math.round(y - dy[q])
      const p = (y * SIZE + x) * 4
      const w = sx >= 0 && sy >= 0 && sx < SIZE && sy < SIZE ? ink[sy * SIZE + sx] : 0
      const t = le[q] > 0 ? Math.pow(le[q], 0.9) : 0
      for (let c = 0; c < 3; c++) o[p + c] = rgb[c] + (LIME[c] - rgb[c]) * t
      o[p + 3] = w * 255
    }
  return o
}

// A ripple: a cone of tilt and light, zero beyond its radius, over a 400px stage of 10px cells
function ripple(cx: number, cy: number, rippling = true): FieldFrame {
  const cols = 40
  const rows = 40
  const tiltX = new Float32Array(cols * rows)
  const tiltY = new Float32Array(cols * rows)
  const light = new Float32Array(cols * rows)
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const x = (c + 0.5) * 10 - cx
      const y = (r + 0.5) * 10 - cy
      const d = Math.hypot(x, y)
      const v = Math.max(0, 1 - d / 40)
      tiltX[r * cols + c] = d ? (v * 0.7 * x) / d : 0
      tiltY[r * cols + c] = d ? (v * 0.7 * y) / d : 0
      light[r * cols + c] = v
    }
  return { cols, rows, cellWidth: 10, cellHeight: 10, tiltX, tiltY, light, rippling, lime: 1 }
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('fieldPortrait', () => {
  it('matches a full redraw on every frame, draws nothing for a far ripple, and ends at rest', async () => {
    const box = document.createElement('div')
    const portrait = mountPortrait(box, document.createElement('div'))
    await tick()
    await tick()
    const pixels = canvases.get(box.querySelector('canvas')!)!
    const rest = reference(null)
    expect(pixels).toEqual(rest)

    // Far from the portrait: nothing drawn
    puts.length = 0
    portrait.onFrame(ripple(380, 380))
    expect(puts).toEqual([])

    // Across it and out again: each frame exact, and the first one only a part of the canvas. The unlit frames
    // (lime 0) move pixels by tilt alone.
    for (const [x, y, lime] of [
      [280, 120, 1],
      [250, 128, 1],
      [128, 128, 1],
      [128, 128, 0],
      [200, 60, 0],
      [60, 200, 1],
      [10, 10, 1],
      [380, 380, 1],
    ]) {
      puts.length = 0
      const frame = { ...ripple(x, y), lime }
      portrait.onFrame(frame)
      expect(pixels).toEqual(reference(frame))
      if (x === 280) expect(puts[0][2] * puts[0][3]).toBeLessThan((SIZE * SIZE) / 4)
    }

    // The ripple ends: back to the resting pixels
    portrait.onFrame(ripple(380, 380, false))
    expect(pixels).toEqual(rest)
    portrait.destroy()
  })
})

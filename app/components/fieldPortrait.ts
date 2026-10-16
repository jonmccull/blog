// The dither portrait redrawn on a canvas that the Field's ripples bend and light (the kit's figure contract, Field README).
// Paper pixels are transparent so the cloth shows through; ink shifts with the ripple's tilt and turns lime at its front.

export type FieldFrame = {
  cols: number
  rows: number
  cellWidth: number
  cellHeight: number
  tiltX: Float32Array
  tiltY: Float32Array
  light: Float32Array
  rippling: boolean
  lime: number
}

const WARP = 8 // css px of shift per unit of ripple tilt
const LIME = 1.2 // multiplier on the cloth's own lime
const CURVE = 0.9 // exponent shaping how the lime fades behind the wavefront
const GRID = 4 // device px between displacement samples

function hex(s: string) {
  s = s.trim().replace('#', '')
  if (s.length === 3) s = s.replace(/./g, '$&$&')
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) || 0)
}

export function mountPortrait(box: HTMLElement, stage: HTMLElement) {
  const dpr = Math.min(2, Math.max(1, Math.round(devicePixelRatio || 1)))
  const size = 256 * dpr
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  canvas.className = 'home-portrait-canvas'
  canvas.setAttribute('aria-hidden', 'true')
  const ctx = canvas.getContext('2d')!
  const out = ctx.createImageData(size, size)
  const sources = new Map<string, Promise<HTMLImageElement>>()
  let ink: Float32Array | null = null // 0..1 ink weight per device pixel
  let inkRGB = [0, 0, 0]
  let lime = [0, 0, 0]
  let dirty = true
  let wasRippling = false
  let off = { x: 0, y: 0 }
  let token = 0

  // Both themes' files are fetched up front so a theme switch redraws at once
  function source(theme: string) {
    if (!sources.has(theme)) {
      // onload, not decode(): decode() never settles in a hidden page
      const img = new Image()
      const loaded = new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img)
        img.onerror = reject
      })
      img.src = `/images/jon-dither-${theme}-soft-${dpr >= 2 ? 1024 : 256}.webp`
      sources.set(theme, loaded)
    }
    return sources.get(theme)!
  }

  function load() {
    const my = ++token
    const root = document.documentElement
    const theme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    const cs = getComputedStyle(root)
    const ground = hex(cs.getPropertyValue('--ground'))
    lime = hex(cs.getPropertyValue('--lime'))
    return source(theme).then((img) => {
      if (my !== token) return
      const c = document.createElement('canvas')
      c.width = c.height = size
      const x = c.getContext('2d', { willReadFrequently: true })!
      x.imageSmoothingEnabled = true
      x.imageSmoothingQuality = 'high'
      x.drawImage(img, 0, 0, size, size)
      const d = x.getImageData(0, 0, size, size).data
      const w = new Float32Array(size * size)
      let max = 0
      let best = 0
      for (let p = 0; p < w.length; p++) {
        const dist = Math.hypot(
          d[p * 4] - ground[0],
          d[p * 4 + 1] - ground[1],
          d[p * 4 + 2] - ground[2]
        )
        w[p] = dist
        if (dist > max) {
          max = dist
          best = p
        }
      }
      for (let p = 0; p < w.length; p++) w[p] = max ? w[p] / max : 0
      inkRGB = [d[best * 4], d[best * 4 + 1], d[best * 4 + 2]]
      ink = w
      dirty = true
      draw(null)
      source(theme === 'dark' ? 'light' : 'dark')
    })
  }

  function measure() {
    const b = box.getBoundingClientRect()
    const s = stage.getBoundingClientRect()
    off = { x: b.left - s.left, y: b.top - s.top }
  }

  // Bilinear sample of a per-cell field at a stage position in css px
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

  function draw(f: FieldFrame | null) {
    if (!ink) return
    const live = !!f && f.rippling
    if (!live && !dirty && !wasRippling) return
    wasRippling = live
    dirty = false
    const g = Math.ceil(size / GRID) + 1
    const dx = new Float32Array(g * g)
    const dy = new Float32Array(g * g)
    const le = new Float32Array(g * g)
    if (live && f) {
      for (let j = 0; j < g; j++)
        for (let k = 0; k < g; k++) {
          const sx = off.x + (k * GRID) / dpr
          const sy = off.y + (j * GRID) / dpr
          const q = j * g + k
          dx[q] = sample(f.tiltX, f, sx, sy) * WARP * dpr
          dy[q] = sample(f.tiltY, f, sx, sy) * WARP * dpr
          le[q] = Math.min(1, sample(f.light, f, sx, sy) * f.lime * LIME)
        }
    }
    const o = out.data
    for (let y = 0; y < size; y++) {
      const row = ((y / GRID) | 0) * g
      for (let x = 0; x < size; x++) {
        const q = row + ((x / GRID) | 0)
        const sx = Math.round(x - dx[q])
        const sy = Math.round(y - dy[q])
        const p = (y * size + x) * 4
        const w = sx >= 0 && sy >= 0 && sx < size && sy < size ? ink[sy * size + sx] : 0
        const t = le[q] > 0 ? Math.pow(le[q], CURVE) : 0
        o[p] = inkRGB[0] + (lime[0] - inkRGB[0]) * t
        o[p + 1] = inkRGB[1] + (lime[1] - inkRGB[1]) * t
        o[p + 2] = inkRGB[2] + (lime[2] - inkRGB[2]) * t
        o[p + 3] = w * 255
      }
    }
    ctx.putImageData(out, 0, 0)
  }

  box.appendChild(canvas)
  measure()
  const ro = new ResizeObserver(measure)
  ro.observe(stage)
  const mo = new MutationObserver(() => load())
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  load().then(() => {
    if (canvas.isConnected) box.classList.add('is-canvas')
  })

  return {
    onFrame: (f: FieldFrame) => draw(f),
    destroy() {
      token++
      ro.disconnect()
      mo.disconnect()
      canvas.remove()
      box.classList.remove('is-canvas')
    },
  }
}

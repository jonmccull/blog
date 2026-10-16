// The Diagnoseovergang post header: the kit Field's cloth of glyphs (fabric, light and glyph ramp from
// foundations/field.js) with a code laid on the glyph grid. Rain reveals the first code, the changed digit rains
// into the second, then the code falls out of the band, on a loop. Code and cloth in graph line; lime only on rain
// heads, on cells as they lock in, and on the new digit. Still under reduced motion, idle off screen.

type Options = { from: string; to: string; speed?: number }
type Relief = { v: Float32Array; gx: Float32Array; gz: Float32Array; halo: Float32Array }

const FA = 0.6,
  CA = Math.cos(FA),
  SA = Math.sin(FA),
  AMP = 1.5
function h(x: number, z: number) {
  const s = x * CA + z * SA,
    t = -x * SA + z * CA,
    A = AMP * (0.85 + 0.35 * Math.sin(0.23 * t))
  return (
    A *
      (0.26 * Math.sin(1.55 * s + 0.9 * Math.sin(0.42 * t)) +
        0.12 * Math.sin(3.2 * s + 1.7 + 1.1 * Math.sin(0.31 * t + 2)) +
        0.05 * Math.sin(6.1 * s + 0.5 * t)) -
    AMP * 0.11 * Math.abs(Math.sin(2.35 * s + 0.7 * Math.sin(0.55 * t + 1)))
  )
}
const dist = (x: number, y: number, z: number) => (y - h(x, z)) * 0.42
const KEY = (() => {
    const l = Math.hypot(-0.7, 0.5, 0.5)
    return [-0.7 / l, 0.5 / l, 0.5 / l]
  })(),
  AMB = 0.2
const RAMP_SET = '.:;+=ilrtcvxzsnuoaejfyhkdbpqgw7340%#&@',
  A_LEVELS = 8,
  L_LEVELS = 4,
  BANDS = 8
const GW = 6,
  GH = 10,
  FPS = 20
const EYE = [0.2, 4.2, 2.4],
  TARGET = [0.1, -0.3, 0],
  FOV = 30
// Timeline in seconds: reveal from 0, the digit rains at T2, the code falls out from T3.
const TRAIL = 7,
  AMB_TRAIL = 8,
  T2 = 3.4,
  T3 = 8.2
const SWELLS = [
  { dx: 0.8, dz: 0.6, len: 2.6, amp: 0.05, speed: 0.22 },
  { dx: -0.45, dz: 0.89, len: 1.5, amp: 0.025, speed: 0.15 },
].map((q) => {
  const k = (2 * Math.PI) / q.len
  return { ...q, k, amp: q.amp * 1.2, w: k * q.speed * 1.1 }
})

function hash2(x: number, y: number) {
  let n = (x * 374761393 + y * 668265263) | 0
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296
}
function vnoise(x: number, y: number) {
  const xi = Math.floor(x),
    yi = Math.floor(y),
    xf = x - xi,
    yf = y - yi,
    u = xf * xf * (3 - 2 * xf),
    v = yf * yf * (3 - 2 * yf)
  const a = hash2(xi, yi),
    b = hash2(xi + 1, yi),
    c = hash2(xi, yi + 1),
    d = hash2(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
const sm = (x: number) => {
  x = x < 0 ? 0 : x > 1 ? 1 : x
  return x * x * (3 - 2 * x)
}
const hex = (s: string) => {
  s = (s || '').trim().replace('#', '')
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) || 0)
}
const mix = (a: number[], b: number[], t: number) =>
  [0, 1, 2].map((k) => Math.round(a[k] + (b[k] - a[k]) * t))
const yieldNow = () =>
  new Promise<void>((r) => {
    const ch = new MessageChannel()
    ch.port1.onmessage = () => r()
    ch.port2.postMessage(0)
  })

export function mountIcdRain(canvas: HTMLCanvasElement, { from, to, speed = 1 }: Options) {
  const root = document.documentElement,
    ctx = canvas.getContext('2d')
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!ctx) return { destroy() {} }
  let token = 0,
    raf = 0,
    ready = false,
    onScreen = true,
    last = 0,
    t0 = 0,
    built = -1
  let colours: string[] = [],
    ground = ''
  // Built per size
  let cols = 0,
    rows = 0,
    N = 0,
    dpr = 1,
    period = 11
  let hit: Uint8Array, P: Float32Array, Nn: Float32Array, ao: Float32Array, sh: Float32Array
  let R0: Relief,
    R1: Relief,
    pick: Float32Array,
    fade: Float32Array,
    lit: Float32Array,
    c0 = 0,
    c1 = 0
  const cs1: number[] = [],
    sp1: number[] = [],
    cs2: number[] = [],
    sp2: number[] = [],
    cs3: number[] = [],
    sp3: number[] = []
  const amb: boolean[] = [],
    ambL: number[] = [],
    ambS: number[] = []
  let ramp: string[] = []

  function readPal() {
    const cs = getComputedStyle(root)
    const g = hex(cs.getPropertyValue('--ground')),
      line = hex(cs.getPropertyValue('--graph-line')),
      lime = hex(cs.getPropertyValue('--lime'))
    ground = `rgb(${g})`
    colours = []
    for (let a = 0; a <= A_LEVELS; a++)
      for (let l = 0; l < L_LEVELS; l++)
        colours.push(`rgb(${mix(g, mix(line, lime, l / (L_LEVELS - 1)), a / A_LEVELS)})`)
  }
  const dark = () => root.getAttribute('data-theme') === 'dark'

  // One ray per glyph cell onto the cloth, as the Field does
  function march(
    y0: number,
    y1: number,
    cam: { e: number[]; f: number[]; r: number[]; u: number[]; th: number; aspect: number }
  ) {
    for (let y = y0; y < y1; y++)
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x,
          nx = ((2 * (x + 0.5)) / cols - 1) * cam.th * cam.aspect,
          ny = (1 - (2 * (y + 0.5)) / rows) * cam.th
        let dx = cam.f[0] + cam.r[0] * nx + cam.u[0] * ny,
          dy = cam.f[1] + cam.r[1] * nx + cam.u[1] * ny,
          dz = cam.f[2] + cam.r[2] * nx + cam.u[2] * ny
        const dl = Math.hypot(dx, dy, dz)
        dx /= dl
        dy /= dl
        dz /= dl
        let t = 0.01,
          ok = false
        for (let k = 0; k < 260; k++) {
          const d = dist(EYE[0] + dx * t, EYE[1] + dy * t, EYE[2] + dz * t)
          if (d < 0.0004 * t) {
            ok = true
            break
          }
          t += d
          if (t > 30) break
        }
        if (!ok) continue
        const px = EYE[0] + dx * t,
          py = EYE[1] + dy * t,
          pz = EYE[2] + dz * t,
          e = 0.002
        const gx = (h(px + e, pz) - h(px - e, pz)) / (2 * e),
          gz = (h(px, pz + e) - h(px, pz - e)) / (2 * e),
          gl = Math.hypot(gx, 1, gz)
        const n0 = -gx / gl,
          n1 = 1 / gl,
          n2 = -gz / gl
        hit[i] = 1
        P[i * 2] = px
        P[i * 2 + 1] = pz
        Nn[i * 3] = n0
        Nn[i * 3 + 1] = n1
        Nn[i * 3 + 2] = n2
        let occ = 0,
          w = 1
        for (let a = 1; a <= 5; a++) {
          const hh = 0.05 * a
          occ += (hh - dist(px + n0 * hh, py + n1 * hh, pz + n2 * hh)) * w
          w *= 0.8
        }
        ao[i] = Math.max(0, Math.min(1, 1 - 2 * occ))
        let res = 1,
          st = 0.02
        for (let s = 0; s < 64; s++) {
          const q = dist(
            px + n0 * 0.002 + KEY[0] * st,
            py + n1 * 0.002 + KEY[1] * st,
            pz + n2 * 0.002 + KEY[2] * st
          )
          res = Math.min(res, (10 * q) / st)
          if (res < 0.001) break
          st += Math.min(Math.max(q, 0.01), 0.25)
          if (st > 6) break
        }
        sh[i] = sm(res)
      }
  }

  // Each code is laid on the glyph grid, so its strokes stay straight: the type's cover in every cell, pushed
  // almost to on or off, its slope for the relief, and a quiet halo around the strokes where the cloth thins.
  function relieve(
    tc: OffscreenCanvasRenderingContext2D,
    str: string,
    x0: number,
    base: number
  ): Relief {
    const W = cols * GW,
      H = rows * GH
    tc.clearRect(0, 0, W, H)
    tc.fillText(str, x0, base)
    tc.strokeText(str, x0, base)
    const a = tc.getImageData(0, 0, W, H).data,
      v = new Float32Array(N),
      gx = new Float32Array(N),
      gz = new Float32Array(N),
      halo = new Float32Array(N)
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        let on = 0
        for (let yy = y * GH; yy < (y + 1) * GH; yy++)
          for (let xx = x * GW; xx < (x + 1) * GW; xx++) if (a[(yy * W + xx) * 4 + 3] > 127) on++
        v[y * cols + x] = sm((on / (GW * GH) - 0.3) / 0.3)
      }
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x
        gx[i] = ((x < cols - 1 ? v[i + 1] : 0) - (x > 0 ? v[i - 1] : 0)) * 1.6
        gz[i] = ((y < rows - 1 ? v[i + cols] : 0) - (y > 0 ? v[i - cols] : 0)) * 1.6
        if (v[i] > 0.5) continue
        for (let dy = -1; dy <= 1 && !halo[i]; dy++)
          for (let dx = -2; dx <= 2; dx++) {
            const xx = x + dx,
              yy = y + dy
            if (xx >= 0 && yy >= 0 && xx < cols && yy < rows && v[yy * cols + xx] > 0.5) {
              halo[i] = 1
              break
            }
          }
      }
    return { v, gx, gz, halo }
  }

  async function build() {
    const my = ++token
    ready = false
    const bw = canvas.parentElement?.clientWidth || 0,
      bh = canvas.parentElement?.clientHeight || 0
    if (!bw || !bh) return
    cols = Math.floor(bw / GW)
    rows = Math.floor(bh / GH)
    N = cols * rows
    built = bw
    dpr = Math.max(1, Math.round(devicePixelRatio || 1))
    hit = new Uint8Array(N)
    P = new Float32Array(N * 2)
    Nn = new Float32Array(N * 3)
    ao = new Float32Array(N)
    sh = new Float32Array(N)
    let f = TARGET.map((v, k) => v - EYE[k])
    const fl = Math.hypot(f[0], f[1], f[2])
    f = f.map((v) => v / fl)
    let r = [-f[2], 0, f[0]]
    const rl = Math.hypot(r[0], r[2])
    r = [r[0] / rl, 0, r[2] / rl]
    const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]]
    const cam = {
      e: EYE,
      f,
      r,
      u,
      th: Math.tan((FOV * Math.PI) / 360),
      aspect: (cols * GW) / (rows * GH),
    }
    for (let y = 0; y < rows; y += 4) {
      if (my !== token) return
      march(y, Math.min(rows, y + 4), cam)
      await yieldNow()
    }

    await Promise.all(
      ['400', '500'].map((w) => document.fonts.load(`${w} 40px "JetBrains Mono"`).catch(() => []))
    )
    if (my !== token) return
    // The kit links JetBrains Mono 400 and 500 only; a stroke thickens 500 so the code holds at glyph resolution
    const tc = new OffscreenCanvas(cols * GW, rows * GH).getContext('2d', {
      willReadFrequently: true,
    })
    if (!tc) return
    tc.font = '500 100px "JetBrains Mono", monospace'
    const size = (100 * cols * GW * 0.82) / tc.measureText(from).width
    tc.font = `500 ${size}px "JetBrains Mono", monospace`
    tc.fillStyle = '#000'
    tc.strokeStyle = '#000'
    tc.lineJoin = 'round'
    tc.lineWidth = size * 0.06
    const m = tc.measureText(from),
      tw = m.width,
      x0 = (cols * GW - tw) / 2,
      base = Math.round((rows * GH) / 2 + m.actualBoundingBoxAscent / 2)
    R0 = relieve(tc, from, x0, base)
    await yieldNow()
    if (my !== token) return
    R1 = relieve(tc, to, x0, base)
    c0 = Math.floor((x0 + tc.measureText(to.slice(0, -1)).width) / GW)
    c1 = Math.ceil((x0 + tw) / GW)

    pick = new Float32Array(N)
    fade = new Float32Array(N)
    lit = new Float32Array(N)
    const W = cols * GW,
      H = rows * GH,
      s = Math.min(W, H)
    for (let y = 0, i = 0; y < rows; y++)
      for (let x = 0; x < cols; x++, i++) {
        const hs = Math.sin(i * 12.9898 + 78.233) * 43758.5453
        pick[i] = hs - Math.floor(hs)
        const cx = (x + 0.5) * GW,
          cy = (y + 0.5) * GH,
          n = (vnoise(cx / (s * 0.3), cy / (s * 0.3)) - 0.5) * 0.3
        fade[i] =
          sm(cx / (0.35 * s) + n) *
          sm((W - cx) / (0.35 * s) + n) *
          sm(cy / (0.18 * s) + n) *
          sm((H - cy) / (0.3 * s) + n)
        if (x >= c0 && x <= c1) lit[i] = Math.max(R0.v[i], R1.v[i])
      }
    for (let x = 0; x < cols; x++) {
      cs1[x] = 0.15 + hash2(x, 1) * 1.1
      sp1[x] = (30 + hash2(x, 2) * 24) * speed
      cs2[x] = T2 + hash2(x, 3) * 0.35
      sp2[x] = (24 + hash2(x, 4) * 10) * speed
      cs3[x] = T3 + hash2(x, 5) * 0.8
      sp3[x] = (18 + hash2(x, 6) * 14) * speed
      amb[x] = hash2(x, 9) < 0.85
      ambL[x] = rows + 4 + hash2(x, 10) * 16
      ambS[x] = (10 + hash2(x, 11) * 12) * speed
    }
    period = T3 + 0.8 + Math.pow((rows + TRAIL) / (18 * speed), 1 / 1.4) + 0.5

    // Glyph ramp, ordered by ink
    const g = new OffscreenCanvas(GW * 4, GH * 4).getContext('2d', { willReadFrequently: true })
    if (!g) return
    g.font = `400 ${GW * 4 * 1.42}px "JetBrains Mono", monospace`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillStyle = '#fff'
    ramp = RAMP_SET.split('')
      .map((ch) => {
        g.clearRect(0, 0, GW * 4, GH * 4)
        g.fillText(ch, GW * 2, GH * 2)
        const a = g.getImageData(0, 0, GW * 4, GH * 4).data
        let on = 0
        for (let p = 3; p < a.length; p += 4) if (a[p] > 110) on++
        return { ch, cov: on }
      })
      .sort((a, b) => a.cov - b.cov)
      .map((k) => k.ch)

    canvas.width = cols * GW * dpr
    canvas.height = rows * GH * dpr
    canvas.style.width = `${cols * GW}px`
    canvas.style.height = `${rows * GH}px`
    readPal()
    ready = true
    t0 = performance.now()
    paint(t0)
  }

  function paint(now: number) {
    if (!ready || !ctx) return
    const still = reduce,
      T = now / 1000,
      isDark = dark(),
      open = 0.55,
      lo = 0.62 - open * 0.25
    // The still is the hold on the second code
    const tt = still ? T3 - 0.6 : ((now - t0) / 1000) % period
    const dox = still ? 0 : T * 19,
      doy = still ? 0 : T * 6.6
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = ground
    ctx.fillRect(0, 0, cols * GW, rows * GH)
    ctx.font = `400 ${GW * 1.42}px "JetBrains Mono", monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const tr = (dd: number) => (dd >= 0 && dd < TRAIL ? Math.pow(1 - dd / TRAIL, 1.6) : 0)
    for (let y = 0, i = 0; y < rows; y++)
      for (let x = 0; x < cols; x++, i++) {
        if (!hit[i]) continue
        const px = P[i * 2],
          pz = P[i * 2 + 1]
        let n0 = Nn[i * 3]
        const n1 = Nn[i * 3 + 1]
        let n2 = Nn[i * 3 + 2]
        let v = 0,
          gx = 0,
          gz = 0,
          m = 0,
          rain = 0,
          limeRain = 0,
          head = false,
          ambRain = 0,
          ambHead = 0,
          flash = 0,
          halo = 0
        const h1 = (tt - cs1[x]) * sp1[x],
          h2 = x >= c0 - 1 && x <= c1 + 1 ? (tt - cs2[x]) * sp2[x] : -1
        const p1 = h1 > y,
          p2 = h2 > y,
          R = p2 ? R1 : R0,
          dt3 = tt - cs3[x]
        if (dt3 > 0) {
          // This column of the code falls out of the band, accelerating, with a rain trail above it
          const off = Math.pow(dt3, 1.4) * sp3[x]
          const src = (yy: number) => {
            const sy = Math.floor(yy - off)
            return sy >= 0 && sy < rows ? R.v[sy * cols + x] : 0
          }
          if (src(y) > 0.5) {
            rain = 1
            head = true
            limeRain = src(y + 1) < 0.5 ? 1 : 0.3
          } else
            for (let k = 1; k <= TRAIL; k++)
              if (src(y + k) > 0.5) {
                rain = 0.9 * Math.pow(1 - (k - 1) / TRAIL, 1.6)
                break
              }
        } else if (p1) {
          v = R.v[i]
          gx = R.gx[i]
          gz = R.gz[i]
          halo = R.halo[i]
          m = p2 ? 1 : 0
          const hd1 = h1 - y < 1,
            hd2 = p2 && h2 - y < 1
          rain = Math.max(tr(h1 - y), tr(h2 - y))
          head = hd1 || hd2
          limeRain = Math.max(tr(h2 - y), hd1 ? 0.9 : 0)
          // Each cell of the code flashes lime as it locks in, and again when the digit rains
          if (v > 0.5)
            flash = Math.max(
              Math.exp(-(h1 - y) / sp1[x] / 0.35),
              p2 ? Math.exp(-(h2 - y) / sp2[x] / 0.5) : 0
            )
        } else {
          rain = tr(h1 - y)
          head = h1 - y >= 0 && h1 - y < 1
          limeRain = head ? 0.9 : 0
        }
        // Rain keeps falling all through: around the code, and over it as a passing lime flicker
        if (!still && amb[x]) {
          const ah = (T * ambS[x] + hash2(x, 12) * ambL[x]) % ambL[x],
            ad = ah - y
          if (ad >= 0 && ad < AMB_TRAIL) {
            if (v < 0.5) {
              ambRain = 0.8 * Math.pow(1 - ad / AMB_TRAIL, 1.3)
              if (ad < 1) ambHead = 1
            } else if (ad < 2) flash = Math.max(flash, 0.75)
          }
        }
        if (still) {
          rain = 0
          head = false
          limeRain = 0
          flash = 0
        }
        n0 -= 0.13 * gx
        n2 -= 0.13 * gz
        if (!still)
          for (const q of SWELLS) {
            const c = q.amp * q.k * Math.cos(q.k * (q.dx * px + q.dz * pz) - q.w * T)
            n0 -= c * q.dx
            n2 -= c * q.dz
          }
        const nl = Math.hypot(n0, n1, n2),
          diff = Math.max(0, (n0 * KEY[0] + n1 * KEY[1] + n2 * KEY[2]) / nl)
        const lum = Math.min(1, AMB * ao[i] + (1 - AMB) * diff * sh[i] * (0.55 + 0.45 * ao[i]))
        const shade = isDark ? Math.pow(lum, 0.85) : Math.pow(1 - lum, 1.5)
        const cx = (x + 0.5) * GW + dox,
          cy = (y + 0.5) * GH + doy
        const cl =
          (0.5 * vnoise(cx / 300, cy / 300) +
            0.25 * vnoise(cx / 148 + 17, cy / 148 - 9) +
            0.125 * vnoise(cx / 73 + 34, cy / 73 - 18)) /
          0.875
        // Brightest to faintest: lime heads, the code, rain trails, the cloth
        const rest = Math.max(
          (0.14 + open * 0.8 * Math.max(0, Math.min(1, (cl - lo) / 0.22))) *
            0.45 *
            (1 - 0.85 * halo),
          v
        )
        const al = Math.max(
          Math.max(
            Math.min(1, 0.25 + shade * 1.4) * rest,
            head || ambHead ? 1 : rain * 0.9 * 0.62,
            ambRain * 0.62 * (1 - 0.4 * halo)
          ) * fade[i],
          v
        )
        const ai = Math.round(al * A_LEVELS)
        if (!ai) continue
        const li = Math.round(
          Math.min(1, lit[i] * m * 0.75 * R1.v[i] + limeRain * 1.2 + flash + ambHead * 0.9) *
            (L_LEVELS - 1)
        )
        const band = Math.max(
          0,
          Math.min(
            BANDS - 1,
            Math.max(Math.floor(shade * 1.4 * BANDS), Math.round(v * (5 + shade * 2.5)))
          )
        )
        let gi = Math.min(ramp.length - 1, Math.floor(((band + pick[i]) * ramp.length) / BANDS))
        const r = Math.max(rain, ambRain, flash)
        // Rain glyphs flicker: a new pick every 90ms, denser toward the head
        if ((Math.max(rain, ambRain) > 0.05 && v < 0.5) || flash > 0.35)
          gi = Math.min(
            ramp.length - 1,
            Math.floor(
              ramp.length * (0.25 + 0.75 * r) * (0.55 + 0.45 * hash2(i, Math.floor(now / 90)))
            )
          )
        ctx.fillStyle = colours[ai * L_LEVELS + li]
        ctx.fillText(ramp[gi], (x + 0.5) * GW, (y + 0.5) * GH + 0.5)
      }
  }

  // Frame rate from the kit's field-frame-rate; nothing runs off screen or under reduced motion
  function loop(now: number) {
    raf = requestAnimationFrame(loop)
    if (!ready || !onScreen || reduce || now - last < 1000 / FPS) return
    last = now
    paint(now)
  }
  if (!reduce) raf = requestAnimationFrame(loop)
  const io = new IntersectionObserver((en) => {
    onScreen = en[0].isIntersecting
  })
  io.observe(canvas)
  const mo = new MutationObserver(() => {
    if (ready) {
      readPal()
      paint(performance.now())
    }
  })
  mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
  let rt = 0
  const ro = new ResizeObserver(() => {
    clearTimeout(rt)
    rt = window.setTimeout(() => {
      if (canvas.parentElement && canvas.parentElement.clientWidth !== built) build()
    }, 200)
  })
  if (canvas.parentElement) ro.observe(canvas.parentElement)
  build()

  return {
    destroy() {
      token++
      cancelAnimationFrame(raf)
      clearTimeout(rt)
      io.disconnect()
      mo.disconnect()
      ro.disconnect()
    },
  }
}

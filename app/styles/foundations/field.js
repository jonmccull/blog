/* Foundations Field: the business written down as a woven cloth of glyphs, faint under drifting clouds,
   exposed by a lime ripple where you click. One classic script, no dependencies.
   FoundationsField.mount(stage, options) draws behind the stage's content and returns { stats, destroy }.
   Options: quiet (copy elements ripples avoid), figure (elements the cloth thins behind while ripples pass through),
   onFrame (called after each full paint with the ripple per glyph cell, for a figure drawn on top).
   Colours come from --ground, --graph-line and --lime; values from the motion tokens --motion-field-*. */
(function () {
  'use strict';

  // Fabric: a heightfield with diagonal folds and |sin| creases, lit from the upper left.
  var FA = 0.6, CA = Math.cos(FA), SA = Math.sin(FA), AMP = 1.5;
  function h(x, z) {
    var s = x * CA + z * SA, t = -x * SA + z * CA, A = AMP * (0.85 + 0.35 * Math.sin(0.23 * t));
    return A * (0.26 * Math.sin(1.55 * s + 0.9 * Math.sin(0.42 * t)) + 0.12 * Math.sin(3.2 * s + 1.7 + 1.1 * Math.sin(0.31 * t + 2)) +
      0.05 * Math.sin(6.1 * s + 0.5 * t)) - AMP * 0.11 * Math.abs(Math.sin(2.35 * s + 0.7 * Math.sin(0.55 * t + 1)));
  }
  function dist(x, y, z) { return (y - h(x, z)) * 0.42; }
  var KEY = (function () { var l = Math.hypot(-0.7, 0.5, 0.5); return [-0.7 / l, 0.5 / l, 0.5 / l]; })(), AMB = 0.2;

  // Ripple and rest motion. Speeds and sizes are in the cloth's own units.
  var RIP = { width: 0.22, wave: 0.42, amp: 0.16, trail: 0.7 };
  var SWELLS = [{ dx: 0.8, dz: 0.6, len: 2.6, amp: 0.05, speed: 0.22 }, { dx: -0.45, dz: 0.89, len: 1.5, amp: 0.025, speed: 0.15 }];
  var DRIFT = [16, 5.5], RAMP_SET = '.:;+=ilrtcvxzsnuoaejfyhkdbpqgw7340%#&@', A_LEVELS = 8, L_LEVELS = 4, BANDS = 8;
  // The motion tokens, as the system sets them. A page that loads tokens.css can tune them there.
  var TOKENS = { motion: 0.6, lime: 1.6, clouds: 0.55, 'ripple-speed': 1.7, 'ripple-life': 2.4, 'quiet-reach': 200, glyph: 6, 'frame-rate': 20 };

  function hash2(x, y) { var n = (x * 374761393 + y * 668265263) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967296; }
  function vnoise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function smooth(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }
  // Density fade toward the open edges, with a wobble so the last marks never line up.
  function fadeAt(x, y, W, H, e) {
    var s = Math.min(W, H), n = (vnoise(x / (s * 0.08), y / (s * 0.08)) - 0.5) * 0.25 + (vnoise(x / (s * 0.025) + 50, y / (s * 0.025)) - 0.5) * 0.125;
    var f = 1;
    if (e.left) f *= smooth(x / (e.left * s) + n);
    if (e.right) f *= smooth((W - x) / (e.right * s) + n);
    if (e.top) f *= smooth(y / (e.top * s) + n);
    if (e.bottom) f *= smooth((H - y) / (e.bottom * s) + n);
    return f;
  }
  function hex(s) { s = (s || '').trim().replace('#', ''); if (s.length === 3) s = s.replace(/./g, '$&$&'); return [0, 2, 4].map(function (i) { return parseInt(s.slice(i, i + 2), 16) || 0; }); }
  function mix(a, b, t) { return [0, 1, 2].map(function (k) { return Math.round(a[k] + (b[k] - a[k]) * t); }); }
  function rgb(c) { return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; }
  function yieldNow() { return new Promise(function (r) { var ch = new MessageChannel(); ch.port1.onmessage = function () { r(); }; ch.port2.postMessage(0); }); }

  function mount(stage, options) {
    var o = Object.assign({ cam: { eye: [0, 3.0, 4.2], target: [0.6, -0.3, 0], fov: 40 }, fade: { bottom: 0.4, top: 0.04, right: 0.04, left: 0.02 }, quiet: [], figure: [], onFrame: null, ignore: 'a, button, input, label, select, textarea' }, options || {});
    var root = document.documentElement, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;left:0;top:0;z-index:0;pointer-events:none';
    stage.prepend(canvas);
    var ctx = canvas.getContext('2d');
    var T = {}, pal, cols, rows, N, hit, P, Nn, ao, sh, quiet, thin, TX, TY, LT, fade, pick, prev, sheet, atlas, ripples = [], token = 0, ready = false, visible = true, lastPaint = 0, raf = 0, rt;
    var stats = { build: 0, frame: 0, changed: 0, glyphs: 0 };

    function readTokens() {
      var cs = getComputedStyle(root);
      Object.keys(TOKENS).forEach(function (k) { var v = parseFloat(cs.getPropertyValue('--motion-field-' + k)); T[k] = isNaN(v) ? TOKENS[k] : v; });
      ['motion', 'lime', 'clouds'].forEach(function (k) { if (o[k] != null) T[k] = o[k]; });
      pal = { ground: hex(cs.getPropertyValue('--ground')), line: hex(cs.getPropertyValue('--graph-line')), lime: hex(cs.getPropertyValue('--lime')), dark: root.getAttribute('data-theme') === 'dark' };
    }

    // One ray per glyph: the field is only ever seen at glyph resolution.
    function march(y0, y1, gw, gh, cam) {
      for (var y = y0; y < y1; y++) for (var x = 0; x < cols; x++) {
        var i = y * cols + x, nx = (2 * (x + 0.5) / cols - 1) * cam.th * cam.aspect, ny = (1 - 2 * (y + 0.5) / rows) * cam.th;
        var dx = cam.f[0] + cam.r[0] * nx + cam.u[0] * ny, dy = cam.f[1] + cam.r[1] * nx + cam.u[1] * ny, dz = cam.f[2] + cam.r[2] * nx + cam.u[2] * ny;
        var dl = Math.hypot(dx, dy, dz); dx /= dl; dy /= dl; dz /= dl;
        var t = 0.01, ok = false, ex = cam.e[0], ey = cam.e[1], ez = cam.e[2];
        for (var k = 0; k < 260; k++) { var d = dist(ex + dx * t, ey + dy * t, ez + dz * t); if (d < 0.0004 * t) { ok = true; break; } t += d; if (t > 30) break; }
        if (!ok) continue;
        var px = ex + dx * t, py = ey + dy * t, pz = ez + dz * t, e = 0.002;
        var gx = (h(px + e, pz) - h(px - e, pz)) / (2 * e), gz = (h(px, pz + e) - h(px, pz - e)) / (2 * e), gl = Math.hypot(gx, 1, gz);
        var n0 = -gx / gl, n1 = 1 / gl, n2 = -gz / gl;
        hit[i] = 1; P[i * 2] = px; P[i * 2 + 1] = pz; Nn[i * 3] = n0; Nn[i * 3 + 1] = n1; Nn[i * 3 + 2] = n2;
        var occ = 0, w = 1;
        for (var a = 1; a <= 5; a++) { var hh = 0.05 * a; occ += (hh - dist(px + n0 * hh, py + n1 * hh, pz + n2 * hh)) * w; w *= 0.8; }
        ao[i] = Math.max(0, Math.min(1, 1 - 2 * occ));
        var res = 1, st = 0.02, ox = px + n0 * 0.002, oy = py + n1 * 0.002, oz = pz + n2 * 0.002;
        for (var s = 0; s < 64; s++) { var q = dist(ox + KEY[0] * st, oy + KEY[1] * st, oz + KEY[2] * st); res = Math.min(res, 10 * q / st); if (res < 0.001) break; st += Math.min(Math.max(q, 0.01), 0.25); if (st > 6) break; }
        sh[i] = smooth(res);
      }
    }

    function camera(gw, gh) {
      var e = o.cam.eye, tg = o.cam.target, f = [tg[0] - e[0], tg[1] - e[1], tg[2] - e[2]], fl = Math.hypot(f[0], f[1], f[2]);
      f = [f[0] / fl, f[1] / fl, f[2] / fl];
      var r = [-f[2], 0, f[0]], rl = Math.hypot(r[0], r[2]); r = [r[0] / rl, 0, r[2] / rl];
      var u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
      return { e: e, f: f, r: r, u: u, th: Math.tan(o.cam.fov * Math.PI / 360), aspect: (cols * gw) / (rows * gh) };
    }

    function build() {
      var my = ++token; ready = false; ripples = []; prev = null;
      readTokens();
      var gw = T.glyph, gh = Math.round(gw * 10 / 6), bw = stage.clientWidth, bh = stage.clientHeight;
      if (!bw || !bh) return Promise.resolve();
      cols = Math.ceil(bw / gw); rows = Math.ceil(bh / gh); N = cols * rows;
      hit = new Uint8Array(N); P = new Float32Array(N * 2); Nn = new Float32Array(N * 3); ao = new Float32Array(N); sh = new Float32Array(N);
      var cam = camera(gw, gh), t0 = performance.now(), y = 0;
      function chunk() {
        if (my !== token) return Promise.resolve(false);
        if (y >= rows) return Promise.resolve(true);
        march(y, Math.min(rows, y + 16), gw, gh, cam); y += 16;
        return yieldNow().then(chunk);
      }
      return chunk().then(function (go) {
        if (!go) return;
        masks(gw, gh, bw, bh);
        return buildSheet(gw, gh).then(function () {
          if (my !== token) return;
          canvas.width = cols * atlas.gw; canvas.height = rows * atlas.gh;
          canvas.style.width = cols * gw + 'px'; canvas.style.height = rows * gh + 'px';
          ctx.imageSmoothingEnabled = false; ctx.fillStyle = rgb(pal.ground); ctx.fillRect(0, 0, canvas.width, canvas.height);
          prev = new Int32Array(N).fill(-1);
          stats.build = Math.round(performance.now() - t0); stats.glyphs = N;
          // First fill in row bands so no single task is long.
          var tp = performance.now(), yy = 0;
          function fill() {
            if (my !== token) return;
            if (yy >= rows) { ready = true; return; }
            paint(tp, yy, Math.min(rows, yy + 10)); yy += 10;
            return yieldNow().then(fill);
          }
          return fill();
        });
      });
    }

    // Edge fade, and the quiet zone: one block around the copy, faded over quiet-reach with a noise-warped edge.
    function masks(gw, gh, bw, bh) {
      fade = new Float32Array(N); quiet = new Float32Array(N).fill(1); thin = new Float32Array(N).fill(1); pick = new Float32Array(N);
      TX = new Float32Array(N); TY = new Float32Array(N); LT = new Float32Array(N);
      var fr = (o.figure || []).map(function (el) { return el.getBoundingClientRect(); }).filter(function (r) { return r.width && r.height; });
      var sr = stage.getBoundingClientRect(), els = (o.quiet || []).map(function (el) { return el.getBoundingClientRect(); }).filter(function (r) { return r.width && r.height; });
      var blk = els.length ? [Math.min.apply(null, els.map(function (r) { return r.left; })) - sr.left, Math.min.apply(null, els.map(function (r) { return r.top; })) - sr.top,
        Math.max.apply(null, els.map(function (r) { return r.right; })) - sr.left, Math.max.apply(null, els.map(function (r) { return r.bottom; })) - sr.top] : null;
      for (var y = 0, i = 0; y < rows; y++) for (var x = 0; x < cols; x++, i++) {
        var hs = Math.sin(i * 12.9898 + 78.233) * 43758.5453; pick[i] = hs - Math.floor(hs);
        var cx = (x + 0.5) * gw, cy = (y + 0.5) * gh;
        fade[i] = fadeAt(cx, cy, bw, bh, o.fade);
        // A figure (the portrait) thins the cloth behind it but lets ripples through: it carries them itself.
        for (var fi = 0; fi < fr.length; fi++) {
          var fx0 = fr[fi].left - sr.left, fy0 = fr[fi].top - sr.top, fx1 = fr[fi].right - sr.left, fy1 = fr[fi].bottom - sr.top;
          var fd = Math.hypot(Math.max(fx0 - cx, 0, cx - fx1), Math.max(fy0 - cy, 0, cy - fy1)) + (vnoise(cx / 60 + 7, cy / 60) - 0.5) * 40;
          thin[i] = Math.min(thin[i], smooth((fd + 8) / 90));
        }
        if (!blk) continue;
        var inside = Math.max(blk[0] - cx, cx - blk[2], blk[1] - cy, cy - blk[3]);
        var d = inside < 0 ? inside : Math.hypot(Math.max(blk[0] - cx, 0, cx - blk[2]), Math.max(blk[1] - cy, 0, cy - blk[3]));
        d += (vnoise(cx / 140, cy / 140) - 0.5) * 110 + (vnoise(cx / 50 + 31, cy / 50) - 0.5) * 38;
        quiet[i] = smooth((d + 24) / T['quiet-reach']);
      }
    }

    // Every glyph pre-drawn in every colour level, ordered by ink, so a frame is only image copies.
    function buildSheet(gw, gh) {
      var dpr = Math.max(1, Math.round(devicePixelRatio || 1)), w = Math.round(gw * dpr), hh = Math.round(gh * dpr), fs = gw * 1.42 * dpr;
      return document.fonts.load('400 ' + fs + 'px "JetBrains Mono"').catch(function () {}).then(function () {
        var cv = document.createElement('canvas'); cv.width = w; cv.height = hh;
        var c2 = cv.getContext('2d', { willReadFrequently: true });
        c2.font = '400 ' + fs + 'px "JetBrains Mono", monospace'; c2.textAlign = 'center'; c2.textBaseline = 'middle'; c2.fillStyle = '#fff';
        var ramp = RAMP_SET.split('').map(function (ch) {
          c2.clearRect(0, 0, w, hh); c2.fillText(ch, w / 2, hh / 2 + dpr * 0.5);
          var a = c2.getImageData(0, 0, w, hh).data, m = new Uint8Array(w * hh), on = 0;
          for (var p = 0; p < m.length; p++) if (a[p * 4 + 3] > 110) { m[p] = 1; on++; }
          return { m: m, cov: on / m.length };
        }).sort(function (a, b) { return a.cov - b.cov; }).map(function (k) { return k.m; });
        var colours = [];
        for (var a = 1; a <= A_LEVELS; a++) for (var l = 0; l < L_LEVELS; l++) colours.push(mix(pal.ground, mix(pal.line, pal.lime, l / (L_LEVELS - 1)), a / A_LEVELS));
        var sc = document.createElement('canvas'); sc.width = ramp.length * w; sc.height = colours.length * hh;
        var sx = sc.getContext('2d'), im = sx.createImageData(sc.width, sc.height), d = im.data;
        for (var ci = 0; ci < colours.length; ci++) for (var gi = 0; gi < ramp.length; gi++) {
          var mk = ramp[gi], on = colours[ci];
          for (var y = 0; y < hh; y++) for (var x = 0; x < w; x++) {
            var q = ((ci * hh + y) * sc.width + gi * w + x) * 4, c = mk[y * w + x] ? on : pal.ground;
            d[q] = c[0]; d[q + 1] = c[1]; d[q + 2] = c[2]; d[q + 3] = 255;
          }
        }
        sx.putImageData(im, 0, 0);
        return createImageBitmap(sc).then(function (bm) { sheet = bm; atlas = { gw: w, gh: hh, steps: ramp.length, cw: gw, ch: gh }; });
      });
    }

    function paint(now, y0, y1) {
      if (!sheet || !prev) return;
      if (y0 == null) { y0 = 0; y1 = rows; }
      var f0 = performance.now(), m = reduce ? 0 : T.motion, t = now / 1000, life = T['ripple-life'], speed = T['ripple-speed'];
      ripples = ripples.filter(function (r) { return (now - r.t0) / 1000 < life; });
      var nr = ripples.length, rx = [], rz = [], rR = [], rE = [];
      ripples.forEach(function (r) { var age = (now - r.t0) / 1000; rx.push(r.x); rz.push(r.z); rR.push(speed * age); rE.push(1 - Math.min(1, Math.max(0, (age - life * 0.45) / (life * 0.55)))); });
      var iW2 = 1 / (RIP.width * RIP.width), kW = 2 * Math.PI / RIP.wave, iTr = 1 / RIP.trail, hiU = RIP.width * 3, loU = -RIP.trail * 3;
      var sw = SWELLS.map(function (s) { var k = 2 * Math.PI / s.len; return { dx: s.dx, dz: s.dz, k: k, amp: s.amp * 2 * m, w: k * s.speed * (0.5 + m) }; });
      var ox = t * DRIFT[0] * 2 * m, oy = t * DRIFT[1] * 2 * m, open = T.clouds, lo = 0.62 - open * 0.25, lg = T.lime, dark = pal.dark;
      var GW = atlas.gw, GH = atlas.gh, cw = atlas.cw, ch = atlas.ch, ground = rgb(pal.ground), bs = atlas.steps / BANDS, changed = 0;
      for (var y = y0, i = y0 * cols; y < y1; y++) for (var x = 0; x < cols; x++, i++) {
        var key = 0, gi = 0, ci = 0, rsx = 0, rsz = 0, rex = 0;
        if (hit[i] && fade[i] > 0.002) {
          var n0 = Nn[i * 3], n1 = Nn[i * 3 + 1], n2 = Nn[i * 3 + 2], px = P[i * 2], pz = P[i * 2 + 1], e = 0, j, s;
          if (m) for (j = 0; j < 2; j++) { s = sw[j]; var c = s.amp * s.k * Math.cos(s.k * (s.dx * px + s.dz * pz) - s.w * t); n0 -= c * s.dx; n2 -= c * s.dz; }
          for (j = 0; j < nr; j++) {
            var ddx = px - rx[j], ddz = pz - rz[j], dd = Math.sqrt(ddx * ddx + ddz * ddz) + 1e-6, u = dd - rR[j];
            if (u > hiU || u < loU) continue;
            var g = Math.exp(-u * u * iW2), slope = RIP.amp * rE[j] * g * (-2 * u * iW2 * Math.cos(kW * u) - kW * Math.sin(kW * u)) / dd;
            n0 -= slope * ddx; n2 -= slope * ddz; rsx += slope * ddx; rsz += slope * ddz;
            var ex = (u > 0 ? g : Math.exp(u * iTr)) * rE[j]; if (ex > e) e = ex;
          }
          var nl = Math.sqrt(n0 * n0 + n1 * n1 + n2 * n2), diff = Math.max(0, (n0 * KEY[0] + n1 * KEY[1] + n2 * KEY[2]) / nl);
          var lum = Math.min(1, AMB * ao[i] + (1 - AMB) * diff * sh[i] * (0.55 + 0.45 * ao[i]));
          var shade = dark ? Math.pow(lum, 0.85) : Math.pow(1 - lum, 1.5);
          var cx = (x + 0.5) * cw + ox, cy = (y + 0.5) * ch + oy;
          var cl = (0.5 * vnoise(cx / 300, cy / 300) + 0.25 * vnoise(cx / 148 + 17, cy / 148 - 9) + 0.125 * vnoise(cx / 73 + 34, cy / 73 - 18)) / 0.875;
          var rest = 0.05 + open * 0.8 * Math.max(0, Math.min(1, (cl - lo) / 0.22));
          // The quiet zone keeps ripples off the copy and thins the cloth behind it to a third.
          rex = e;
          e *= quiet[i]; rest *= (0.35 + 0.65 * quiet[i]) * (0.15 + 0.85 * thin[i]);
          var al = Math.max(Math.min(1, shade * 1.4) * rest, e) * fade[i], li = Math.round(Math.min(1, e * lg) * (L_LEVELS - 1));
          var band = Math.max(0, Math.min(BANDS - 1, Math.floor((shade * 1.4 + e * 0.3) * BANDS)));
          gi = Math.min(atlas.steps - 1, Math.floor(band * bs + pick[i] * bs));
          var ai = Math.round(al * A_LEVELS);
          if (ai > 0) { ci = (ai - 1) * L_LEVELS + li; key = 1 + ci * atlas.steps + gi; }
        }
        TX[i] = rsx; TY[i] = rsz; LT[i] = rex;
        if (prev[i] === key) continue;
        prev[i] = key; changed++;
        if (key) ctx.drawImage(sheet, gi * GW, ci * GH, GW, GH, x * GW, y * GH, GW, GH);
        else { ctx.fillStyle = ground; ctx.fillRect(x * GW, y * GH, GW, GH); }
      }
      stats.changed = changed; stats.frame = +(performance.now() - f0).toFixed(1);
      lastPaint = now;
      // The ripple per glyph cell before the quiet zone, for a figure drawn on top: tilt across and down, and light 0..1.
      if (o.onFrame && y0 === 0 && y1 === rows) o.onFrame({ cols: cols, rows: rows, cellWidth: cw, cellHeight: ch, tiltX: TX, tiltY: TY, light: LT, rippling: nr > 0, lime: lg });
    }

    // Full rate during a ripple, frame-rate at rest, idle off screen, at motion 0 and under reduced motion.
    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (!visible || !ready) return;
      if (ripples.length || (!reduce && T.motion > 0 && now - lastPaint > 1000 / T['frame-rate'])) paint(now);
    }
    raf = requestAnimationFrame(loop);
    var io = new IntersectionObserver(function (en) { visible = en[0].isIntersecting; });
    io.observe(stage);

    function onDown(ev) {
      if (reduce || !ready || (ev.target.closest && ev.target.closest(o.ignore))) return;
      var r = canvas.getBoundingClientRect(), x = Math.floor((ev.clientX - r.left) / atlas.cw), y = Math.floor((ev.clientY - r.top) / atlas.ch), i = y * cols + x;
      if (x < 0 || y < 0 || x >= cols || y >= rows || !hit[i]) return;
      ripples.push({ x: P[i * 2], z: P[i * 2 + 1], t0: performance.now() });
    }
    stage.addEventListener('pointerdown', onDown);
    var ro = new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(build, 200); });
    ro.observe(stage);
    // A theme change redraws the sprite sheet in the new colours; the cloth itself is unchanged.
    var mo = new MutationObserver(function () {
      if (!ready) return;
      readTokens();
      buildSheet(atlas.cw, atlas.ch).then(function () { prev.fill(-1); ctx.fillStyle = rgb(pal.ground); ctx.fillRect(0, 0, canvas.width, canvas.height); paint(performance.now()); });
    });
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    // Start after the page has painted, so the copy never waits on the field.
    function start() { if (window.requestIdleCallback) requestIdleCallback(build, { timeout: 600 }); else setTimeout(build, 50); }
    if (document.readyState === 'complete') start(); else addEventListener('load', start, { once: true });

    return {
      stats: stats,
      get ready() { return ready; },
      destroy: function () { token++; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); mo.disconnect(); stage.removeEventListener('pointerdown', onDown); canvas.remove(); }
    };
  }

  window.FoundationsField = { mount: mount, version: 2 };
})();

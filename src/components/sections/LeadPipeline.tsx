import { useEffect, useRef } from 'react'
import { LEAD_PIPELINE as LP } from '../../lib/constants'

/*
 * Lead pipeline, with and without AI.
 * Leads flow in from the left. Left of the draggable divider (dark side) the AI captures and follows up
 * every lead: they turn purple and reach the signed mandate. Right of it (pale side) most leads turn dark,
 * show why they were lost and drop out. Canvas animation, paused while off screen.
 */

type RGB = [number, number, number]

/* brand palette */
const C = {
  darkBg: '#0F1117',
  lightBg: '#F7F5FF',
  purple: '#6D4AFF',
  purpleSoft: '#A78BFA',
  purpleLight: '#C084FC',
  ink: '#0F1117',
  muted: '#6B7280',
}
const ANON: RGB = [214, 208, 238]
const ANON_HOT: RGB = [167, 139, 250]
const PURPLE: RGB = [109, 74, 255]
const DEAD: RGB = [36, 32, 52]

const SANS = 'Jost, Arial, sans-serif'
const MONO = '"Fira Mono", monospace'
const SPAWN_RATE = 3.6 // new leads per second
const MAX_CARDS = 4 // reason cards visible at once

interface Dot {
  name: string
  state: 'flow' | 'lost'
  x0: number; x: number; y0: number; y: number
  vx: number; off: number; ph: number; hot: boolean
  lt: number; vy: number; alpha: number
  card: boolean; reason: string; gx: number
  safe: boolean; lossAt: number | null
  ai: { label: string; at: number; text: string } | null
  aiCard: boolean; aiDone: boolean; aiT: number
}

const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t))
const seg = (u: number, a: number, b: number) => ease((u - a) / (b - a))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const mix = (a: RGB, b: RGB, t: number) =>
  `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`

export function LeadPipeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rangeRef = useRef<HTMLInputElement>(null)
  const withRef = useRef<HTMLSpanElement>(null)
  const withoutRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    const range = rangeRef.current
    if (!cv || !range) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const NAMES = [...LP.names]
    for (let i = NAMES.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[NAMES[i], NAMES[j]] = [NAMES[j], NAMES[i]]
    }
    const REASONS = LP.reasons
    let nameIdx = 0
    let reasonIdx = Math.floor(Math.random() * REASONS.length)

    let W = 0, H = 0, dpr = 1, top = 110, bot = 400, stacked = false, narrow = false, shortChips = false
    let dots: Dot[] = []
    let signed = 0, total = 0, pulse = 0, T = 0
    let chipPos: { x: number; y: number; w: number }[] = []

    const spacing = (px: number) => {
      if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = px + 'px'
    }
    // square corners everywhere (brand); kept as a helper so cards/chips share one path
    const rect = (x: number, y: number, w: number, h: number) => {
      ctx.beginPath()
      ctx.rect(x, y, w, h)
    }

    const chipFont = () => `500 ${narrow ? 10 : 11}px ${MONO}`
    const chipText = (c: [string, string]) => (shortChips ? c[1] : c[0]).toUpperCase()

    function layout() {
      const r = cv!.parentElement!.getBoundingClientRect()
      W = Math.max(280, Math.round(r.width))
      narrow = W < 560
      H = Math.round(clamp(W * 0.46, 400, 540))
      dpr = Math.min(2, window.devicePixelRatio || 1)
      ctx!.font = chipFont()
      spacing(0.4)
      const spread = [0.03, 0.24, 0.45, 0.64]
      const measure = () =>
        LP.chipsWith.map((c, i) =>
          Math.max(ctx!.measureText(chipText(c)).width, ctx!.measureText(chipText(LP.chipsWithout[i])).width) + 24,
        )
      const overflows = (ws: number[]) =>
        ws.some((w, k) => W * spread[k] + w + 8 > (k < 3 ? W * spread[k + 1] : W))
      // long labels spread across the stages → short labels spread → stacked list as a last resort
      shortChips = narrow
      let widths = measure()
      if (!shortChips && overflows(widths)) { shortChips = true; widths = measure() }
      stacked = overflows(widths)
      spacing(0)
      chipPos = widths.map((w, i) =>
        stacked ? { x: 14, y: 64 + i * 28, w } : { x: Math.round(W * spread[i]), y: 64, w },
      )
      if (stacked) H = Math.max(H, 480)
      top = stacked ? 184 : 114
      bot = H - 66
      cv!.width = Math.round(W * dpr)
      cv!.height = Math.round(H * dpr)
      cv!.style.height = H + 'px'
    }

    const mandatePos = () => ({ x: W - (narrow ? 52 : 64), y: (top + bot) / 2 })
    const divX = () => (Number(range!.value) / 1000) * W

    /* ---------- simulation ---------- */
    function aiPlan(): Dot['ai'] {
      if (Math.random() > 0.4) return null
      const cap = Math.random() < 0.5
      const src = cap ? LP.aiCapture : LP.aiFollow
      return {
        label: src.label,
        at: cap ? 0.21 + Math.random() * 0.09 : 0.4 + Math.random() * 0.15,
        text: src.items[Math.floor(Math.random() * src.items.length)],
      }
    }
    function spawn() {
      const x0 = W * (0.03 + Math.random() * 0.17)
      dots.push({
        name: NAMES[nameIdx++ % NAMES.length], state: 'flow',
        x0, x: x0, y0: top + 8 + Math.random() * (bot - top - 16), y: 0,
        vx: W * (0.05 + Math.random() * 0.02), off: (Math.random() - 0.5) * 70,
        ph: Math.random() * 6.28, hot: Math.random() < 0.28,
        lt: 0, vy: 0, alpha: 1, card: false, reason: '', gx: 0,
        safe: Math.random() < 0.28, lossAt: null, ai: aiPlan(), aiCard: false, aiDone: false, aiT: 0,
      })
      total++
    }
    function pathY(d: Dot) {
      const m = mandatePos()
      const p = clamp((d.x - d.x0) / Math.max(1, m.x - d.x0), 0, 1)
      const y = lerp(d.y0, m.y + d.off, seg(p, 0.12, 0.85))
      return lerp(y, m.y, seg(p, 0.88, 1))
    }
    // a card is shown only if there is room: few at once, none stacked on another
    function canPlace(d: Dot) {
      const maxCards = narrow ? 2 : MAX_CARDS
      let n = 0
      for (const o of dots) {
        if (o !== d && ((o.state === 'lost' && o.card) || o.aiCard)) {
          n++
          if (Math.abs(o.y - d.y) < 58 && Math.abs(o.x - d.x) < 240) return false
        }
      }
      return n < maxCards
    }
    function loseDot(d: Dot) {
      d.state = 'lost'
      d.lt = 0
      d.reason = REASONS[reasonIdx++ % REASONS.length]
      d.gx = d.vx * 0.25
      d.aiCard = false
      d.card = canPlace(d)
    }
    function step(dt: number) {
      T += dt
      const m = mandatePos(), dx = divX()
      if (Math.random() < SPAWN_RATE * dt && dots.length < 160) spawn()
      pulse = Math.max(0, pulse - dt * 2.5)
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i]
        if (d.state === 'flow') {
          d.x += d.vx * dt
          d.y = pathY(d)
          if (d.x >= m.x - 3) { signed++; pulse = 1; dots.splice(i, 1); continue }
          if (d.x > dx) {
            // past the divider: keep flowing a little, then most leads drop out; a few still make it
            d.aiCard = false
            if (!d.safe) {
              if (d.lossAt === null) d.lossAt = d.x + 50 + Math.random() * 110
              if (d.x >= d.lossAt) loseDot(d)
            }
          } else {
            d.lossAt = null
            if (d.ai && !d.aiDone && d.x / W >= d.ai.at && d.x < dx - 30) {
              d.aiDone = true
              if (canPlace(d)) { d.aiCard = true; d.aiT = 0 }
            }
          }
          if (d.aiCard) { d.aiT += dt; if (d.aiT > 2.6) d.aiCard = false }
        } else {
          d.lt += dt
          if (d.lt > 1.2) d.vy += 170 * dt
          d.y += d.vy * dt
          d.x += d.gx * Math.max(0, 1 - d.lt / 1.2) * dt
          d.alpha = d.lt < 1.8 ? 1 : 1 - (d.lt - 1.8) / 1.4
          if (d.alpha <= 0 || d.y > H + 10) dots.splice(i, 1)
        }
      }
    }

    /* ---------- drawing ---------- */
    function drawChips(dark: boolean) {
      const set = dark ? LP.chipsWith : LP.chipsWithout
      ctx!.font = chipFont()
      spacing(0.4)
      ctx!.textBaseline = 'middle'
      ctx!.textAlign = 'left'
      for (let i = 0; i < 4; i++) {
        const c = chipPos[i], h = narrow ? 22 : 24
        rect(c.x, c.y, c.w, h)
        if (dark) { ctx!.fillStyle = C.purple; ctx!.fill(); ctx!.fillStyle = '#fff' }
        else { ctx!.strokeStyle = 'rgba(15,17,23,.28)'; ctx!.lineWidth = 1; ctx!.stroke(); ctx!.fillStyle = C.muted }
        ctx!.fillText(chipText(set[i]), c.x + 12, c.y + h / 2 + 0.5)
      }
      spacing(0)
    }
    function drawBackground(dark: boolean) {
      ctx!.fillStyle = dark ? C.darkBg : C.lightBg
      ctx!.fillRect(0, 0, W, H)
      // dashed stage lines, like the page rails
      ctx!.lineWidth = 1
      ctx!.setLineDash([2, 2])
      ctx!.strokeStyle = dark ? 'rgba(255,255,255,.16)' : 'rgba(15,17,23,.18)'
      for (const s of LP.stages) {
        const x = Math.round(s[2] * W) + 0.5
        ctx!.beginPath(); ctx!.moveTo(x, 62); ctx!.lineTo(x, H - 54); ctx!.stroke()
      }
      ctx!.setLineDash([])
      ctx!.fillStyle = dark ? 'rgba(255,255,255,.55)' : '#8A8FA0'
      ctx!.textBaseline = 'middle'
      if (W < 720) {
        ctx!.textAlign = 'center'
        ctx!.font = `500 ${narrow ? 9.5 : 10.5}px ${MONO}`
        spacing(0.4)
        for (const s of LP.stages) { ctx!.fillText(s[0], s[2] * W, H - 38); ctx!.fillText(s[1], s[2] * W, H - 24) }
      } else {
        ctx!.textAlign = 'left'
        ctx!.font = `500 11.5px ${MONO}`
        spacing(0.6)
        for (const s of LP.stages) ctx!.fillText(`[${s[0]}] ${s[1]}`, s[2] * W - 21, H - 30)
      }
      spacing(0)
      drawChips(dark)
    }

    function dotStyle(d: Dot) {
      const f = d.x / W
      const base = d.hot ? ANON_HOT : ANON
      let col = mix(base, PURPLE, seg(f, 0.14, 0.32))
      // leads keep growing as they move through the stages, until they reach the mandate
      let r = 3 + 5 * clamp(d.x / mandatePos().x, 0, 1)
      if (d.state === 'lost') {
        const k = clamp(d.lt / 0.3, 0, 1), t = seg(f, 0.14, 0.32)
        const tinted: RGB = [lerp(base[0], PURPLE[0], t), lerp(base[1], PURPLE[1], t), lerp(base[2], PURPLE[2], t)]
        col = mix(tinted, DEAD, k)
        r += 1.6 * k
      }
      return { col, r }
    }

    function draw() {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const dx = Math.round(divX())
      if (dx > 0) { ctx!.save(); ctx!.beginPath(); ctx!.rect(0, 0, dx, H); ctx!.clip(); drawBackground(true); ctx!.restore() }
      if (dx < W) { ctx!.save(); ctx!.beginPath(); ctx!.rect(dx, 0, W - dx, H); ctx!.clip(); drawBackground(false); ctx!.restore() }

      // dots + names
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'alphabetic'
      ctx!.font = `400 ${narrow ? 10 : 11}px ${SANS}`
      const cards: { d: Dot; x: number; y: number; r: number; ai?: boolean }[] = []
      for (const d of dots) {
        const s = dotStyle(d), wob = d.state === 'flow' ? Math.sin(T * 1.4 + d.ph) * 2 : 0
        const x = d.x, y = d.y + wob
        ctx!.globalAlpha = d.alpha
        ctx!.fillStyle = s.col
        ctx!.beginPath(); ctx!.arc(x, y, s.r, 0, 6.2832); ctx!.fill()
        if (d.x / W > 0.2) {
          ctx!.fillStyle = x < dx ? 'rgba(255,255,255,.78)' : '#4B5060'
          ctx!.globalAlpha = d.alpha * 0.9
          ctx!.fillText(d.name, x, y - s.r - 4)
        }
        if (d.state === 'lost' && d.card) cards.push({ d, x, y, r: s.r })
        else if (d.state === 'flow' && d.aiCard) cards.push({ d, x, y, r: s.r, ai: true })
      }
      ctx!.globalAlpha = 1

      // mandate target
      const m = mandatePos(), dark = m.x < dx, grow = 1 + 0.18 * pulse
      ctx!.fillStyle = `rgba(109,74,255,${dark ? 0.26 : 0.16})`
      ctx!.beginPath(); ctx!.arc(m.x, m.y, 19 * grow, 0, 6.2832); ctx!.fill()
      ctx!.fillStyle = dark ? C.purple : C.purpleSoft
      ctx!.beginPath(); ctx!.arc(m.x, m.y, 12.5 * grow, 0, 6.2832); ctx!.fill()
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'alphabetic'
      ctx!.fillStyle = dark ? 'rgba(255,255,255,.6)' : '#8A8FA0'
      ctx!.font = `500 10.5px ${MONO}`
      spacing(0.8)
      ctx!.fillText(LP.mandate, m.x, m.y + 36)
      spacing(0)
      ctx!.font = `400 ${narrow ? 10 : 11}px ${SANS}`
      ctx!.fillText(LP.counter(signed, total), m.x, m.y + 51)

      // reason / AI cards with a purple ring around the lead
      for (const c of cards) {
        const d = c.d
        const k = c.ai
          ? clamp(Math.min(d.aiT / 0.3, (2.6 - d.aiT) / 0.4), 0, 1)
          : clamp(d.lt / 0.3, 0, 1) * d.alpha
        ctx!.globalAlpha = k
        ctx!.strokeStyle = c.ai ? C.purpleLight : C.purple
        ctx!.lineWidth = 1.5
        ctx!.beginPath(); ctx!.arc(c.x, c.y, c.r + 4.5, 0, 6.2832); ctx!.stroke()
        const first = d.name
        const sub = c.ai && d.ai ? `${d.ai.label} · ${d.ai.text}` : d.reason
        ctx!.font = `600 13px ${SANS}`
        const nw = ctx!.measureText(first).width
        ctx!.font = `400 12px ${SANS}`
        const tw = ctx!.measureText(sub).width
        const w = Math.max(nw, tw) + 28, h = 46
        let x0 = c.x + 18
        if (x0 + w > W - 8) x0 = c.x - 18 - w
        const y0 = clamp(c.y - 22, 60, H - 60 - h)
        // frosted glass: blur what is behind the card, then tint it
        ctx!.save(); rect(x0, y0, w, h); ctx!.clip()
        if ('filter' in ctx!) { ctx!.filter = 'blur(7px)'; ctx!.drawImage(cv!, 0, 0, cv!.width, cv!.height, 0, 0, W, H) }
        ctx!.restore()
        rect(x0, y0, w, h)
        ctx!.fillStyle = c.ai ? 'rgba(15,17,23,0.66)' : 'rgba(255,255,255,0.72)'
        ctx!.fill()
        ctx!.strokeStyle = c.ai ? 'rgba(192,132,252,0.35)' : 'rgba(15,17,23,0.18)'
        ctx!.lineWidth = 1
        ctx!.stroke()
        ctx!.textAlign = 'left'
        ctx!.textBaseline = 'alphabetic'
        ctx!.fillStyle = c.ai ? '#fff' : C.ink
        ctx!.font = `600 13px ${SANS}`
        ctx!.fillText(first, x0 + 14, y0 + 19)
        ctx!.fillStyle = c.ai ? C.purpleLight : C.muted
        ctx!.font = `400 12px ${SANS}`
        ctx!.fillText(sub, x0 + 14, y0 + 36)
      }
      ctx!.globalAlpha = 1

      // divider
      ctx!.fillStyle = C.purple
      ctx!.fillRect(clamp(dx, 1, W - 1) - 1, 56, 2, H - 112)
    }

    /* ---------- loop and controls ---------- */
    let last = 0, raf = 0, visible = false, started = false, resizeTimer = 0

    function frame(now: number) {
      const dt = last ? clamp((now - last) / 1000, 0, 0.05) : 0.016
      last = now
      step(dt)
      draw()
      raf = requestAnimationFrame(frame)
    }
    function play() {
      if (reduce || !started || raf) return
      last = 0
      raf = requestAnimationFrame(frame)
    }
    function pause() {
      cancelAnimationFrame(raf)
      raf = 0
    }
    function syncUI() {
      const v = Number(range!.value) / 1000
      range!.style.setProperty('--p', (v * 100).toFixed(1) + '%')
      withRef.current?.classList.toggle('is-on', v >= 0.5)
      withoutRef.current?.classList.toggle('is-on', v < 0.5)
      if (reduce || !raf) { step(0); draw() }
    }
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => { layout(); draw() }, 80)
    }
    function start() {
      if (started) return
      started = true
      layout()
      syncUI()
      // warm up so the stage is already full of leads on first view
      for (let i = 0; i < 480; i++) step(0.04)
      draw()
      if (visible) play()
    }

    range.addEventListener('input', syncUI)
    window.addEventListener('resize', onResize)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) play()
      else pause()
    }, { rootMargin: '100px' })
    io.observe(cv)

    const fontsReady = document.fonts
      ? Promise.all([document.fonts.load(`500 11px ${MONO}`), document.fonts.load(`400 12px ${SANS}`), document.fonts.load(`600 13px ${SANS}`)])
      : Promise.resolve()
    fontsReady.then(start, start)
    const fallback = window.setTimeout(start, 800)

    return () => {
      pause()
      io.disconnect()
      range.removeEventListener('input', syncUI)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(resizeTimer)
      window.clearTimeout(fallback)
      dots = []
    }
  }, [])

  return (
    <div>
      <div className="lead-stage">
        <div className="lead-control">
          <span ref={withoutRef} className="lead-control-lbl">{LP.withoutLabel}</span>
          <input
            ref={rangeRef}
            type="range"
            className="lead-range"
            min={0}
            max={1000}
            defaultValue={570}
            aria-label={LP.ariaSlider}
          />
          <span ref={withRef} className="lead-control-lbl is-on">{LP.withLabel}</span>
        </div>
        <canvas ref={canvasRef} role="img" aria-label={LP.ariaCanvas} className="block w-full" style={{ touchAction: 'pan-y' }} />
      </div>
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.04em] text-ink-body">
        <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgb(214,208,238)' }} />{LP.legend.visitor}</li>
        <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: C.purple }} />{LP.legend.active}</li>
        <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgb(36,32,52)' }} />{LP.legend.lost}</li>
      </ul>
    </div>
  )
}

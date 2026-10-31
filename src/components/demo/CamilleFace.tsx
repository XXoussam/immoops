import { useEffect, useRef } from 'react'
import { gaze, startGazeTracking } from './faceGaze'

/*
 * Camille's face in the chat: a black disc with two white pill eyes. The eyes follow the mouse,
 * the caret while the visitor types, and look around while a reply is generated (the face sways);
 * it blinks, hops now and then, and bounces when a reply arrives. Geometry is recomputed every
 * frame (requestAnimationFrame) and paused off screen; static with prefers-reduced-motion.
 * viewBox 100×100, face centred on (50, 50), eyes centred on y = 40.
 */
const EYE_Y = 40
const clamp = (v: number) => Math.max(-1, Math.min(1, v))

export function CamilleFace({ size = 28, className = '' }: { size?: number; className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const faceRef = useRef<SVGGElement>(null)
  const eyesRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const svg = svgRef.current, face = faceRef.current, eyes = eyesRef.current
    if (!svg || !face || !eyes) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    startGazeTracking()

    // each face gets its own rhythm, so several faces on screen don't move in sync
    const seed = Math.random()
    const rand = () => Math.random()
    const cur = { x: 0, y: 0 }
    let wander = { x: 0, y: 0, until: 0 }
    let nextBlink = performance.now() + 1500 + seed * 2500, blinkAt = -1, doubleBlink = false
    let nextHop = performance.now() + 5000 + seed * 4000, hopAt = -1
    let last = performance.now(), raf = 0

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const r = svg.getBoundingClientRect()
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2

      // where to look: [-1, 1] on each axis
      let tx: number, ty: number, sway = 0, bob = 0
      if (gaze.thinking) {
        // pondering: scans left and right, mostly upwards, swaying
        const s = now / 1000 + seed * 10
        tx = Math.sin(s * 2.2) * 0.95
        ty = -0.55 + Math.sin(s * 1.3) * 0.3
        sway = Math.sin(s * 3) * 6
        bob = Math.abs(Math.sin(s * 4)) * 2.5
      } else {
        const target = gaze.caret && now - gaze.typingAt < 1800 ? gaze.caret
          : gaze.pointer && now - gaze.pointerAt < 5000 ? gaze.pointer : null
        if (target) {
          const dx = target.x - cx, dy = target.y - cy
          const k = 1.25 / (Math.hypot(dx, dy) + 90) // close targets move the eyes less
          tx = clamp(dx * k)
          ty = clamp(dy * k)
        } else {
          // nobody around: glance here and there
          if (now > wander.until) wander = { x: (rand() * 2 - 1) * 0.9, y: (rand() * 2 - 1) * 0.6, until: now + 1200 + rand() * 2200 }
          tx = wander.x
          ty = wander.y
        }
      }
      const ease = 1 - Math.exp(-dt * (gaze.thinking ? 8 : 14))
      cur.x += (tx - cur.x) * ease
      cur.y += (ty - cur.y) * ease

      // hops: a small one now and then, a double bounce when a reply arrives
      let hop = 0
      if (now > nextHop && !gaze.thinking) { hopAt = now; nextHop = now + 6000 + rand() * 6000 }
      if (hopAt > 0 && now - hopAt < 450) hop = Math.sin(((now - hopAt) / 450) * Math.PI) * 6
      const sinceReply = now - gaze.bounceAt
      if (sinceReply < 800) {
        const p = sinceReply / 800
        hop = Math.max(hop, Math.abs(Math.sin(p * Math.PI * 2)) * (1 - p) * 12)
      }
      const stretch = hop / 120 // a little taller in the air

      // blink: lids shut fast, sometimes twice
      if (now > nextBlink) {
        blinkAt = now
        doubleBlink = rand() < 0.25
        nextBlink = now + 2500 + rand() * 3500
      }
      let open = 1
      const b = now - blinkAt
      if (blinkAt > 0 && b < 160) open = 1 - Math.sin((b / 160) * Math.PI) * 0.92
      else if (doubleBlink && b > 220 && b < 380) open = 1 - Math.sin(((b - 220) / 160) * Math.PI) * 0.92

      const lean = cur.x * 6 + sway
      face.setAttribute(
        'transform',
        `translate(${(cur.x * 3).toFixed(2)} ${(cur.y * 2 - hop - bob).toFixed(2)}) ` +
          `rotate(${lean.toFixed(2)} 50 50) translate(50 100) scale(${(1 - stretch).toFixed(3)} ${(1 + stretch).toFixed(3)}) translate(-50 -100)`,
      )
      eyes.setAttribute(
        'transform',
        `translate(${(cur.x * 13).toFixed(2)} ${(cur.y * 11 + EYE_Y).toFixed(2)}) scale(1 ${open.toFixed(3)}) translate(0 ${-EYE_Y})`,
      )
      raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) { last = performance.now(); raf = requestAnimationFrame(frame) }
      if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0 }
    })
    io.observe(svg)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`shrink-0 overflow-visible ${className}`}
      aria-hidden="true"
    >
      <g ref={faceRef}>
        <circle cx="50" cy="50" r="50" fill="#0A0A0A" />
        <g ref={eyesRef} fill="#FFFFFF">
          <rect x="31.5" y="28" width="11" height="24" rx="5.5" />
          <rect x="57.5" y="28" width="11" height="24" rx="5.5" />
        </g>
      </g>
    </svg>
  )
}

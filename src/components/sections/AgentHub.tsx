import { useEffect, useRef } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon, Database01Icon } from '@hugeicons/core-free-icons'
import { AGENT_CHANNELS, DEMOS_PAGE } from '../../lib/constants'

/*
 * The agent's eye (after the "lighthouse eye" reference). The eye is the light source: its beam leaves
 * from the two corners of the eye and widens towards the edges of the frame, strong near the eye and
 * weaker (and grainier) as it travels. The gaze moves from left to right and rests mostly in the lower
 * half; each move overshoots a little and settles, and the iris makes tiny jumps while it holds. The upper
 * lid follows the gaze down, the pupil breathes. When the eye blinks the beam narrows to the closed lid and
 * fades, then comes back as the eye opens. Geometry is recomputed every frame (requestAnimationFrame).
 * viewBox 240×120, eye centred on (120, 58).
 */
type Pt = [number, number]
const EYE_C: Pt = [120, 58]
const EYE_TOP: Pt[] = [[56, 58], [84, 20], [156, 20], [184, 58]]
const EYE_BOTTOM: Pt[] = [[184, 58], [156, 94], [84, 94], [56, 58]]
const ALMOND_D = 'M56 58 C 84 20, 156 20, 184 58 C 156 94, 84 94, 56 58 Z'
/* size of the eye (and its beam) inside the box, scaled around the eye's centre */
const EYE_SCALE = 0.8

const bez = (p: Pt[], t: number): Pt => {
  const u = 1 - t
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t
  return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]]
}
/* outline of the eye, flattened vertically by `open` (1 = open, ~0 = shut) */
const almond = (open: number): Pt[] => {
  const pts: Pt[] = []
  for (const curve of [EYE_TOP, EYE_BOTTOM]) {
    for (let i = 0; i < 16; i++) {
      const [x, y] = bez(curve, i / 16)
      pts.push([x, EYE_C[1] + (y - EYE_C[1]) * open])
    }
  }
  return pts
}
/* convex hull (monotone chain) */
const hull = (pts: Pt[]): Pt[] => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower: Pt[] = []
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop()
    lower.push(q)
  }
  const upper: Pt[] = []
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop()
    upper.push(q)
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1))
}

/* gaze path: [time s, angle°] — 180 = left, 90 = down, 0 = right. The eye rests mostly in the lower
   half (down-left / down-right), with quick saccade-like moves between holds */
const GAZE: [number, number][] = [
  [0, 180], [1.0, 180], [1.5, 140], [3.0, 140], [3.5, 62], [5.0, 62], [5.5, 0], [7.4, 0],
  [7.9, 38], [9.4, 38], [9.9, 118], [11.3, 118], [11.8, 180], [13.6, 180],
]
const CYCLE = 13.6
const BLINKS = [6.5, 12.6] // blink start times (on the right, then on the left)
const smooth = (t: number) => t * t * (3 - 2 * t)
/* arrives a little past the target and settles back: the iris "bounces" at the end of each move */
const settle = (t: number) => {
  const c1 = 1.25, c3 = c1 + 1, x = t - 1
  return 1 + c3 * x * x * x + c1 * x * x
}

function gazeAngle(t: number) {
  for (let i = 0; i < GAZE.length - 1; i++) {
    const [t0, a0] = GAZE[i], [t1, a1] = GAZE[i + 1]
    if (t >= t0 && t <= t1) return a0 + (a1 - a0) * (a0 === a1 ? 0 : settle((t - t0) / (t1 - t0 || 1)))
  }
  return 180
}
/* tiny involuntary jumps while the eye holds still (deterministic pseudo-random) */
const rand = (k: number, s: number) => {
  const v = Math.sin(k * 127.1 + s * 311.7) * 43758.5453
  return v - Math.floor(v)
}
function microJitter(t: number): Pt {
  const step = 0.6, k = Math.floor(t / step), f = (t - k * step) / 0.09
  const a: Pt = [(rand(k - 1, 1) - 0.5) * 2.6, (rand(k - 1, 2) - 0.5) * 1.4]
  const b: Pt = [(rand(k, 1) - 0.5) * 2.6, (rand(k, 2) - 0.5) * 1.4]
  const m = smooth(Math.min(1, f))
  return [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m]
}
/* lid openness and light level around a blink: the lid shuts fast, the light lingers then fades */
function blink(t: number) {
  for (const b of BLINKS) {
    const d = t - b
    if (d < 0 || d > 1.1) continue
    const open = d < 0.16 ? 1 - smooth(d / 0.16) * 0.97
      : d < 0.62 ? 0.03
      : d < 0.82 ? 0.03 + smooth((d - 0.62) / 0.2) * 0.97 : 1
    const light = d < 0.16 ? 1
      : d < 0.6 ? 1 - smooth((d - 0.16) / 0.44)
      : d < 0.84 ? smooth((d - 0.6) / 0.24) : 1
    return { open, light }
  }
  return { open: 1, light: 1 }
}

function SearchlightEye({ slogan }: { slogan: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const beamRef = useRef<SVGPolygonElement>(null)
  const beamGroupRef = useRef<SVGGElement>(null)
  const lidsRef = useRef<SVGGElement>(null)
  const irisRef = useRef<SVGGElement>(null)
  const pupilRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current, beam = beamRef.current, beamGroup = beamGroupRef.current
    const lids = lidsRef.current, iris = irisRef.current, pupil = pupilRef.current
    if (!wrap || !beam || !beamGroup || !lids || !iris || !pupil) return

    const render = (t: number) => {
      const angDeg = gazeAngle(t)
      const ang = (angDeg * Math.PI) / 180
      const dir: Pt = [Math.cos(ang), Math.sin(ang)]
      const blinkState = blink(t)
      const light = blinkState.light
      // the upper lid lowers a little when the eye looks down
      const open = blinkState.open * (1 - 0.1 * Math.max(0, dir[1]))

      // beam: hull of the eye and a wider copy pushed far along the gaze → edges start at the eye corners
      const near = almond(open)
      const far = near.map(([x, y]): Pt => [
        EYE_C[0] + (x - EYE_C[0]) * 2.3 + dir[0] * 250,
        EYE_C[1] + (y - EYE_C[1]) * 2.3 + dir[1] * 250,
      ])
      beam.setAttribute('points', hull(near.concat(far)).map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' '))
      beamGroup.setAttribute('opacity', (0.92 * light).toFixed(3))

      // lids close around the eye's horizontal axis
      lids.setAttribute('transform', `translate(0 ${EYE_C[1]}) scale(1 ${open.toFixed(3)}) translate(0 ${-EYE_C[1]})`)

      // iris: wide left/right, a little downwards; tiny jumps while it holds; foreshortened to the side
      const [jx, jy] = microJitter(t)
      const ix = EYE_C[0] + dir[0] * 17 + jx
      const iy = EYE_C[1] + Math.max(0, dir[1]) * 8 + jy
      const squash = 1 - 0.1 * Math.abs(dir[0])
      iris.setAttribute('transform', `translate(${ix.toFixed(2)} ${iy.toFixed(2)}) scale(${squash.toFixed(3)} 1)`)

      // pupil breathes slowly and dilates while the eye is moving
      const speed = Math.min(1, Math.abs(gazeAngle(t) - gazeAngle(Math.max(0, t - 0.06))) / 6)
      const r = 1 + 0.05 * Math.sin(t * 1.4) + 0.12 * speed
      pupil.setAttribute('transform', `scale(${r.toFixed(3)})`)
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    render(0)
    if (reduce) return

    let raf = 0, start = 0, visible = false
    const frame = (now: number) => {
      if (!start) start = now
      render(((now - start) / 1000) % CYCLE)
      raf = requestAnimationFrame(frame)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(frame)
      if (!visible && raf) { cancelAnimationFrame(raf); raf = 0 }
    })
    io.observe(wrap)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [])

  /* glowing light streaks in the iris, scattered irregularly: [angle°, distance from centre, length, width, opacity] */
  const marks: [number, number, number, number, number][] = [
    [192, 15.5, 10, 2.2, 0.95], [203, 17, 8, 1.4, 0.8], [214, 14.5, 9, 1.8, 0.9],
    [281, 16, 9.5, 2, 0.95], [296, 18, 6.5, 1.3, 0.7],
    [12, 15, 10.5, 2.1, 0.95], [27, 17.5, 7, 1.5, 0.75], [39, 14.5, 8, 1.2, 0.6],
    [118, 16.5, 9, 1.9, 0.9], [131, 15, 10, 2.3, 0.95], [146, 18.5, 5.5, 1.2, 0.6],
    [248, 19, 5, 1, 0.45], [338, 18.5, 6, 1.1, 0.5], [77, 19, 5, 1, 0.45],
  ]
  /* faint radial fibres for texture */
  const fibres = Array.from({ length: 36 }, (_, i) => i * 10 + ((i * 37) % 7))
  return (
    <div ref={wrapRef} className="relative aspect-[2/1] w-full">
      {/* translucent dark box with a hairline border */}
      <div className="eye-box absolute inset-0 overflow-hidden rounded-[10px] bg-black/45">
      <svg viewBox="0 0 240 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          {/* soft edges, smooth falloff, with a fine film grain only where the light falls */}
          <filter id="eye-beam-grain" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="soft" />
            <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed="11" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.6 -0.3" result="speck" />
            <feComposite in="soft" in2="speck" operator="arithmetic" k1="0.45" k2="0.8" k3="0" k4="0" />
            {/* keep the light pure white: only its transparency is dithered */}
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
          </filter>
          {/* strong next to the eye, weaker as it travels away from it */}
          <radialGradient id="eye-beam-fall" gradientUnits="userSpaceOnUse" cx="120" cy="58" r="235">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="0.22" stopColor="#FFFFFF" stopOpacity="0.92" />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.62" />
            <stop offset="0.8" stopColor="#FFFFFF" stopOpacity="0.36" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.2" />
          </radialGradient>
          <radialGradient id="eye-iris" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#111016" />
            <stop offset="0.8" stopColor="#050507" />
            <stop offset="1" stopColor="#24222C" />
          </radialGradient>
          <clipPath id="eye-almond">
            <path d={ALMOND_D} />
          </clipPath>
          {/* soft glow around the light streaks in the iris */}
          <filter id="eye-mark-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* the corners of the eye are darker on the inside */}
          <radialGradient id="eye-corner-l" gradientUnits="userSpaceOnUse" cx="56" cy="58" r="30">
            <stop offset="0" stopColor="#16141E" stopOpacity="0.9" />
            <stop offset="0.45" stopColor="#16141E" stopOpacity="0.35" />
            <stop offset="1" stopColor="#16141E" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="eye-corner-r" gradientUnits="userSpaceOnUse" cx="184" cy="58" r="30">
            <stop offset="0" stopColor="#16141E" stopOpacity="0.9" />
            <stop offset="0.45" stopColor="#16141E" stopOpacity="0.35" />
            <stop offset="1" stopColor="#16141E" stopOpacity="0" />
          </radialGradient>
          {/* the upper lid casts a soft shadow on the eye */}
          <linearGradient id="eye-lid-shadow" gradientUnits="userSpaceOnUse" x1="0" y1="24" x2="0" y2="48">
            <stop offset="0" stopColor="#14121C" stopOpacity="0.45" />
            <stop offset="1" stopColor="#14121C" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={`translate(${EYE_C[0]} ${EYE_C[1]}) scale(${EYE_SCALE}) translate(${-EYE_C[0]} ${-EYE_C[1]})`}>
        {/* the beam, behind the eye */}
        <g ref={beamGroupRef}>
          <polygon ref={beamRef} fill="url(#eye-beam-fall)" filter="url(#eye-beam-grain)" />
        </g>

        {/* the eye: white like the light it gives off */}
        <g ref={lidsRef}>
          <path d={ALMOND_D} fill="#FFFFFF" />
          <g clipPath="url(#eye-almond)">
            <circle cx="56" cy="58" r="30" fill="url(#eye-corner-l)" />
            <circle cx="184" cy="58" r="30" fill="url(#eye-corner-r)" />
            <g ref={irisRef}>
              <circle r="29" fill="url(#eye-iris)" />
              {/* faint lighter rim, like a lens */}
              <circle r="27.6" fill="none" stroke="#4A4656" strokeWidth="1.6" opacity="0.55" />
              {fibres.map((deg) => (
                <rect key={deg} x="-0.25" y="-27" width="0.5" height="14" fill="#8C88A0" opacity="0.14" transform={`rotate(${deg})`} />
              ))}
              <g filter="url(#eye-mark-glow)">
                {marks.map(([deg, dist, len, w, op]) => (
                  <rect key={deg} x={-w / 2} y={-(dist + len)} width={w} height={len} rx={w / 2.5} fill="#FFFFFF" opacity={op} transform={`rotate(${deg})`} />
                ))}
              </g>
              {/* pupil: a white disc with a thin dark ring; scaled by JS (breathing / dilation) */}
              <g ref={pupilRef}>
                <circle r="11" fill="#FFFFFF" />
                <circle r="11" fill="none" stroke="#050507" strokeWidth="2" />
              </g>
            </g>
            <rect x="50" y="15" width="140" height="40" fill="url(#eye-lid-shadow)" />
            {/* a fixed reflection: stays put while the iris moves under it */}
            <ellipse cx="110" cy="46" rx="2.6" ry="1.9" fill="#FFFFFF" opacity="0.85" />
            <circle cx="114.5" cy="49" r="0.9" fill="#FFFFFF" opacity="0.7" />
          </g>
        </g>
        </g>
      </svg>
      </div>

      <p className="absolute bottom-2.5 left-7 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
        <span className="searchlight-rec size-1.5 rounded-full bg-purple-light" aria-hidden="true" />
        {/* inverts against the beam, so it stays readable when the light passes over it */}
        <span className="text-white mix-blend-difference">{slogan}</span>
      </p>
    </div>
  )
}

/* Channels on the left feed one agent, which writes everything to one CRM (dark sections) */
export function AgentHub({ agentTitle }: { agentTitle?: string }) {
  const { hub } = DEMOS_PAGE
  return (
    <div className="mt-14 flex flex-col lg:flex-row lg:items-stretch">
      {/* Channels */}
      <div className="lg:w-[38%]">
        <p className="label-white">[{hub.channelsLabel}]</p>
        <ul className="grid grid-cols-2 gap-3 lg:flex lg:flex-col">
          {AGENT_CHANNELS.map((c) => (
            <li key={c.key} className="flex items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3 border border-white/10 bg-white/[0.04] px-4 py-3">
                <HugeiconsIcon icon={c.Icon as never} size={20} color="#C084FC" strokeWidth={1.5} className="shrink-0" />
                <span className="min-w-0">
                  <span className="block font-sans text-[15px] font-medium text-white">{c.label}</span>
                  <span className="hidden truncate font-sans text-[13px] text-white/45 lg:block">{c.short}</span>
                </span>
              </div>
              <span className="hub-line hidden w-10 lg:block xl:w-14" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>

      <span className="hub-line-v my-3 lg:hidden" aria-hidden="true" />

      {/* Agent */}
      <div
        className="flex flex-col justify-center rounded-[16px] border border-purple/50 px-6 py-6 lg:w-[24%] lg:self-center"
        style={{ background: 'linear-gradient(160deg, rgba(109,74,255,0.28) 0%, rgba(109,74,255,0.08) 100%)', boxShadow: '0 0 60px rgba(109,74,255,0.25)' }}
      >
        <SearchlightEye slogan={hub.slogan} />
        <p className="label-white mt-5">[{hub.agentLabel}]</p>
        <p className="h4 text-white">{agentTitle ?? hub.agentTitle}</p>
        <ol className="mt-5 flex flex-col gap-3">
          {hub.agentSteps.map((step, i) => (
            <li key={step} className="flex gap-3 font-sans text-[14px] leading-snug text-white/75">
              <span className="font-mono text-[12px] text-purple-light">0{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <span className="hub-line hidden min-w-10 self-center lg:block lg:flex-1" aria-hidden="true" />
      <span className="hub-line-v my-3 lg:hidden" aria-hidden="true" />

      {/* CRM */}
      <div className="flex flex-col justify-center bg-white px-6 py-6 lg:w-[26%] lg:self-center">
        <HugeiconsIcon icon={Database01Icon} size={28} color="#6D4AFF" strokeWidth={1.5} />
        <p className="label mt-5">[{hub.crmLabel}]</p>
        <ul className="mt-1 flex flex-col">
          {hub.crmFields.map((field) => (
            <li key={field} className="flex items-center gap-3 border-b border-gray-line py-3 font-sans text-[15px] text-ink last:border-b-0">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} color="#10B981" strokeWidth={1.5} />
              {field}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

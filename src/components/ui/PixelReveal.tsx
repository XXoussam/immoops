import { useEffect, useRef, useState, type CSSProperties } from 'react'

const DEFAULT_STEPS = [48, 32, 20, 12, 8, 5, 3, 2]

interface PixelRevealProps {
  src: string
  alt?: string
  /** wrapper box: position / size / filter */
  className?: string
  style?: CSSProperties
  /** applied to the image and the canvas, e.g. objectFit / objectPosition */
  imgStyle?: CSSProperties
  /** block sizes in source pixels, coarse → fine */
  steps?: number[]
  /** ms per step */
  stepMs?: number
  delayMs?: number
  /** start the reveal only once true (e.g. when scrolled into view) */
  active?: boolean
}

/**
 * Image that "builds itself": mosaic of big pixel blocks that sharpens step by step,
 * then hands over to the real <img>. Falls back to a plain fade with reduced motion.
 */
export function PixelReveal({
  src,
  alt = '',
  className = '',
  style,
  imgStyle,
  steps = DEFAULT_STEPS,
  stepMs = 85,
  delayMs = 150,
  active = true,
}: PixelRevealProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'loading' | 'pixelating' | 'done'>('loading')

  useEffect(() => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas || !active) return
    let timer = 0
    let cancelled = false

    const run = () => {
      if (cancelled) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const ctx = canvas.getContext('2d')
      if (reduce || !ctx || !img.naturalWidth) {
        setPhase('done')
        return
      }
      const w = img.naturalWidth
      const h = img.naturalHeight
      canvas.width = w
      canvas.height = h
      const small = document.createElement('canvas')
      const sctx = small.getContext('2d')!

      const draw = (block: number) => {
        const sw = Math.max(1, Math.ceil(w / block))
        const sh = Math.max(1, Math.ceil(h / block))
        small.width = sw
        small.height = sh
        sctx.clearRect(0, 0, sw, sh)
        sctx.drawImage(img, 0, 0, sw, sh)
        ctx.clearRect(0, 0, w, h)
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(small, 0, 0, sw, sh, 0, 0, w, h)
      }

      let i = 0
      const tick = () => {
        if (cancelled) return
        if (i >= steps.length) {
          setPhase('done')
          return
        }
        draw(steps[i++])
        timer = window.setTimeout(tick, stepMs)
      }
      timer = window.setTimeout(() => {
        setPhase('pixelating')
        tick()
      }, delayMs)
    }

    if (img.complete && img.naturalWidth) run()
    else img.addEventListener('load', run, { once: true })

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      img.removeEventListener('load', run)
    }
  }, [src, steps, stepMs, delayMs, active])

  return (
    <div className={className} style={{ position: 'relative', ...style }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        decoding="async"
        fetchPriority="high"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          ...imgStyle,
          opacity: phase === 'done' ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          ...imgStyle,
          opacity: phase === 'pixelating' ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
      />
    </div>
  )
}

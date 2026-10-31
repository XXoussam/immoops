import { useEffect, useRef, type RefObject } from 'react'
import type { VoiceWave } from '../../hooks/useVoiceRecorder'

/*
 * The voice meter while recording: a row of black dots scrolling from right to left that grow
 * into bars when the visitor speaks. Newest loudness enters at the right edge; drawn on a canvas
 * every frame, offset between samples so the scroll is continuous.
 */
const COLOR = '#0F1117' // ink
const STEP = 6 // px from one column to the next
const BAR = 3 // column width; silence is a 3 px dot

export function RecordingWave({ wave, className = '' }: { wave: RefObject<VoiceWave>; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let raf = 0

    const draw = (now: number) => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.clientWidth, h = canvas.clientHeight
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = COLOR

      const { levels, lastAt, interval } = wave.current
      const slide = Math.min(1, (now - lastAt) / interval) // fraction of a step since the last sample
      for (let k = 0; ; k++) {
        const x = w - BAR - (k + slide) * STEP
        if (x < -BAR) break
        const level = levels[levels.length - 1 - k] ?? 0
        const height = Math.max(BAR, Math.min(h, level * h * 1.15))
        const y = (h - height) / 2
        ctx.beginPath()
        if (ctx.roundRect) ctx.roundRect(x, y, BAR, height, BAR / 2)
        else ctx.rect(x, y, BAR, height)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [wave])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // fades out on the left, where the oldest sound leaves
      className={`[mask-image:linear-gradient(to_right,transparent,#000_22%)] ${className}`}
    />
  )
}

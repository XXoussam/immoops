import { useEffect, useRef, useState, useCallback } from 'react'

interface Pixel {
  id: number
  x: number
  y: number
  opacity: number
  age: number
}

const PIXEL_SIZE = 10
const TRAIL_LENGTH = 38
const FADE_SPEED = 0.042

export function PixelCursorTrail() {
  const [pixels, setPixels] = useState<Pixel[]>([])
  const pixelIdRef = useRef(0)
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | undefined>(undefined)

  const createPixel = useCallback((x: number, y: number): Pixel => ({
    id: pixelIdRef.current++,
    x,
    y,
    opacity: 1,
    age: 0,
  }), [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      const dx = x - lastPositionRef.current.x
      const dy = y - lastPositionRef.current.y

      if (Math.sqrt(dx * dx + dy * dy) > PIXEL_SIZE) {
        setPixels(prev => [...prev.slice(-TRAIL_LENGTH), createPixel(x, y)])
        lastPositionRef.current = { x, y }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [createPixel])

  useEffect(() => {
    const animate = () => {
      setPixels(prev =>
        prev
          .map(p => ({ ...p, opacity: p.opacity - FADE_SPEED, age: p.age + 1 }))
          .filter(p => p.opacity > 0)
      )
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current !== undefined) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {pixels.map(pixel => {
        const size = PIXEL_SIZE * Math.max(0.3, 1 - pixel.age / 90)
        return (
          <div
            key={pixel.id}
            className="absolute"
            style={{
              left: pixel.x - size / 2,
              top: pixel.y - size / 2,
              width: size,
              height: size,
              opacity: pixel.opacity,
              background: 'rgba(192, 132, 252, 0.85)',
              boxShadow: '0 0 4px rgba(192,132,252,0.5)',
            }}
          />
        )
      })}
    </div>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'

/** Auto-advancing slideshow state (Galadrim hero): current + previous index, restarts the timer on manual jumps. */
export function useSlideshow(count: number, intervalMs = 5000) {
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const go = useCallback(
    (next: number) => {
      setIndex((cur) => {
        const target = ((next % count) + count) % count
        if (target !== cur) setPrev(cur)
        return target
      })
    },
    [count],
  )

  useEffect(() => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => go(index + 1), intervalMs)
    return () => window.clearTimeout(timer.current)
  }, [index, intervalMs, go])

  return { index, prev, go }
}

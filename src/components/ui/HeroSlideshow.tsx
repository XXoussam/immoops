import type { CSSProperties, MouseEvent } from 'react'
import { PixelReveal } from './PixelReveal'

export interface Slide {
  src: string
  alt: string
  /** CSS object-position, to keep faces in frame */
  position?: string
}

interface SlidesProps {
  slides: Slide[]
  index: number
  prev: number | null
  className?: string
  style?: CSSProperties
}

/** Stacked photos: the active one rises in, the previous one fades out upward. First photo builds itself from pixels. */
export function SlideshowImages({ slides, index, prev, className = '', style }: SlidesProps) {
  return (
    <div className={`overflow-hidden ${className}`} style={style}>
      {slides.map((s, i) => {
        const state = i === index ? 'slide-enter' : i === prev ? 'slide-leave' : 'slide-idle'
        const imgStyle: CSSProperties = { objectFit: 'cover', objectPosition: s.position ?? '50% 35%' }
        return (
          <div key={s.src} className={`absolute inset-0 ${state}`} aria-hidden={i !== index}>
            {i === 0 ? (
              <PixelReveal src={s.src} alt={s.alt} className="absolute inset-0 select-none" style={{ position: 'absolute' }} imgStyle={imgStyle} />
            ) : (
              <img src={s.src} alt={s.alt} decoding="async" draggable={false} className="absolute inset-0 w-full h-full select-none" style={imgStyle} />
            )}
          </div>
        )
      })}
    </div>
  )
}

interface ProgressProps {
  count: number
  index: number
  onSelect: (i: number) => void
  className?: string
}

/** Dashed vertical track; the solid thumb (1/count of the height) marks the active photo. Click to jump. */
export function SlideshowProgress({ count, index, onSelect, className = '' }: ProgressProps) {
  const pick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    onSelect(Math.min(count - 1, Math.floor(((e.clientY - r.top) / r.height) * count)))
  }
  return (
    <button
      type="button"
      aria-label={`Photo ${index + 1} sur ${count}`}
      onClick={pick}
      className={`slide-progress ${className}`}
      style={{ '--slide-index': index, '--slide-count': count } as CSSProperties}
    >
      <span className="slide-progress-thumb" />
    </button>
  )
}

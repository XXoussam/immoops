import { useState, useEffect, useRef } from 'react'
import { BackgroundGradientAnimation } from '../ui/background-gradient-animation'
import { SlideshowImages, SlideshowProgress } from '../ui/HeroSlideshow'
import { useSlideshow } from '../../hooks/useSlideshow'
import { HERO_SLIDES } from '../../lib/constants'

const CYCLING_WORDS = ['vos leads', 'vos relances', 'vos appels', 'vos rendez-vous']
const LH = 1.65

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

function CyclingWord() {
  const [index, setIndex] = useState(0)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [widths, setWidths] = useState<number[]>([])

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % CYCLING_WORDS.length)
    }, 2400)
    return () => clearInterval(id)
  }, [])

  // Measure each word so the box (and the rest of the sentence) follows the current word's width
  useEffect(() => {
    const measure = () => setWidths(wordRefs.current.map(el => el?.offsetWidth ?? 0))
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <span
      aria-live="polite"
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        height: `${LH}em`,
        verticalAlign: 'bottom',
        color: '#C084FC',
        fontStyle: 'italic',
        width: widths[index] ? `${widths[index]}px` : undefined,
        transition: `width 0.55s ${EASE}`,
      }}
    >
      <span
        style={{
          display: 'block',
          transform: `translateY(-${index * LH}em)`,
          transition: `transform 0.55s ${EASE}`,
        }}
      >
        {CYCLING_WORDS.map((word, i) => (
          <span key={i} style={{ display: 'block', height: `${LH}em`, lineHeight: LH }}>
            {/* inline-block so offsetWidth is the word's own width; small right pad for the italic overhang */}
            <span
              ref={el => { wordRefs.current[i] = el }}
              style={{ display: 'inline-block', whiteSpace: 'nowrap', paddingRight: '0.02em' }}
            >
              {word}
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const slideshow = useSlideshow(HERO_SLIDES.length)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.add('visible')
  }, [])

  return (
    <section id="hero">
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(6, 3, 18)"
        gradientBackgroundEnd="rgb(16, 7, 48)"
        firstColor="109, 74, 255"
        secondColor="139, 92, 246"
        thirdColor="192, 132, 252"
        fourthColor="55, 45, 190"
        fifthColor="124, 58, 237"
        pointerColor="140, 100, 255"
      >
        <div ref={ref} className="reveal absolute inset-0 z-10 pt-16">
          {/* Galadrim layout: the frame column split in two equal halves under the navbar */}
          <div className="h-full mx-auto grid grid-cols-1 lg:grid-cols-2" style={{ width: 'var(--fw)' }}>

            {/* Left half — centred text */}
            <div className="relative h-full flex flex-col items-center justify-center text-center" style={{ padding: '0 var(--frame-pad) 2rem' }}>

              {/* Divider between the halves = slideshow progress (solid thumb marks the active photo) */}
              <SlideshowProgress
                className="hidden lg:block"
                count={HERO_SLIDES.length}
                index={slideshow.index}
                onSelect={slideshow.go}
              />

              <span className="label-white mb-6">Agents IA pour l'immobilier</span>

              {/* Headline */}
              <h1
                className="font-tight mb-6"
                style={{
                  fontSize: 'clamp(2.25rem, min(3.6vw, 6.4vh), 3.75rem)',
                  fontWeight: 500,
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                  color: '#ffffff',
                }}
              >
                <span className="hero-word-ia">L'IA</span> ne remplace pas vos agents.{' '}
                Elle leur donne des{' '}
                <span className="hero-word-shimmer" style={{ whiteSpace: 'nowrap' }}>super-pouvoirs.</span>
              </h1>

              {/* Subtitle with slot-machine cycling word */}
              <p
                className="font-sans mb-10"
                style={{
                  fontSize: '1.15rem',
                  lineHeight: LH,
                  color: 'rgba(255,255,255,0.62)',
                  maxWidth: '400px',
                  letterSpacing: '-0.01em',
                }}
              >
                Automatisez <CyclingWord />, déployés en 48h dans votre agence, sur mesure.
              </p>

              {/* CTAs — stacked, like Galadrim */}
              <div className="flex flex-col items-center gap-3">
                <a href="#contact" className="btn-primary">↪ Demander un audit gratuit</a>
                <a href="#demos" className="btn-outline-white">↪ Voir les démos</a>
              </div>
            </div>

            {/* Right half — photo slideshow (first photo builds itself from pixel blocks) */}
            <div className="hidden lg:block relative h-full">
              {/* Square frame with corner marks; gap from the divider and from the right rail */}
              <div className="card-dark absolute" style={{ inset: '8px 40px 8px 48px' }}>
                <SlideshowImages
                  slides={HERO_SLIDES}
                  index={slideshow.index}
                  prev={slideshow.prev}
                  className="absolute"
                  style={{ inset: 10 }}
                />
              </div>
            </div>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </section>
  )
}

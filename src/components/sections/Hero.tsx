import { useState, useEffect, useRef } from 'react'
import { BackgroundGradientAnimation } from '../ui/background-gradient-animation'

const CYCLING_WORDS = ['vos leads', 'vos relances', 'vos appels', 'vos rendez-vous']
const LH = 1.65

function CyclingWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % CYCLING_WORDS.length)
    }, 2400)
    return () => clearInterval(id)
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
      }}
    >
      <span
        style={{
          display: 'block',
          transform: `translateY(-${index * LH}em)`,
          transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {CYCLING_WORDS.map((word, i) => (
          <span key={i} style={{ display: 'block', height: `${LH}em`, lineHeight: LH }}>
            {word}
          </span>
        ))}
      </span>
    </span>
  )
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)

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
        <div ref={ref} className="reveal absolute inset-0 z-10">

          {/* Right-side violet atmosphere */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 55% 75% at 84% 58%, rgba(109,74,255,0.32) 0%, transparent 65%)',
            }}
          />

          {/* Robot */}
          <img
            src="/robot_transparent_v2.png"
            alt=""
            className="hidden lg:block absolute pointer-events-none select-none"
            style={{
              height: '114%',
              width: 'auto',
              right: '-0.5%',
              bottom: '-14%',
              zIndex: 2,
              filter: 'drop-shadow(-28px 0 80px rgba(109,74,255,0.55)) drop-shadow(0 0 40px rgba(192,132,252,0.22))',
            }}
            draggable={false}
          />

          {/* Text content */}
          <div className="relative z-10 h-full flex items-center pt-20">
            <div className="w-full max-w-[1200px] mx-auto px-5 md:px-8">
              <div className="flex flex-col items-center lg:items-start w-full lg:w-[56%] pb-20 lg:pb-8">

                {/* Headline */}
                <h1
                  className="font-tight text-center lg:text-left mb-7"
                  style={{
                    fontSize: 'clamp(2.75rem, 5vw, 5.5rem)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    color: '#ffffff',
                  }}
                >
                  <span className="hero-word-ia">L'IA</span> ne remplace pas vos agents.<br />
                  Elle leur donne des{' '}
                  <span className="hero-word-shimmer" style={{ whiteSpace: 'nowrap' }}>super-pouvoirs.</span>
                </h1>

                {/* Subtitle with slot-machine cycling word */}
                <p
                  className="font-sans text-center lg:text-left mb-11"
                  style={{
                    fontSize: '1.2rem',
                    lineHeight: LH,
                    color: 'rgba(255,255,255,0.62)',
                    maxWidth: '420px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Automatisez <CyclingWord /> — déployés en 48h dans votre agence, sur mesure.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3">
                  <a href="#contact" className="btn-primary">Demander un audit gratuit</a>
                  <a href="#demos" className="btn-outline-white">Voir les démos</a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </BackgroundGradientAnimation>
    </section>
  )
}

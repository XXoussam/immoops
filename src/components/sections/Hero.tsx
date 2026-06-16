import { useEffect, useRef } from 'react'
import { BackgroundGradientAnimation } from '../ui/background-gradient-animation'

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
        gradientBackgroundStart="rgb(15, 11, 36)"
        gradientBackgroundEnd="rgb(31, 16, 80)"
        firstColor="109, 74, 255"
        secondColor="139, 92, 246"
        thirdColor="192, 132, 252"
        fourthColor="79, 70, 229"
        fifthColor="124, 58, 237"
        pointerColor="140, 100, 255"
      >
        <div
          ref={ref}
          className="reveal absolute inset-0 z-10 flex justify-center"
        >
          <div className="w-full max-w-[1200px] px-5 md:px-8 flex h-full items-center pt-20">

            {/* Left: text + CTAs */}
            <div className="flex-1 flex flex-col items-center lg:items-start justify-center pb-20 lg:max-w-[560px] lg:pr-8">
              <h1 className="h1-white text-center lg:text-left mb-6">
                L'IA qui transforme<br />votre agence
              </h1>
              <p className="body1-white max-w-[460px] mb-10 text-center lg:text-left">
                Chatbots, agents vocaux et qualification de leads, intégrés directement dans vos workflows.
              </p>
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3">
                <a href="#contact" className="btn-primary">Demander un audit gratuit</a>
                <a href="#demos" className="btn-outline-white">Voir les démos</a>
              </div>
            </div>

            {/* Right: robot */}
            <div className="hidden lg:flex flex-1 h-full items-end justify-center overflow-hidden">
              <img
                src="/robot_transparent_v2.png"
                alt=""
                style={{ height: '88%', width: 'auto' }}
                draggable={false}
                className="pointer-events-none select-none"
              />
            </div>

          </div>
        </div>
      </BackgroundGradientAnimation>
    </section>
  )
}

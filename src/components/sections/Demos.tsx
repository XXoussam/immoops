import { DEMOS } from '../../lib/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { SectionHeader } from '../ui/SectionHeader'
import { PixelReveal } from '../ui/PixelReveal'

export function Demos() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="demos" className="section bg-purple-dark">
      <div
        ref={ref}
        className={`container-main transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-12 lg:gap-8">
        <div>
        <SectionHeader
          dark
          stacked
          label="Démos interactives"
          title="Essayez par vous-même"
          description="Pas de formulaire, pas d'inscription. Choisissez un scénario et voyez l'IA en action."
        />

        {/* Demo cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {DEMOS.map((demo) => (
            <a
              key={demo.title}
              href="/demos"
              className="card-dark block group"
              style={{ textDecoration: 'none' }}
            >
              <div className="p-7">
                {/* Channel badge */}
                <span
                  className="tag mb-5"
                  style={{
                    background: 'rgba(109,74,255,0.2)',
                    color: '#C084FC',
                    border: '1px solid rgba(109,74,255,0.35)',
                  }}
                >
                  {demo.channel}
                </span>

                {/* Title */}
                <p
                  className="font-tight mb-3"
                  style={{ fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.3, color: '#fafafb' }}
                >
                  {demo.title}
                </p>

                {/* Description */}
                <p
                  className="font-sans text-sm leading-relaxed mb-6"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {demo.description}
                </p>

                {/* CTA text */}
                <span
                  className="font-sans text-sm font-medium transition-colors duration-200"
                  style={{ color: '#C084FC' }}
                >
                  Essayer la démo
                </span>
              </div>
            </a>
          ))}
        </div>
        </div>

        {/* The AI agent — builds itself from pixel blocks when the section scrolls into view */}
        <div className="hidden lg:flex relative items-end justify-center -mb-24 md:-mb-28">
          <div
            className="absolute pointer-events-none"
            style={{
              inset: '6% -10% 22% -10%',
              background: 'radial-gradient(ellipse 60% 55% at 50% 55%, rgba(109,74,255,0.35) 0%, transparent 70%)',
            }}
          />
          <PixelReveal
            src="/robot-hero.webp"
            active={isVisible}
            className="relative pointer-events-none select-none"
            imgStyle={{
              height: 'auto',
              /* soft fade at the bottom instead of a hard cut; on the image itself so the glow isn't clipped */
              WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent 88%)',
              maskImage: 'linear-gradient(to bottom, #000 55%, transparent 88%)',
            }}
            style={{
              width: '100%',
              maxWidth: 460,
              filter: 'drop-shadow(-24px 0 60px rgba(109,74,255,0.5)) drop-shadow(0 0 30px rgba(192,132,252,0.2))',
            }}
          />
        </div>
        </div>
      </div>
    </section>
  )
}

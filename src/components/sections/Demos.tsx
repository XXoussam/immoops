import { DEMOS } from '../../lib/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function Demos() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="demos" className="section bg-purple-dark">
      <div
        ref={ref}
        className={`container-main transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        {/* Header */}
        <div className="text-center mb-14">
          <span className="label-white">Démos interactives</span>
          <h2 className="h2-white mb-4">
            Essayez par vous-même
          </h2>
          <p className="body1-white mx-auto" style={{ maxWidth: 480 }}>
            Pas de formulaire, pas d'inscription. Choisissez un scénario et voyez l'IA en action.
          </p>
        </div>

        {/* Demo cards — 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {DEMOS.map((demo) => (
            <a
              key={demo.title}
              href={demo.href}
              className="card-dark block group"
              style={{ textDecoration: 'none' }}
            >
              <div className="p-7">
                {/* Channel badge */}
                <span
                  className="inline-block font-sans text-xs font-medium px-3 py-1 rounded-pill mb-5"
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
    </section>
  )
}

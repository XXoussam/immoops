import { HugeiconsIcon } from '@hugeicons/react'
import { SERVICES } from '../../lib/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function Services() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section id="services" className="section bg-white">
      <div
        ref={ref}
        className={`container-main transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        <div className="text-center mb-14">
          <span className="label">Solutions IA sur mesure</span>
          <h2 className="h2 mb-5">
            Des solutions IA taillées<br />pour l'immobilier
          </h2>
          <p className="body2 mx-auto" style={{ maxWidth: 560 }}>
            Chaque service est conçu pour réduire vos tâches répétitives et vous permettre
            de vous concentrer sur ce qui compte vraiment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            return (
              <div
                key={i}
                className="card-white p-7 hover:shadow-card2 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 bg-purple-pale">
                  <HugeiconsIcon icon={s.Icon as never} size={20} color="#6D4AFF" strokeWidth={1.5} />
                </div>
                <h3 className="h4 mb-2.5">
                  {s.title}
                </h3>
                <p className="body2 mb-5">
                  {s.description}
                </p>
                <span className="text-sm text-purple group-hover:text-purple-hover font-medium transition-colors">
                  En savoir plus
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

import { DEMOS_PAGE } from '../../lib/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function DemosHero() {
  const { ref, isVisible } = useScrollReveal()
  const { hero } = DEMOS_PAGE

  return (
    <section className="bg-purple-dark pb-20 pt-32 md:pt-40">
      <div
        ref={ref}
        className={`container-main transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:items-end lg:gap-16">
          <div>
            <span className="label-white">[{hero.label}]</span>
            <h1 className="h2-white">{hero.title}</h1>
          </div>
          <p className="body2 lg:pb-2 lg:text-right" style={{ color: 'rgba(255,255,255,0.6)' }}>{hero.description}</p>
        </div>
      </div>
    </section>
  )
}

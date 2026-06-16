import { HOW_IT_WORKS_STEPS } from '../../lib/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function HowItWorks() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section id="fonctionnement" className="section" style={{ background: '#fafafb' }}>
      <div
        ref={ref}
        className={`container-main transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        <div className="text-center mb-14">
          <span className="label-muted">De l'audit à l'automatisation</span>
          <h2 className="h2 mb-5">
            Automatiser pour une meilleure<br />efficacité opérationnelle
          </h2>
          <p className="body2 mx-auto" style={{ maxWidth: 560 }}>
            L'automatisation rationalise vos workflows, réduit les coûts et élimine les inefficacités.
          </p>
        </div>

        {/* Video placeholder */}
        <div
          className="relative w-full overflow-hidden mb-12 bg-purple-dark rounded-card"
          style={{ aspectRatio: '16 / 9', border: '1px solid rgba(109,74,255,0.2)' }}
        >
          {/* Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(109,74,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(109,74,255,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Glow */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(109,74,255,0.18) 0%, transparent 70%)' }}
          />
        </div>

        {/* 4 steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {HOW_IT_WORKS_STEPS.map(step => (
            <div key={step.number}>
              <span
                className="font-tight block mb-3 text-[3rem] leading-none"
                style={{ fontWeight: 700, color: '#e0e2e5', letterSpacing: '-0.04em' }}
              >
                {step.number}
              </span>
              <h4 className="h4 mb-2">
                {step.title}
              </h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

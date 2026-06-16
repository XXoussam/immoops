import { useScrollReveal } from '../../hooks/useScrollReveal'

export function ValueProp() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="section" style={{ background: '#eeeffe' }}>
      <div className="container-main">
        <div
          ref={ref}
          className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          <p className="h2">
            <span
              style={{
                background: 'linear-gradient(90deg, #7638fa 0%, #a78bfa 55%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              L'IA qui automatise
            </span>{' '}
            vos workflows, qualifie vos leads et répond à vos clients
            pendant que vous vous concentrez sur la vente.
          </p>
        </div>
      </div>
    </section>
  )
}

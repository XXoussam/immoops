import { HugeiconsIcon } from '@hugeicons/react'
import { SMART_OPS } from '../../lib/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { SectionHeader } from '../ui/SectionHeader'

export function SmartOps() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="section bg-purple-dark">
      <div
        ref={ref}
        className={`container-main transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        {/* Header */}
        <SectionHeader
          dark
          className="mb-16"
          label="Excellence pilotée par l'IA"
          title={<>Des opérations plus intelligentes,<br />propulsées par l'IA</>}
          description="Révolutionnez vos workflows, améliorez la communication et délivrez des résultats exceptionnels."
        />

        {/* Divider grid — EliseAI style */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          {SMART_OPS.map((item, i) => {
            const isRight = i % 2 === 1
            return (
              <div
                key={item.title}
                className="py-14 sm:py-16"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  borderLeft: isRight ? '1px solid rgba(255,255,255,0.1)' : undefined,
                  paddingLeft: isRight ? '3.5rem' : '0',
                  paddingRight: isRight ? '0' : '3.5rem',
                }}
              >
                <div className="mb-7">
                  <HugeiconsIcon icon={item.Icon as never} size={30} color="#ad88fc" strokeWidth={1} />
                </div>
                <h4 className="h4 mb-3" style={{ color: '#fafafb' }}>
                  {item.title}
                </h4>
                <p className="body2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

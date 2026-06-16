import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ChevronLeftIcon, ChevronRightIcon, Building02Icon } from '@hugeicons/core-free-icons'
import { TESTIMONIALS } from '../../lib/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function Testimonial() {
  const [active, setActive] = useState(0)
  const { ref, isVisible } = useScrollReveal()
  const prev = () => setActive(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setActive(i => (i + 1) % TESTIMONIALS.length)
  const t = TESTIMONIALS[active]

  return (
    <section className="section-sm relative overflow-hidden bg-purple-dark">
      <div
        ref={ref}
        className={`container-main transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        {/* Card wrapper with arrows outside */}
        <div className="relative flex items-center gap-4">

          {/* Arrow — left */}
          <button
            onClick={prev}
            className="flex-shrink-0 flex items-center justify-center rounded-full transition-colors duration-200"
            style={{
              width: 44, height: 44,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.13)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          >
            <HugeiconsIcon icon={ChevronLeftIcon} size={18} color="rgba(255,255,255,0.7)" strokeWidth={1.5} />
          </button>

          {/* Card */}
          <div className="card-dark flex-1 text-center px-10 py-14 md:px-16 md:py-16">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <HugeiconsIcon icon={Building02Icon} size={20} color="rgba(255,255,255,0.75)" strokeWidth={1.5} />
              <span
                className="font-tight text-white"
                style={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.01em' }}
              >
                {t.logo}
              </span>
            </div>

            {/* Quote */}
            <blockquote
              className="font-tight text-white mb-8"
              style={{
                fontWeight: 450,
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                maxWidth: 780,
                margin: '0 auto 2rem',
              }}
            >
              {t.quote}
            </blockquote>

            {/* Attribution */}
            <p className="font-sans text-white mb-1" style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
              {t.name}
            </p>
            <p className="font-sans" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)' }}>
              {t.role}
            </p>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? 22 : 7,
                    height: 7,
                    background: i === active ? '#6D4AFF' : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Arrow — right */}
          <button
            onClick={next}
            className="flex-shrink-0 flex items-center justify-center rounded-full transition-colors duration-200"
            style={{
              width: 44, height: 44,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.13)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          >
            <HugeiconsIcon icon={ChevronRightIcon} size={18} color="rgba(255,255,255,0.7)" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  )
}

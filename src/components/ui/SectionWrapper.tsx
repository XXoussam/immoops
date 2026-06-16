import type { ReactNode } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface SectionWrapperProps {
  id?: string
  children: ReactNode
  className?: string
}

export function SectionWrapper({ id, children, className = '' }: SectionWrapperProps) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id={id} className={`section ${className}`}>
      <div
        ref={ref}
        className={`container-main transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {children}
      </div>
    </section>
  )
}

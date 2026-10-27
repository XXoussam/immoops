import { useEffect, useRef } from 'react'
import { DEMOS_PAGE } from '../../lib/constants'
import { SectionWrapper } from '../ui/SectionWrapper'
import { SectionHeader } from '../ui/SectionHeader'

/* CloudPano 360° tour, injected by its share script */
export function VirtualTour() {
  const copy = DEMOS_PAGE.tour
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.setAttribute('data-short', 'MMqLrAhy2oN')
    script.setAttribute('data-path', 'tours')
    script.setAttribute('data-is-self-hosted', 'false')
    script.src = 'https://app.cloudpano.com/public/shareScript.js'
    el.appendChild(script)
    return () => { el.innerHTML = '' }
  }, [])

  return (
    <SectionWrapper id="visite-360" className="bg-purple-dark">
      <SectionHeader dark label={copy.label} title={copy.title} description={copy.description} />
      <div
        id="MMqLrAhy2oN"
        ref={containerRef}
        className="w-full overflow-hidden border border-white/10"
        style={{ height: 500, boxShadow: '0 8px 64px rgba(0,0,0,0.45)' }}
      />
    </SectionWrapper>
  )
}

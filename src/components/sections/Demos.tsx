import { HOME_CAMILLE } from '../../lib/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { SectionHeader } from '../ui/SectionHeader'
import { AgentHub } from './AgentHub'

/* Camille across every channel: the same channels → agent → CRM diagram as /demos */
export function Demos() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="demos" className="section bg-purple-dark">
      {/* the agent, large and faint behind the content; clipped here, not on the section, so the seam marks stay visible */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          src="/robot-hero.webp"
          alt=""
          className={`home-camille-bg select-none transition-opacity duration-1000 ${isVisible ? 'is-visible' : ''}`}
        />
      </div>

      <div
        ref={ref}
        className={`container-main relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        <SectionHeader dark label={HOME_CAMILLE.label} title={HOME_CAMILLE.title} description={HOME_CAMILLE.description} className="mb-0" />

        <AgentHub agentTitle={HOME_CAMILLE.label} />

        <a href="/demos" className="btn-outline-white mt-10">
          {HOME_CAMILLE.link}
        </a>
      </div>
    </section>
  )
}

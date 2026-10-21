import { useScrollReveal } from '../../hooks/useScrollReveal'

export function About() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section id="a-propos" className="section bg-white">
      <div
        ref={ref}
        className={`container-main transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 lg:gap-16">
          <div>
            <span className="label">[À propos]</span>
            <h2 className="h2">
              Votre partenaire IA<br />en immobilier
            </h2>
          </div>
          {/* Text */}
          <div className="lg:pt-8">
            <p className="body1 mb-4">
              ImmoOps AI conçoit et déploie des agents IA dédiés aux agences immobilières.
              Réponse aux prospects, relances, qualification, prise de rendez-vous : nous automatisons
              les tâches répétitives pour que vos équipes se consacrent aux mandats, aux visites
              et à la relation client.
            </p>
            <p className="body1 mb-8">
              De l'audit de vos processus à l'intégration dans vos outils, nous pilotons chaque projet
              de bout en bout. Chaque solution est construite sur mesure, suivie sur des indicateurs
              concrets et optimisée après la mise en production.
            </p>

            {/* Quote */}
            <blockquote
              className="mb-8 pl-5 italic"
              style={{ borderLeft: '2px solid #6D4AFF' }}
            >
              <p className="font-tight text-ink text-base" style={{ fontWeight: 450 }}>
                "L'IA ne remplace pas vos agents, elle leur donne des super-pouvoirs."
              </p>
            </blockquote>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {['Expertise terrain', 'Solutions sur-mesure', 'Résultats mesurables'].map(tag => (
                <span
                  key={tag}
                  className="tag bg-purple-pale text-purple"
                  style={{ border: '1px solid rgba(109,74,255,0.2)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

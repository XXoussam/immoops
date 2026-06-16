import { useScrollReveal } from '../../hooks/useScrollReveal'

export function About() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section id="a-propos" className="section bg-white">
      <div
        ref={ref}
        className={`container-main transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        <div className="max-w-2xl mx-auto">
          {/* Text */}
          <div>
            <span className="label">À propos</span>
            <h2 className="h2 mb-5">
              Votre partenaire IA<br />en immobilier
            </h2>
            <p className="body1 mb-4">
              Je suis consultant spécialisé en intelligence artificielle pour les agences immobilières.
              Mon objectif : vous faire gagner du temps sur les tâches répétitives pour que vous
              puissiez vous concentrer sur ce qui compte : conclure des ventes et satisfaire vos clients.
            </p>
            <p className="body1 mb-8">
              De l'automatisation des workflows à la mise en place d'agents vocaux, j'interviens
              de bout en bout pour livrer des solutions concrètes, mesurables et adaptées à votre réalité terrain.
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
                  className="text-xs font-sans px-3 py-1.5 rounded-pill bg-purple-pale text-purple"
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

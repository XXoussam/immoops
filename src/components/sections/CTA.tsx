import { useScrollReveal } from '../../hooks/useScrollReveal'

export function CTA() {
  const { ref, isVisible } = useScrollReveal()
  const mailto = `mailto:saoudioussama13@gmail.com?subject=Prise de contact — ImmoOps AI&body=Bonjour,%0A%0AJe souhaite en savoir plus sur vos services IA pour mon agence immobilière.%0A%0ACordialement`

  return (
    <section id="contact" className="section-sm bg-gray-bg border-t border-gray-line">
      <div
        ref={ref}
        className={`container-main transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left card — secondary: explore demos */}
          <div className="card-white p-8 md:p-10">
            <h3 className="h3 mb-3">
              Pas encore convaincu ?
            </h3>
            <p className="body2 mb-7">
              Essayez nos démos interactives — sans formulaire, sans inscription.
              Voyez l'IA en action avant de prendre contact.
            </p>
            <a href="#demos" className="btn-outline">
              Explorer les démos
            </a>
          </div>

          {/* Right card — primary: book audit */}
          <div
            className="rounded-card p-8 md:p-10"
            style={{ background: 'linear-gradient(135deg, #6D4AFF 0%, #8B5CF6 50%, #C084FC 100%)' }}
          >
            <h3 className="h3 mb-3" style={{ color: 'white' }}>
              Prêt à commencer ?
            </h3>
            <p className="body2 mb-7" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Réservez un audit gratuit de 30 minutes. On cartographie vos
              processus et identifie ce que l'IA peut automatiser dès maintenant.
            </p>
            <a href={mailto} className="btn-primary-dark">
              Demander l'audit gratuit
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

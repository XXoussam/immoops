import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

const CASES = [
  {
    logo: 'Agence indépendante',
    location: 'Paris',
    tag: 'Agent vocal IA',
    tagColor: '#6D4AFF',
    challenge: 'L\'agence recevait plus de 80 appels entrants par semaine, dont 60 % en dehors des heures d\'ouverture. Les agents passaient 30 % de leur temps à répondre à des questions répétitives au lieu de se concentrer sur les mandats.',
    solution: 'Déploiement d\'un agent vocal IA disponible 24h/24, capable de qualifier les acheteurs et vendeurs, répondre aux questions courantes et planifier des rappels.',
    results: [
      { metric: '+340 %', label: 'de leads qualifiés' },
      { metric: '–65 %', label: 'de temps admin' },
      { metric: '24/7', label: 'disponibilité' },
    ],
  },
  {
    logo: 'Réseau de 3 agences',
    location: 'Bordeaux',
    tag: 'Chatbot IA + Automatisation',
    tagColor: '#10B981',
    challenge: 'Le taux de réponse aux demandes entrantes via le site web était de 45 % avec un délai moyen de 4h. Les prospects perdus représentaient un manque à gagner estimé à 60 k€ par an.',
    solution: 'Intégration d\'un chatbot IA sur le site de l\'agence avec qualification automatique, envoi de fiches de biens personnalisées et prise de rendez-vous en temps réel.',
    results: [
      { metric: '< 30s', label: 'délai de réponse' },
      { metric: '+180 %', label: 'de visites planifiées' },
      { metric: '3 mois', label: 'pour rentabiliser' },
    ],
  },
  {
    logo: 'Agence 6 collaborateurs',
    location: 'Lyon',
    tag: 'Workflow IA complet',
    tagColor: '#60A5FA',
    challenge: 'Gestion manuelle des relances, des estimations et du suivi post-visite. L\'équipe de 6 agents perdait en moyenne 2h par jour en tâches administratives répétitives.',
    solution: 'Mise en place d\'un workflow IA complet : qualification entrante, relances automatiques personnalisées, génération de comptes-rendus de visite et alertes nouveaux mandats.',
    results: [
      { metric: '–12h', label: 'admin / semaine / agent' },
      { metric: '+55 %', label: 'taux de conversion' },
      { metric: '48h', label: 'de déploiement' },
    ],
  },
]

export function EtudesDeCasPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-16 px-5" style={{ background: 'linear-gradient(180deg, #F7F5FF 0%, #ffffff 100%)' }}>
          <div className="w-full max-w-[1100px] mx-auto text-center">
            <span className="label mb-4 block">Ressources</span>
            <h1 className="h2 mb-5">Études de cas</h1>
            <p className="body1 text-ink-body mx-auto" style={{ maxWidth: 540 }}>
              Des résultats concrets. Des agences réelles. Voyez comment ImmoOps AI transforme le quotidien des professionnels de l'immobilier.
            </p>
          </div>
        </section>

        {/* Cases */}
        <section className="pb-24 px-5">
          <div className="w-full max-w-[900px] mx-auto flex flex-col gap-16">
            {CASES.map((c, i) => (
              <article key={c.logo} className="card-white overflow-hidden">
                {/* Header */}
                <div className="p-8 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="font-tight font-semibold text-ink" style={{ fontSize: '1.15rem' }}>{c.logo}</p>
                    <p className="text-sm text-ink-body font-sans mt-0.5">{c.location}</p>
                  </div>
                  <span
                    className="self-start sm:self-auto text-xs font-sans font-medium px-3 py-1.5 rounded-pill"
                    style={{
                      background: `${c.tagColor}18`,
                      color: c.tagColor,
                      border: `1px solid ${c.tagColor}30`,
                    }}
                  >
                    {c.tag}
                  </span>
                </div>

                {/* Results bar */}
                <div
                  className="mx-8 rounded-2xl p-6 mb-8 grid grid-cols-3 gap-4 text-center"
                  style={{ background: 'linear-gradient(135deg, #F7F5FF 0%, #EDE9FF 100%)', border: '1px solid rgba(109,74,255,0.10)' }}
                >
                  {c.results.map(r => (
                    <div key={r.label}>
                      <p className="font-tight font-bold text-purple" style={{ fontSize: '1.75rem', lineHeight: 1 }}>{r.metric}</p>
                      <p className="text-xs text-ink-body font-sans mt-1">{r.label}</p>
                    </div>
                  ))}
                </div>

                <div className="px-8 pb-8 grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-tight font-semibold mb-2" style={{ fontSize: '0.85rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9090b0' }}>Problématique</h3>
                    <p className="text-sm text-ink-body leading-relaxed mb-6">{c.challenge}</p>
                  </div>
                  <div>
                    <h3 className="font-tight font-semibold mb-2" style={{ fontSize: '0.85rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9090b0' }}>Solution déployée</h3>
                    <p className="text-sm text-ink-body leading-relaxed">{c.solution}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 px-5">
          <div
            className="w-full max-w-[700px] mx-auto text-center rounded-2xl p-12"
            style={{ background: 'linear-gradient(135deg, #F7F5FF 0%, #EDE9FF 100%)', border: '1px solid rgba(109,74,255,0.12)' }}
          >
            <h2 className="h3 mb-3">Votre agence, prochaine étude de cas ?</h2>
            <p className="body2 text-ink-body mb-8">
              Obtenez un audit gratuit et découvrez quel potentiel l'IA peut débloquer pour vous.
            </p>
            <a href="mailto:saoudioussama13@gmail.com" className="btn-primary">
              Demander un audit gratuit
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

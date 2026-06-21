import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

const POSTS = [
  {
    category: 'Intelligence artificielle',
    date: '12 juin 2025',
    title: 'Comment les agents vocaux IA transforment la relation client en immobilier',
    excerpt: 'Les agences immobilières qui adoptent les agents vocaux IA constatent une disponibilité 24h/24 et une réduction de 60 % du temps passé à qualifier les prospects entrants. Voici comment ça fonctionne.',
    readTime: '5 min',
  },
  {
    category: 'Automatisation',
    date: '3 juin 2025',
    title: 'Automatiser la qualification de leads : le guide complet pour les agences',
    excerpt: 'Un prospect non rappelé dans les 5 minutes a 10 fois moins de chances de convertir. Découvrez comment automatiser ce premier contact sans perdre en qualité relationnelle.',
    readTime: '7 min',
  },
  {
    category: 'Cas d\'usage',
    date: '24 mai 2025',
    title: 'Chatbot IA sur votre site d\'agence : ce que vos concurrents font déjà',
    excerpt: 'Les chatbots immobiliers ne se limitent plus à répondre aux FAQ. Ils qualifient, planifient des visites et relancent automatiquement — même le dimanche soir.',
    readTime: '4 min',
  },
  {
    category: 'Stratégie',
    date: '15 mai 2025',
    title: 'ROI de l\'IA en agence immobilière : les chiffres réels',
    excerpt: 'Nos clients constatent en moyenne un retour sur investissement en moins de 3 mois. Nous détaillons ici les économies réelles sur les coûts de prospection et de gestion administrative.',
    readTime: '6 min',
  },
  {
    category: 'Intelligence artificielle',
    date: '6 mai 2025',
    title: 'GPT-4 vs agents spécialisés : pourquoi les LLMs génériques ne suffisent pas en immobilier',
    excerpt: 'Un modèle généraliste ne connaît pas votre portefeuille, vos mandats ni vos processus internes. Voici pourquoi les agents IA spécialisés surpassent les chatbots grand public.',
    readTime: '8 min',
  },
  {
    category: 'Automatisation',
    date: '28 avril 2025',
    title: 'Relances automatiques : comment ne plus jamais perdre un mandat par manque de suivi',
    excerpt: '80 % des ventes nécessitent au moins 5 points de contact. Pourtant, la plupart des agents abandonnent après 2. L\'automatisation intelligente comble ce fossé.',
    readTime: '5 min',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Intelligence artificielle': '#6D4AFF',
  'Automatisation': '#10B981',
  'Cas d\'usage': '#60A5FA',
  'Stratégie': '#F59E0B',
}

export function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-16 px-5" style={{ background: 'linear-gradient(180deg, #F7F5FF 0%, #ffffff 100%)' }}>
          <div className="w-full max-w-[1100px] mx-auto text-center">
            <span className="label mb-4 block">Ressources</span>
            <h1 className="h2 mb-5">Blog ImmoOps</h1>
            <p className="body1 text-ink-body mx-auto" style={{ maxWidth: 520 }}>
              Stratégies, cas d'usage et actualités IA pour les professionnels de l'immobilier.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="pb-24 px-5">
          <div className="w-full max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POSTS.map((post) => (
              <article key={post.title} className="card-white flex flex-col group cursor-pointer">
                {/* Category + date */}
                <div className="p-7 pb-0 flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-sans font-medium px-3 py-1 rounded-pill"
                    style={{
                      background: `${CATEGORY_COLORS[post.category] ?? '#6D4AFF'}18`,
                      color: CATEGORY_COLORS[post.category] ?? '#6D4AFF',
                      border: `1px solid ${CATEGORY_COLORS[post.category] ?? '#6D4AFF'}30`,
                    }}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-ink-body font-sans">{post.readTime} de lecture</span>
                </div>

                <div className="p-7 pt-3 flex flex-col flex-1">
                  <h2
                    className="font-tight mb-3 group-hover:text-purple transition-colors duration-200"
                    style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4, color: '#0F1117' }}
                  >
                    {post.title}
                  </h2>
                  <p className="text-sm text-ink-body leading-relaxed flex-1 mb-5">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-line">
                    <span className="text-xs text-ink-body font-sans">{post.date}</span>
                    <span className="text-sm font-medium text-purple group-hover:text-purple-hover transition-colors">
                      Lire l'article →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="pb-24 px-5">
          <div
            className="w-full max-w-[700px] mx-auto text-center rounded-2xl p-12"
            style={{ background: 'linear-gradient(135deg, #F7F5FF 0%, #EDE9FF 100%)', border: '1px solid rgba(109,74,255,0.12)' }}
          >
            <h2 className="h3 mb-3">Restez informé</h2>
            <p className="body2 text-ink-body mb-8">
              Recevez nos derniers articles et conseils directement dans votre boîte mail.
            </p>
            <a href="mailto:saoudioussama13@gmail.com" className="btn-primary">
              S'abonner à la newsletter
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

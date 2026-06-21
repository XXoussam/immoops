import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ARTICLES } from '../lib/articles'
import { CAL_URL } from '../lib/constants'

const CATEGORY_COLORS: Record<string, string> = {
  'Intelligence artificielle': '#6D4AFF',
  'Automatisation': '#10B981',
  "Cas d'usage": '#60A5FA',
  'Stratégie': '#F59E0B',
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const article = ARTICLES.find(a => a.slug === slug)

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="bg-white min-h-screen pt-32 pb-24 px-5 text-center">
          <h1 className="h3 mb-4">Article introuvable</h1>
          <button onClick={() => navigate('/blog')} className="btn-primary">Retour au blog</button>
        </main>
        <Footer />
      </>
    )
  }

  const color = CATEGORY_COLORS[article.category] ?? '#6D4AFF'

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-12 px-5" style={{ background: 'linear-gradient(180deg, #F7F5FF 0%, #ffffff 100%)' }}>
          <div className="w-full max-w-[720px] mx-auto">
            <button
              onClick={() => navigate('/blog')}
              className="text-sm font-sans mb-8 inline-flex items-center gap-1 transition-colors"
              style={{ color: '#9090b0' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#6D4AFF')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9090b0')}
            >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.5} />
              Retour au blog
            </button>
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-xs font-sans font-medium px-3 py-1 rounded-pill"
                style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
              >
                {article.category}
              </span>
              <span className="text-xs text-ink-body font-sans">{article.date} · {article.readTime} de lecture</span>
            </div>
            <h1 className="h3 mb-5">{article.title}</h1>
            <p className="body1 text-ink-body">{article.excerpt}</p>
          </div>
        </section>

        {/* Content */}
        <section className="pb-24 px-5">
          <div className="w-full max-w-[720px] mx-auto">
            <div
              className="pt-10 font-sans text-ink-body leading-relaxed"
              style={{ fontSize: '1.05rem' }}
            >
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="h4 text-ink mt-10 mb-4">{children}</h2>
                  ),
                  p: ({ children }) => (
                    <p className="mb-5 leading-relaxed">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-ink">{children}</strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-5 pl-5 space-y-2 list-disc">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* CTA */}
            <div
              className="mt-16 rounded-2xl p-10 text-center"
              style={{ background: 'linear-gradient(135deg, #F7F5FF 0%, #EDE9FF 100%)', border: '1px solid rgba(109,74,255,0.12)' }}
            >
              <h3 className="h4 mb-3">Vous souhaitez déployer ces solutions ?</h3>
              <p className="body2 text-ink-body mb-6">Obtenez un audit gratuit de votre agence en moins de 48h.</p>
              <a href={CAL_URL} target="_blank" rel="noreferrer" className="btn-primary">Réserver un créneau gratuit</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { CAL_URL } from '../lib/constants'

const LABELS: Record<string, string> = {
  '/blog': 'Blog',
  '/etudes-de-cas': 'Études de cas',
  '/webinaires': 'Webinaires',
  '/documentation': 'Documentation',
}

export function ComingSoonPage() {
  const navigate = useNavigate()
  const label = LABELS[window.location.pathname] ?? 'Cette page'

  return (
    <>
      <Navbar />
      <main style={{ background: 'linear-gradient(180deg, rgb(10,5,28) 0%, rgb(6,3,16) 100%)', minHeight: '100vh' }}>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-5">
          <span className="label-white mb-4">{label}</span>
          <h1 className="h2-white mb-5">Bientôt disponible</h1>
          <p className="body1-white mb-10" style={{ maxWidth: 420 }}>
            Nous travaillons sur cette section. Revenez prochainement ou contactez-nous directement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={CAL_URL} target="_blank" rel="noreferrer" className="btn-primary">Réserver un créneau</a>
            <button onClick={() => navigate('/')} className="btn-outline-white">Retour à l'accueil</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

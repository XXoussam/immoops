import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useSession } from '@livekit/components-react'
import { TokenSource, ConnectionState } from 'livekit-client'
import { AgentSessionProvider } from '../components/agents-ui/agent-session-provider'
import { AgentSessionView_01 } from '../components/agents-ui/blocks/agent-session-view-01'
import { TooltipProvider } from '../components/ui/tooltip'

const TOKEN_URL = import.meta.env.VITE_LIVEKIT_TOKEN_URL ?? ''

/* ─────────────────────────────── Idle screen ── */

function IdleScreen({ onConnect, connecting, error }: {
  onConnect: () => void
  connecting: boolean
  error: string | null
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6" style={{ height: '100%' }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(109,74,255,0.12)', border: '1px solid rgba(109,74,255,0.22)' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      </div>
      <div className="text-center">
        <p className="font-tight text-white font-semibold mb-1.5" style={{ fontSize: '1rem' }}>
          Agents ImmoOps en direct
        </p>
        <p className="font-sans text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)', maxWidth: 260 }}>
          Parlez directement avec notre agent IA — sans inscription, en temps réel.
        </p>
      </div>
      {error && (
        <p className="font-sans text-xs text-center" style={{ color: '#f87171' }}>{error}</p>
      )}
      <button onClick={onConnect} disabled={connecting}
        className="w-full py-3 font-sans text-sm font-medium rounded-2xl transition-all duration-200"
        style={{
          background: connecting ? 'rgba(109,74,255,0.15)' : 'rgba(109,74,255,0.50)',
          border: '1px solid rgba(109,74,255,0.35)',
          color: connecting ? 'rgba(255,255,255,0.35)' : '#fff',
          cursor: connecting ? 'not-allowed' : 'pointer',
        }}>
        {connecting ? 'Connexion…' : 'Se connecter →'}
      </button>
    </div>
  )
}

/* ─────────────────────────────── Demo panel ── */

function DemoPanel() {
  const [error, setError] = useState<string | null>(null)

  const tokenSource = useMemo(() =>
    TokenSource.literal(async () => {
      const resp = await fetch(TOKEN_URL)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const { accessToken, url } = await resp.json()
      return { serverUrl: url, participantToken: accessToken }
    }), []
  )

  const session = useSession(tokenSource)

  const isConnecting = !session.isConnected && session.connectionState === ConnectionState.Connecting

  const handleConnect = async () => {
    setError(null)
    try {
      await session.start({ tracks: { microphone: { enabled: true } } })
    } catch {
      setError('Impossible de se connecter.')
    }
  }

  return (
    <div
      className="dark flex flex-col overflow-hidden"
      style={{
        borderRadius: 20,
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 8px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
        height: session.isConnected ? 480 : 340,
        transition: 'height 0.4s ease',
      }}
    >
      {session.isConnected ? (
        <AgentSessionProvider session={session}>
          <div style={{ position: 'relative', width: '100%', height: '480px' }}>
            <AgentSessionView_01
              audioVisualizerType="aura"
              themeMode="dark"
              audioVisualizerColor="#6D4AFF"
              preConnectMessage="L'agent écoute, posez une question…"
              supportsChatInput={true}
              supportsVideoInput={false}
              supportsScreenShare={false}
            />
          </div>
        </AgentSessionProvider>
      ) : (
        <IdleScreen
          onConnect={handleConnect}
          connecting={isConnecting}
          error={error}
        />
      )}
    </div>
  )
}

/* ─────────────────────────────── Page ── */

export function DemosPage() {
  const navigate = useNavigate()

  return (
    <TooltipProvider>
      <Navbar />
      <main style={{ background: 'linear-gradient(180deg, rgb(10,5,28) 0%, rgb(6,3,16) 100%)', minHeight: '100vh' }}>

        <section className="pt-32 pb-24 px-5">
          <div className="w-full max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-14">

            {/* Left */}
            <div className="flex-1 lg:pt-10 text-center lg:text-left">
              <span className="label-white">Démos interactives</span>
              <h1 className="h2-white mb-5">Voyez l'IA<br />en action</h1>
              <p className="body1-white" style={{ maxWidth: 360 }}>
                Parlez directement avec nos agents — sans formulaire, sans inscription.
              </p>
            </div>

            {/* Right */}
            <div style={{ flexShrink: 0, width: '100%', maxWidth: 540 }}>
              <DemoPanel />
            </div>

          </div>
        </section>

        <section className="pb-24 text-center px-5">
          <h2 className="h3 mb-3" style={{ color: 'white' }}>Prêt à déployer ces agents ?</h2>
          <p className="font-sans mb-8" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>
            Intégrés dans votre agence en moins de 48h, sur mesure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="mailto:saoudioussama13@gmail.com" className="btn-primary">Demander un audit gratuit</a>
            <button onClick={() => navigate('/')} className="btn-outline-white">Retour à l'accueil</button>
          </div>
        </section>

      </main>
      <Footer />
    </TooltipProvider>
  )
}

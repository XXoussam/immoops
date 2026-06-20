import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useSession } from '@livekit/components-react'
import { TokenSource, ConnectionState } from 'livekit-client'
import { AgentSessionProvider } from '../components/agents-ui/agent-session-provider'
import { AgentSessionView_01 } from '../components/agents-ui/blocks/agent-session-view-01'
import { AgentAudioVisualizerAura } from '../components/agents-ui/agent-audio-visualizer-aura'
import { TooltipProvider } from '../components/ui/tooltip'

const TOKEN_URL = import.meta.env.VITE_LIVEKIT_TOKEN_URL ?? ''

const PANEL_STYLE: React.CSSProperties = {
  borderRadius: 20,
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(32px)',
  WebkitBackdropFilter: 'blur(32px)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: '0 8px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
  height: 480,
  position: 'relative',
  overflow: 'hidden',
}

/* ─────────────────────────────── Demo panel ── */

function DemoPanel() {
  const tokenSource = useMemo(() =>
    TokenSource.literal(async () => {
      const resp = await fetch(TOKEN_URL)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const { accessToken, url } = await resp.json()
      return { serverUrl: url, participantToken: accessToken }
    }), []
  )

  const session = useSession(tokenSource)
  const isConnecting = session.connectionState === ConnectionState.Connecting

  if (session.isConnected) {
    return (
      <div className="dark" style={PANEL_STYLE}>
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
      </div>
    )
  }

  return (
    <div className="dark" style={PANEL_STYLE}>
      {/* Aura visualizer in idle state */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AgentAudioVisualizerAura
          state={isConnecting ? 'connecting' : 'idle'}
          color="#6D4AFF"
          themeMode="dark"
          size="xl"
        />
      </div>

      {/* Call button at the bottom */}
      <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => session.start({ tracks: { microphone: { enabled: true } } })}
          disabled={isConnecting}
          aria-label="Démarrer l'appel"
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: isConnecting ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.9)',
            border: '2px solid rgba(34,197,94,0.5)',
            boxShadow: isConnecting ? 'none' : '0 0 28px rgba(34,197,94,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isConnecting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white" opacity={isConnecting ? 0.35 : 1}>
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </button>
        <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          {isConnecting ? 'Connexion…' : 'Appuyez pour parler'}
        </p>
      </div>
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

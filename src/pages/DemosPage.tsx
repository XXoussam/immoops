import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useSession, useVoiceAssistant, useSessionMessages } from '@livekit/components-react'
import { TokenSource, ConnectionState } from 'livekit-client'
import { AgentSessionProvider } from '../components/agents-ui/agent-session-provider'
import { AgentAudioVisualizerAura } from '../components/agents-ui/agent-audio-visualizer-aura'
import { AgentControlBar } from '../components/agents-ui/agent-control-bar'
import { AgentChatTranscript } from '../components/agents-ui/agent-chat-transcript'
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
}

/* ─── Connected panel — inside AgentSessionProvider so LiveKit hooks resolve ── */
function ConnectedPanel({ onDisconnect }: { onDisconnect: () => void }) {
  const { state, audioTrack } = useVoiceAssistant()
  const { messages } = useSessionMessages()

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px' }}>

      {/* Aura — smaller to leave room for transcript */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
        <AgentAudioVisualizerAura
          state={state}
          audioTrack={audioTrack}
          color="#6D4AFF"
          themeMode="dark"
          size="lg"
        />
      </div>

      {/* Transcript — latest 3 messages only, centered, no scroll */}
      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginBottom: 12, overflow: 'hidden' }}>
        <AgentChatTranscript
          agentState={state}
          messages={messages.slice(-3)}
        />
      </div>

      {/* Control bar */}
      <div className="demo-bar" style={{ width: '100%', flexShrink: 0 }}>
        <AgentControlBar
          variant="livekit"
          isConnected={true}
          onDisconnect={onDisconnect}
          controls={{ leave: true, microphone: true, screenShare: false, camera: false, chat: false }}
          className="!bg-white/[0.08] !border-white/20"
        />
      </div>
    </div>
  )
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

  return (
    <div className="dark" style={PANEL_STYLE}>
      {session.isConnected ? (
        <AgentSessionProvider session={session}>
          <ConnectedPanel onDisconnect={session.end} />
        </AgentSessionProvider>
      ) : (
        <>
          {/* Aura in idle / connecting state */}
          <div style={{ position: 'absolute', inset: 0, bottom: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AgentAudioVisualizerAura
              state={isConnecting ? 'connecting' : 'idle'}
              color="#6D4AFF"
              themeMode="dark"
              size="xl"
            />
          </div>

          {/* Pre-connection: standalone call button */}
          <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => session.start({ tracks: { microphone: { enabled: true } } })}
              disabled={isConnecting}
              style={{
                padding: '8px 32px',
                borderRadius: 999,
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                background: isConnecting ? 'rgba(34,197,94,0.10)' : 'rgba(34,197,94,0.18)',
                color: isConnecting ? 'rgba(34,197,94,0.45)' : 'rgb(74,222,128)',
                border: '1px solid rgba(34,197,94,0.28)',
                cursor: isConnecting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isConnecting ? 'CONNEXION…' : 'DÉMARRER'}
            </button>
          </div>
        </>
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

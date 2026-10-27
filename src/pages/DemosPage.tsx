import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AgentSessionProvider } from '../components/agents-ui/agent-session-provider'
import { AgentAudioVisualizerAura } from '../components/agents-ui/agent-audio-visualizer-aura'
import { ChatPanel, ConnectedPanel, LimitNotice } from '../components/demo/AgentPanels'
import { TooltipProvider } from '../components/ui/tooltip'
import { useVoiceDemo } from '../hooks/useVoiceDemo'
import { CAL_URL } from '../lib/constants'

const PANEL_STYLE: React.CSSProperties = {
  height: 480,
  position: 'relative',
  border: '1px solid transparent',
  transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
}

/* Frame only for chat mode — the idle/call visual floats freely */
const CHAT_FRAME_STYLE: React.CSSProperties = {
  borderRadius: 0,
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(32px)',
  WebkitBackdropFilter: 'blur(32px)',
  borderColor: 'rgba(255,255,255,0.09)',
  boxShadow: '0 8px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
}

type Mode = 'idle' | 'chat'

/* ─────────────────────────────── Demo panel ── */
function DemoPanel() {
  const [mode, setMode] = useState<Mode>('idle')
  const { session, isConnecting, isConnected, showLimitNotice, startCall, endCall } = useVoiceDemo()

  return (
    <div className="dark" style={mode === 'chat' ? { ...PANEL_STYLE, ...CHAT_FRAME_STYLE } : PANEL_STYLE}>
      {/* ── Chat mode ── */}
      {mode === 'chat' && (
        <ChatPanel onBack={() => setMode('idle')} />
      )}

      {/* ── Call mode (voice agent) ── */}
      {mode === 'idle' && isConnected && (
        <AgentSessionProvider session={session}>
          <ConnectedPanel onDisconnect={() => endCall()} />
        </AgentSessionProvider>
      )}

      {/* ── Idle mode ── */}
      {mode === 'idle' && !isConnected && (
        <>
          {showLimitNotice && <LimitNotice />}
          <div className="float-soft" style={{ position: 'absolute', inset: 0, bottom: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AgentAudioVisualizerAura
              state={isConnecting ? 'connecting' : 'idle'}
              color="#6D4AFF"
              themeMode="dark"
              size="xl"
            />
          </div>

          <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button
              onClick={startCall}
              disabled={isConnecting}
              style={{
                padding: '8px 28px',
                borderRadius: 0,
                fontFamily: "'Fira Mono', monospace",
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
              {isConnecting ? 'CONNEXION…' : 'CALL'}
            </button>
            <button
              onClick={() => setMode('chat')}
              style={{
                padding: '8px 28px',
                borderRadius: 0,
                fontFamily: "'Fira Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                background: 'rgba(109,74,255,0.18)',
                color: 'rgba(180,160,255,0.9)',
                border: '1px solid rgba(109,74,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              CHAT
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/* ─────────────────────────────── 360° Tour ── */
function TourSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.setAttribute('data-short', 'MMqLrAhy2oN')
    script.setAttribute('data-path', 'tours')
    script.setAttribute('data-is-self-hosted', 'false')
    script.src = 'https://app.cloudpano.com/public/shareScript.js'
    el.appendChild(script)
    return () => { el.innerHTML = '' }
  }, [])

  return (
    <section className="pb-24 px-5">
      <div className="w-full max-w-[1100px] mx-auto">
        <div className="text-center mb-10">
          <span className="label-white">Visite virtuelle</span>
          <h2 className="h3 mb-3" style={{ color: 'white' }}>Explorez en 360°</h2>
          <p className="body1-white mx-auto" style={{ maxWidth: 480 }}>
            Naviguez dans le bien comme si vous y étiez, directement depuis votre navigateur.
          </p>
        </div>
        <div
          id="MMqLrAhy2oN"
          ref={containerRef}
          style={{
            width: '100%',
            height: 500,
            borderRadius: 0,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 8px 64px rgba(0,0,0,0.45)',
          }}
        />
      </div>
    </section>
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
            <div className="flex-1 lg:pt-10 text-center lg:text-left">
              <span className="label-white">Démos interactives</span>
              <h1 className="h2-white mb-5">Voyez l'IA<br />en action</h1>
              <p className="body1-white" style={{ maxWidth: 360 }}>
                Parlez directement avec nos agents — sans formulaire, sans inscription.
              </p>
            </div>
            <div style={{ flexShrink: 0, width: '100%', maxWidth: 540 }}>
              <DemoPanel />
            </div>
          </div>
        </section>

        {/* ── 360° Tour ── */}
        <TourSection />

        <section className="pb-24 text-center px-5">
          <h2 className="h3 mb-3" style={{ color: 'white' }}>Prêt à déployer ces agents ?</h2>
          <p className="font-sans mb-8" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>
            Intégrés dans votre agence en moins de 48h, sur mesure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={CAL_URL} target="_blank" rel="noreferrer" className="btn-primary">Réserver un créneau gratuit</a>
            <button onClick={() => navigate('/')} className="btn-outline-white">Retour à l'accueil</button>
          </div>
        </section>
      </main>
      <Footer />
    </TooltipProvider>
  )
}

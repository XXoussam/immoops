import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import {
  LiveKitRoom,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  useLocalParticipant,
} from '@livekit/components-react'

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL ?? ''
const TOKEN_URL   = import.meta.env.VITE_LIVEKIT_TOKEN_URL ?? ''

/* ─────────────────────────────── data ── */

type Role = 'user' | 'bot'
interface Message { role: Role; text: string; delay: number }

const CHAT_FLOW: Message[] = [
  { role: 'bot',  text: "Bonjour ! Je suis l'assistant ImmoOps. Comment puis-je vous aider ?", delay: 600 },
  { role: 'user', text: "Bonjour, je cherche un appartement à acheter à Lyon.", delay: 1800 },
  { role: 'bot',  text: "Parfait ! Quel est votre budget approximatif ?", delay: 3000 },
  { role: 'user', text: "Entre 280 000 et 340 000 €.", delay: 4400 },
  { role: 'bot',  text: "Super. Vous cherchez combien de pièces, et avez-vous un délai de projet ?", delay: 5800 },
  { role: 'user', text: "3 pièces minimum. On aimerait acheter avant l'été.", delay: 7400 },
  { role: 'bot',  text: "Merci ! J'ai bien noté : T3 à Lyon, 280–340 k€, avant juin. Un conseiller vous contacte dès demain matin. 🏡", delay: 9000 },
]

/* ─────────────────────────────── atoms ── */

function ChatBubble({ role, text }: { role: Role; text: string }) {
  const isBot = role === 'bot'
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      {isBot && (
        <div className="w-6 h-6 rounded-full flex-shrink-0 mr-2 mt-1 flex items-center justify-center"
          style={{ background: 'rgba(109,74,255,0.30)', fontSize: '0.55rem', fontWeight: 700, color: '#C084FC', letterSpacing: '0.02em' }}>
          IA
        </div>
      )}
      <div className="max-w-[80%] px-3.5 py-2 font-sans text-sm leading-relaxed"
        style={{
          borderRadius: isBot ? '3px 14px 14px 14px' : '14px 3px 14px 14px',
          background: isBot ? 'rgba(109,74,255,0.16)' : 'rgba(255,255,255,0.09)',
          border: `1px solid ${isBot ? 'rgba(109,74,255,0.28)' : 'rgba(255,255,255,0.11)'}`,
          color: isBot ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.70)',
        }}>
        {text}
      </div>
    </div>
  )
}

/* ─────────────────────────────── chatbot demo ── */

function ChatbotDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const run = () => {
    if (running) return
    setMessages([]); setDone(false); setRunning(true)
  }

  useEffect(() => {
    if (!running) return
    const timers = CHAT_FLOW.map((msg, i) =>
      setTimeout(() => {
        setMessages(prev => [...prev, msg])
        if (i === CHAT_FLOW.length - 1) { setRunning(false); setDone(true) }
      }, msg.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [running])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {/* Scrollable messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4" style={{ minHeight: 0 }}>
        {messages.length === 0 && !running && (
          <div className="h-full flex flex-col items-center justify-center gap-2 opacity-30 py-8">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Lancez la démo pour voir la conversation</p>
          </div>
        )}
        {messages.map((m, i) => <ChatBubble key={i} role={m.role} text={m.text} />)}
        {running && (
          <div className="flex justify-start mb-3">
            <div className="w-6 h-6 rounded-full flex-shrink-0 mr-2 mt-1 flex items-center justify-center"
              style={{ background: 'rgba(109,74,255,0.30)', fontSize: '0.55rem', fontWeight: 700, color: '#C084FC' }}>IA</div>
            <div className="px-3.5 py-3 flex gap-1 items-center"
              style={{ borderRadius: '3px 14px 14px 14px', background: 'rgba(109,74,255,0.16)', border: '1px solid rgba(109,74,255,0.28)' }}>
              {[0,1,2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ background: '#C084FC', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Launch button */}
      <div className="px-5 pb-5 pt-3 flex-shrink-0 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <button onClick={run} disabled={running}
          className="w-full py-3 font-sans text-sm font-medium rounded-2xl transition-all duration-200"
          style={{
            background: running ? 'rgba(109,74,255,0.10)' : 'rgba(109,74,255,0.50)',
            border: '1px solid rgba(109,74,255,0.30)',
            color: running ? 'rgba(255,255,255,0.35)' : '#fff',
            cursor: running ? 'not-allowed' : 'pointer',
            transform: running ? 'none' : undefined,
          }}>
          {running ? 'Conversation en cours…' : done ? 'Relancer la démo' : 'Lancer la démo →'}
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────── voice demo (LiveKit) ── */

const AGENT_STATE_LABEL: Record<string, string> = {
  disconnected:  'Déconnecté',
  connecting:    'Connexion…',
  initializing:  'Initialisation…',
  listening:     'En écoute…',
  thinking:      'Réflexion…',
  speaking:      'Répond…',
}

function VoiceAssistantUI({ onDisconnect }: { onDisconnect: () => void }) {
  const { state, audioTrack } = useVoiceAssistant()
  const { localParticipant } = useLocalParticipant()
  const [muted, setMuted] = useState(false)

  const isActive = state === 'listening' || state === 'speaking' || state === 'thinking'

  const toggleMute = async () => {
    await localParticipant.setMicrophoneEnabled(muted)
    setMuted(m => !m)
  }

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {/* Status bar */}
      <div className="flex items-center gap-3 px-5 py-3 flex-shrink-0 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="relative flex items-center justify-center w-8 h-8">
          {isActive && (
            <span className="absolute w-8 h-8 rounded-full animate-ping"
              style={{ background: 'rgba(109,74,255,0.25)' }} />
          )}
          <div className="w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all duration-300"
            style={{ background: isActive ? 'rgba(109,74,255,0.45)' : 'rgba(109,74,255,0.18)', border: '1px solid rgba(109,74,255,0.35)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2" strokeLinecap="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
        </div>
        <div>
          <p className="font-sans text-xs font-medium transition-colors duration-300"
            style={{ color: isActive ? '#C084FC' : 'rgba(255,255,255,0.45)', lineHeight: 1.3 }}>
            {AGENT_STATE_LABEL[state] ?? state}
          </p>
          <p className="font-sans" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>
            Agent vocal ImmoOps
          </p>
        </div>
      </div>

      {/* Visualizer */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5">
        <BarVisualizer
          state={state}
          barCount={9}
          trackRef={audioTrack}
          style={{ width: 180, height: 56, '--lk-va-bar-color': '#6D4AFF', '--lk-va-bar-hover-color': '#C084FC' } as React.CSSProperties}
        />
        <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>
          {state === 'speaking' ? "L'agent répond en temps réel" : state === 'listening' ? 'Parlez maintenant…' : ''}
        </p>
      </div>

      {/* Controls */}
      <div className="px-5 pb-5 pt-3 flex-shrink-0 border-t flex gap-3" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <button onClick={toggleMute}
          className="flex-1 py-2.5 font-sans text-sm font-medium rounded-2xl transition-all duration-200"
          style={{
            background: muted ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.07)',
            border: `1px solid ${muted ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.12)'}`,
            color: muted ? '#f87171' : 'rgba(255,255,255,0.55)',
            cursor: 'pointer',
          }}>
          {muted ? '🔇 Micro coupé' : '🎙 Couper le micro'}
        </button>
        <button onClick={onDisconnect}
          className="flex-1 py-2.5 font-sans text-sm font-medium rounded-2xl transition-all duration-200"
          style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.30)',
            color: '#f87171',
            cursor: 'pointer',
          }}>
          Terminer l'appel
        </button>
      </div>
    </div>
  )
}

function VoiceDemo() {
  const [token, setToken] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = async () => {
    if (!TOKEN_URL) { setError('VITE_LIVEKIT_TOKEN_URL non configuré.'); return }
    setConnecting(true); setError(null)
    try {
      const resp = await fetch(TOKEN_URL)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = await resp.json()
      setToken(data.accessToken ?? data.token ?? null)
    } catch {
      setError('Impossible de se connecter. Vérifiez votre connexion.')
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = () => setToken(null)

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-6" style={{ height: '100%' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(109,74,255,0.12)', border: '1px solid rgba(109,74,255,0.22)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="font-tight text-white font-semibold mb-1.5" style={{ fontSize: '1rem' }}>Agent vocal ImmoOps</p>
          <p className="font-sans text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)', maxWidth: 260 }}>
            Parlez directement avec notre agent IA — qualifie vos appels en temps réel, 24h/24.
          </p>
        </div>
        {error && <p className="font-sans text-xs text-center" style={{ color: '#f87171' }}>{error}</p>}
        <button onClick={connect} disabled={connecting}
          className="w-full py-3 font-sans text-sm font-medium rounded-2xl transition-all duration-200"
          style={{
            background: connecting ? 'rgba(109,74,255,0.15)' : 'rgba(109,74,255,0.50)',
            border: '1px solid rgba(109,74,255,0.35)',
            color: connecting ? 'rgba(255,255,255,0.35)' : '#fff',
            cursor: connecting ? 'not-allowed' : 'pointer',
          }}>
          {connecting ? 'Connexion…' : 'Démarrer la démo →'}
        </button>
      </div>
    )
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={LIVEKIT_URL}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={disconnect}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <VoiceAssistantUI onDisconnect={disconnect} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}

/* ─────────────────────────────── tab bar ── */

type Tab = 'chat' | 'voice'

const TABS: { id: Tab; label: string; badge: string; icon: React.ReactNode }[] = [
  {
    id: 'chat',
    label: 'Chatbot IA',
    badge: 'Qualification lead',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: 'voice',
    label: 'Agent vocal',
    badge: 'Hors horaires',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.12h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.96a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
      </svg>
    ),
  },
]

/* ─────────────────────────────── page ── */

export function DemosPage() {
  const [active, setActive] = useState<Tab>('chat')
  const [animKey, setAnimKey] = useState(0)
  const navigate = useNavigate()

  const switchTab = (tab: Tab) => {
    if (tab === active) return
    setActive(tab)
    setAnimKey(k => k + 1)
  }

  return (
    <>
      <Navbar />
      <main style={{ background: 'linear-gradient(180deg, rgb(10,5,28) 0%, rgb(6,3,16) 100%)', minHeight: '100vh' }}>

        {/* Two-column layout */}
        <section className="pt-32 pb-24 px-5">
          <div className="w-full max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-14">

            {/* Left: title + description */}
            <div className="flex-1 lg:pt-10 text-center lg:text-left">
              <span className="label-white">Démos interactives</span>
              <h1 className="h2-white mb-5">
                Voyez l'IA<br />en action
              </h1>
              <p className="body1-white mb-8" style={{ maxWidth: 360 }}>
                Interagissez directement avec nos agents — sans formulaire, sans inscription.
              </p>

            </div>

            {/* Right: single panel */}
            <div className="w-full lg:w-auto" style={{ flexShrink: 0, width: '100%', maxWidth: 540 }}>
            <div
              className="flex flex-col overflow-hidden"
              style={{
                borderRadius: 20,
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 8px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              {/* Tab bar */}
              <div className="flex border-b flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                {TABS.map(tab => {
                  const isActive = active === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => switchTab(tab.id)}
                      className="flex-1 flex items-center justify-center gap-2 font-sans font-medium text-sm transition-all duration-200 relative"
                      style={{
                        height: 52,
                        color: isActive ? '#ffffff' : 'rgba(255,255,255,0.38)',
                        background: isActive ? 'rgba(109,74,255,0.14)' : 'transparent',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <span style={{ color: isActive ? '#C084FC' : 'rgba(255,255,255,0.28)' }}>{tab.icon}</span>
                      <span>{tab.label}</span>
                      <span
                        className="font-sans text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: isActive ? 'rgba(109,74,255,0.25)' : 'rgba(255,255,255,0.05)',
                          color: isActive ? '#C084FC' : 'rgba(255,255,255,0.25)',
                          border: `1px solid ${isActive ? 'rgba(109,74,255,0.35)' : 'rgba(255,255,255,0.08)'}`,
                          fontSize: '0.65rem',
                        }}
                      >
                        {tab.badge}
                      </span>
                      {/* Active underline */}
                      {isActive && (
                        <span
                          className="absolute bottom-0 left-0 right-0"
                          style={{ height: 2, background: 'linear-gradient(90deg, transparent, #6D4AFF, transparent)' }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Scenario subtitle */}
              <div className="px-5 py-3 flex-shrink-0 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                  {active === 'chat'
                    ? "Scénario : un prospect arrive sur votre site à 23h. Le chatbot identifie son budget, sa zone et son délai de projet."
                    : "Scénario : un appel entrant après 19h. L'agent répond naturellement, collecte les infos et planifie un rappel."}
                </p>
              </div>

              {/* Demo content — crossfade on tab switch */}
              <div key={animKey} className="demo-fade-in" style={{ height: 400 }}>
                {active === 'chat' ? <ChatbotDemo /> : <VoiceDemo />}
              </div>

            </div>{/* end glass panel */}
            </div>{/* end right col */}
          </div>{/* end two-col */}
        </section>

        {/* CTA */}
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
    </>
  )
}

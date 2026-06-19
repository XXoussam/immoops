import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import {
  LiveKitRoom,
  useVoiceAssistant,
  useSessionMessages,
  BarVisualizer,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
} from '@livekit/components-react'
import type { ReceivedMessage } from '@livekit/components-core'
import '@livekit/components-styles'

const LIVEKIT_URL  = import.meta.env.VITE_LIVEKIT_URL ?? ''
const STATIC_TOKEN = import.meta.env.VITE_LIVEKIT_TOKEN ?? ''
const TOKEN_URL    = import.meta.env.VITE_LIVEKIT_TOKEN_URL ?? ''

/* ─────────────────────────────── Agent state labels ── */

const STATE_LABEL: Record<string, string> = {
  disconnected:           'Déconnecté',
  connecting:             'Connexion…',
  'pre-connect-buffering':'En écoute avant connexion…',
  initializing:           'Initialisation…',
  idle:                   'En attente…',
  listening:              'En écoute…',
  thinking:               'Réflexion…',
  speaking:               'Répond…',
  failed:                 'Erreur de connexion',
}

/* ─────────────────────────────── Voice view ── */

function VoiceView() {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant()
  const isActive = state === 'listening' || state === 'speaking' || state === 'thinking'

  const lastTranscript = agentTranscriptions.length > 0
    ? agentTranscriptions[agentTranscriptions.length - 1].text
    : null

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {/* Visualizer area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6">
        {/* Aura ring */}
        <div className="relative flex items-center justify-center">
          {isActive && (
            <span className="absolute rounded-full animate-ping"
              style={{ width: 120, height: 120, background: 'rgba(109,74,255,0.12)' }} />
          )}
          <div className="relative flex items-center justify-center rounded-full"
            style={{
              width: 100, height: 100,
              background: isActive ? 'rgba(109,74,255,0.18)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isActive ? 'rgba(109,74,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
              transition: 'all 0.4s ease',
            }}>
            <BarVisualizer
              state={state}
              barCount={7}
              trackRef={audioTrack}
              style={{ width: 56, height: 32 }}
            />
          </div>
        </div>

        {/* State + transcript */}
        <div className="text-center" style={{ minHeight: 48 }}>
          <p className="font-sans text-xs font-medium uppercase tracking-widest mb-1.5"
            style={{ color: isActive ? '#C084FC' : 'rgba(255,255,255,0.28)', letterSpacing: '0.12em' }}>
            {STATE_LABEL[state] ?? state}
          </p>
          {lastTranscript && (
            <p className="font-sans text-sm leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 320, margin: '0 auto' }}>
              «&nbsp;{lastTranscript}&nbsp;»
            </p>
          )}
        </div>
      </div>

      {/* LiveKit control bar */}
      <div className="flex-shrink-0 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <VoiceAssistantControlBar controls={{ microphone: true, leave: true }} />
      </div>
    </div>
  )
}

/* ─────────────────────────────── Chat view ── */

function MessageRow({ msg }: { msg: ReceivedMessage }) {
  const isUser    = msg.type === 'userTranscript' || (!msg.from?.isAgent && msg.type !== 'agentTranscript')
  const text      = 'message' in msg ? msg.message : ''
  if (!text.trim()) return null

  return (
    <div className={`flex mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full flex-shrink-0 mr-2 mt-0.5 flex items-center justify-center"
          style={{ background: 'rgba(109,74,255,0.30)', fontSize: '0.5rem', fontWeight: 700, color: '#C084FC' }}>
          IA
        </div>
      )}
      <div className="max-w-[80%] px-3.5 py-2 font-sans text-sm leading-relaxed"
        style={{
          borderRadius: isUser ? '14px 3px 14px 14px' : '3px 14px 14px 14px',
          background: isUser ? 'rgba(255,255,255,0.09)' : 'rgba(109,74,255,0.16)',
          border: `1px solid ${isUser ? 'rgba(255,255,255,0.11)' : 'rgba(109,74,255,0.28)'}`,
          color: isUser ? 'rgba(255,255,255,0.70)' : 'rgba(255,255,255,0.88)',
          fontStyle: msg.type === 'agentTranscript' || msg.type === 'userTranscript' ? 'italic' : 'normal',
        }}>
        {text}
      </div>
    </div>
  )
}

function ChatView() {
  const { messages, send, isSending } = useSessionMessages()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isSending) return
    setInput('')
    await send(text)
  }

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ minHeight: 0 }}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 opacity-30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Commencez la conversation…
            </p>
          </div>
        )}
        {messages.map((msg) => <MessageRow key={msg.id} msg={msg} />)}
        {isSending && (
          <div className="flex justify-start mb-3">
            <div className="w-6 h-6 rounded-full flex-shrink-0 mr-2 flex items-center justify-center"
              style={{ background: 'rgba(109,74,255,0.30)', fontSize: '0.5rem', fontWeight: 700, color: '#C084FC' }}>IA</div>
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

      {/* Input */}
      <form onSubmit={handleSend}
        className="flex-shrink-0 border-t flex gap-2 px-4 py-3"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Écrivez un message…"
          className="flex-1 font-sans text-sm rounded-xl px-3 py-2 outline-none"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            color: 'rgba(255,255,255,0.85)',
          }}
        />
        <button type="submit" disabled={!input.trim() || isSending}
          className="font-sans text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 flex-shrink-0"
          style={{
            background: input.trim() ? 'rgba(109,74,255,0.55)' : 'rgba(109,74,255,0.12)',
            border: '1px solid rgba(109,74,255,0.30)',
            color: input.trim() ? '#fff' : 'rgba(255,255,255,0.25)',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
          }}>
          →
        </button>
      </form>
    </div>
  )
}

/* ─────────────────────────────── Inside-room layout ── */

type Tab = 'voice' | 'chat'

const TABS: { id: Tab; label: string; badge: string; icon: React.ReactNode }[] = [
  {
    id: 'voice',
    label: 'Agent vocal',
    badge: 'Hors horaires',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.12h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.96a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
      </svg>
    ),
  },
  {
    id: 'chat',
    label: 'Chatbot IA',
    badge: 'Qualification lead',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
]

function RoomLayout({ onDisconnect: _onDisconnect }: { onDisconnect: () => void }) {
  const [active, setActive] = useState<Tab>('voice')

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {/* Tab bar */}
      <div className="flex flex-shrink-0 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        {TABS.map(tab => {
          const isActive = active === tab.id
          return (
            <button key={tab.id} onClick={() => setActive(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 font-sans font-medium text-sm transition-all duration-200 relative"
              style={{
                height: 48,
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.38)',
                background: isActive ? 'rgba(109,74,255,0.14)' : 'transparent',
                cursor: 'pointer', outline: 'none', border: 'none',
              }}>
              <span style={{ color: isActive ? '#C084FC' : 'rgba(255,255,255,0.28)' }}>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="font-sans px-1.5 py-0.5 rounded-full"
                style={{
                  fontSize: '0.6rem',
                  background: isActive ? 'rgba(109,74,255,0.25)' : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#C084FC' : 'rgba(255,255,255,0.25)',
                  border: `1px solid ${isActive ? 'rgba(109,74,255,0.35)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                {tab.badge}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0"
                  style={{ height: 2, background: 'linear-gradient(90deg, transparent, #6D4AFF, transparent)' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {active === 'voice' ? <VoiceView /> : <ChatView />}
      </div>

      <RoomAudioRenderer />
    </div>
  )
}

/* ─────────────────────────────── Idle / connect screen ── */

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
          Parlez ou chattez directement avec nos agents IA — sans inscription, en temps réel.
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

/* ─────────────────────────────── Main panel ── */

function DemoPanel() {
  const [token, setToken]           = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const connect = async () => {
    if (STATIC_TOKEN) { setToken(STATIC_TOKEN); return }
    if (!TOKEN_URL)   { setError('VITE_LIVEKIT_TOKEN non configuré.'); return }
    setConnecting(true); setError(null)
    try {
      const resp = await fetch(TOKEN_URL)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = await resp.json()
      setToken(data.accessToken ?? data.token ?? null)
    } catch {
      setError('Impossible de se connecter.')
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = () => setToken(null)

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        borderRadius: 20,
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 8px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
        height: token ? 480 : 340,
        transition: 'height 0.4s ease',
        /* LiveKit CSS variable overrides */
        '--lk-bg': 'transparent',
        '--lk-fg': '#C084FC',
        '--lk-border-color': 'rgba(255,255,255,0.08)',
        '--lk-va-bg': 'rgba(109,74,255,0.20)',
        '--lk-control-fg': 'rgba(255,255,255,0.7)',
        '--lk-control-bg': 'rgba(255,255,255,0.07)',
        '--lk-control-hover-bg': 'rgba(255,255,255,0.12)',
        '--lk-control-active-bg': 'rgba(109,74,255,0.35)',
        '--lk-danger': '#ef4444',
      } as React.CSSProperties}
    >
      {token ? (
        <LiveKitRoom
          token={token}
          serverUrl={LIVEKIT_URL}
          connect={true}
          audio={true}
          video={false}
          data-lk-theme="default"
          onDisconnected={disconnect}
          style={{ height: '100%', background: 'transparent' }}
        >
          <RoomLayout onDisconnect={disconnect} />
        </LiveKitRoom>
      ) : (
        <IdleScreen onConnect={connect} connecting={connecting} error={error} />
      )}
    </div>
  )
}

/* ─────────────────────────────── Page ── */

export function DemosPage() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <main style={{ background: 'linear-gradient(180deg, rgb(10,5,28) 0%, rgb(6,3,16) 100%)', minHeight: '100vh' }}>

        <section className="pt-32 pb-24 px-5">
          <div className="w-full max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-14">

            {/* Left */}
            <div className="flex-1 lg:pt-10 text-center lg:text-left">
              <span className="label-white">Démos interactives</span>
              <h1 className="h2-white mb-5">Voyez l'IA<br />en action</h1>
              <p className="body1-white" style={{ maxWidth: 360 }}>
                Parlez ou chattez directement avec nos agents — sans formulaire, sans inscription.
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
    </>
  )
}

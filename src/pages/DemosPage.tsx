import { useMemo, useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
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
import { CAL_URL } from '../lib/constants'

const TOKEN_URL = import.meta.env.VITE_LIVEKIT_TOKEN_URL ?? '/.netlify/functions/token'
const CHAT_URL = '/.netlify/functions/chat'

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

/* ─── Types ── */
type ChatMessage = { role: 'user' | 'assistant'; content: string }
type Mode = 'idle' | 'call' | 'chat' | 'tour'

/* ─── Chat panel (Gemini) ── */
function ChatPanel({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Bonjour ! Je suis Sophie, votre conseillère ImmoOps. Comment puis-je vous aider ?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = messagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const next: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      setMessages([...next, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Désolée, une erreur est survenue.' }])
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(109,74,255,0.25)', border: '1px solid rgba(109,74,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'rgba(180,160,255,0.9)', fontWeight: 600, fontFamily: 'Sora, sans-serif' }}>
          S
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontFamily: 'Sora, sans-serif', lineHeight: 1 }}>Sophie</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>Conseillère ImmoOps · IA</p>
        </div>
        <button
          onClick={onBack}
          style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.08em', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
        >
          ← RETOUR
        </button>
      </div>

      {/* Messages */}
      <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%',
              padding: '8px 12px',
              borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: m.role === 'user' ? 'rgba(109,74,255,0.22)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${m.role === 'user' ? 'rgba(109,74,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
              fontSize: 13,
              lineHeight: 1.55,
              color: m.role === 'user' ? 'rgba(220,210,255,0.9)' : 'rgba(220,225,235,0.85)',
              fontFamily: 'Inter, sans-serif',
            }}>
              {m.role === 'assistant' ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
                    strong: ({ children }) => <strong style={{ fontWeight: 600, color: 'rgba(220,225,235,1)' }}>{children}</strong>,
                    ul: ({ children }) => <ul style={{ margin: '4px 0', paddingLeft: 16 }}>{children}</ul>,
                    li: ({ children }) => <li style={{ marginBottom: 2 }}>{children}</li>,
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              ) : m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '8px 14px', borderRadius: '14px 14px 14px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ display: 'inline-flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(180,160,255,0.6)', animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ flexShrink: 0, padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Écrivez votre message…"
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '8px 12px',
            fontSize: 13,
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            lineHeight: 1.5,
          }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          style={{
            flexShrink: 0,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: !input.trim() || loading ? 'rgba(109,74,255,0.15)' : 'rgba(109,74,255,0.7)',
            border: '1px solid rgba(109,74,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity={!input.trim() || loading ? 0.4 : 1}>
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/* ─── Connected voice panel ── */
function ConnectedPanel({ onDisconnect }: { onDisconnect: () => void }) {
  const { state, audioTrack } = useVoiceAssistant()
  const { messages } = useSessionMessages()

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280 }}>
        <AgentAudioVisualizerAura
          state={state}
          audioTrack={audioTrack}
          color="#6D4AFF"
          themeMode="dark"
          size="lg"
          className={
            state === 'speaking' || state === 'listening'
              ? '!h-[260px] !w-[260px]'
              : '!h-[220px] !w-[220px]'
          }
        />
      </div>
      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginBottom: 8, overflow: 'hidden' }}>
        <AgentChatTranscript agentState={state} messages={messages.slice(-2)} />
      </div>
      <div className="demo-bar" style={{ width: '100%', flexShrink: 0 }}>
        <AgentControlBar
          variant="livekit"
          isConnected={true}
          onDisconnect={onDisconnect}
          controls={{ leave: true, microphone: true, screenShare: false, camera: false, chat: false }}
          className="!bg-white/[0.08] !border-white/20 !p-1.5"
        />
      </div>
    </div>
  )
}

/* ─────────────────────────────── Demo panel ── */
function DemoPanel() {
  const [mode, setMode] = useState<Mode>('idle')

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

  // Switch to call mode when session connects
  useEffect(() => {
    if (session.isConnected) setMode('call')
  }, [session.isConnected])

  const startCall = () => {
    session.start({ tracks: { microphone: { enabled: true } } })
  }

  const endCall = () => {
    session.end()
    setMode('idle')
  }

  return (
    <div className="dark" style={PANEL_STYLE}>
      {/* ── Chat mode ── */}
      {mode === 'chat' && (
        <ChatPanel onBack={() => setMode('idle')} />
      )}

      {/* ── Call mode (voice agent) ── */}
      {mode === 'call' && session.isConnected && (
        <AgentSessionProvider session={session}>
          <ConnectedPanel onDisconnect={endCall} />
        </AgentSessionProvider>
      )}

      {/* ── Idle mode ── */}
      {mode === 'idle' && (
        <>
          <div style={{ position: 'absolute', inset: 0, bottom: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              {isConnecting ? 'CONNEXION…' : 'CALL'}
            </button>
            <button
              onClick={() => setMode('chat')}
              style={{
                padding: '8px 28px',
                borderRadius: 999,
                fontFamily: 'monospace',
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
            borderRadius: 20,
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

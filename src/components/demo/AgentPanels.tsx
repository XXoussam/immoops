import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { useVoiceAssistant, useSessionMessages } from '@livekit/components-react'
import { AgentAudioVisualizerAura } from '../agents-ui/agent-audio-visualizer-aura'
import { AgentControlBar } from '../agents-ui/agent-control-bar'
import { AgentChatTranscript } from '../agents-ui/agent-chat-transcript'
import { AiMessageBubble } from '../ui/message-bubble'

const CHAT_URL = '/.netlify/functions/chat'

/* ─── Types ── */
type ChatMessage = { role: 'user' | 'assistant'; content: string; at: Date }

const SOPHIE_AVATAR = (
  <div className="flex size-7 items-center justify-center rounded-full border border-purple/40 bg-purple/25 font-sans text-xs font-semibold text-purple-light">
    S
  </div>
)

/* ─── Chat panel (Gemini) ── */
export function ChatPanel({ onBack, backLabel = '← RETOUR', backAriaLabel }: { onBack: () => void; backLabel?: React.ReactNode; backAriaLabel?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Bonjour ! Je suis Sophie, votre conseillère ImmoOps. Comment puis-je vous aider ?', at: new Date() },
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

    const next: ChatMessage[] = [...messages, { role: 'user', content: text, at: new Date() }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      })
      const data = await res.json()
      setMessages([...next, { role: 'assistant', content: data.reply, at: new Date() }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Désolée, une erreur est survenue.', at: new Date() }])
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
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(109,74,255,0.25)', border: '1px solid rgba(109,74,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'rgba(180,160,255,0.9)', fontWeight: 600, fontFamily: 'Jost, sans-serif' }}>
          S
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontFamily: 'Jost, sans-serif', lineHeight: 1 }}>Sophie</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'Jost, sans-serif', marginTop: 2 }}>Conseillère ImmoOps · IA</p>
        </div>
        <button
          onClick={onBack}
          aria-label={backAriaLabel}
          style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'Fira Mono', monospace", fontWeight: 700, letterSpacing: '0.08em', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
        >
          {backLabel}
        </button>
      </div>

      {/* Messages */}
      <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((m, i) => (
          <AiMessageBubble
            key={i}
            role={m.role}
            content={m.content}
            timestamp={m.at}
            avatar={m.role === 'assistant' ? SOPHIE_AVATAR : undefined}
          >
            {m.role === 'assistant' && (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
                  strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
                  ul: ({ children }) => <ul style={{ margin: '4px 0', paddingLeft: 16, listStyle: 'disc' }}>{children}</ul>,
                  li: ({ children }) => <li style={{ marginBottom: 2 }}>{children}</li>,
                }}
              >
                {m.content}
              </ReactMarkdown>
            )}
          </AiMessageBubble>
        ))}
        {loading && <AiMessageBubble role="assistant" avatar={SOPHIE_AVATAR} isStreaming />}
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
            borderRadius: 0,
            padding: '8px 12px',
            fontSize: 13,
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'Jost, sans-serif',
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
            borderRadius: 0,
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
export function ConnectedPanel({ onDisconnect }: { onDisconnect: () => void }) {
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

/* ─── Shown after a voice call hits the 30s demo cap ── */
export function LimitNotice() {
  return (
    <div style={{
      position: 'absolute',
      top: 14,
      left: 14,
      right: 14,
      padding: '10px 14px',
      borderRadius: 0,
      background: 'rgba(109,74,255,0.16)',
      border: '1px solid rgba(109,74,255,0.3)',
      color: 'rgba(220,210,255,0.95)',
      fontSize: 12,
      fontFamily: 'Jost, sans-serif',
      textAlign: 'center',
      zIndex: 1,
    }}>
      Démo limitée à 30 secondes. Réservez un créneau pour un appel complet.
    </div>
  )
}

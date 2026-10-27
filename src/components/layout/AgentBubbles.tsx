import { useEffect, useId, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Call02Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { AgentSessionProvider } from '../agents-ui/agent-session-provider'
import { AgentAudioVisualizerAura } from '../agents-ui/agent-audio-visualizer-aura'
import { ChatPanel, ConnectedPanel, LimitNotice } from '../demo/AgentPanels'
import { useVoiceDemo } from '../../hooks/useVoiceDemo'
import { AGENT_BUBBLES } from '../../lib/constants'

type Panel = 'chat' | 'phone' | null

/* Gradient arc colours per bubble (brand purple for chat, emerald → sky for the voice agent) */
const FACE_GRADIENTS = {
  chat: ['#6D4AFF', '#C084FC'],
  phone: ['#10B981', '#60A5FA'],
} as const

/* ─── Bubble face: gradient arc, two eyes, and a mouth that says what the bubble does ── */
function BubbleFace({ kind }: { kind: Exclude<Panel, null> }) {
  const gradientId = useId()
  const [from, to] = FACE_GRADIENTS[kind]

  return (
    <svg viewBox="0 0 48 48" width="46" height="46" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="8" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path
        d="M8.96 29.47 A16 16 0 1 1 39.04 29.47"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <g className="agent-face-eyes" fill="#FFFFFF">
        <circle cx="19" cy="22" r="2.6" />
        <circle cx="29" cy="22" r="2.6" />
      </g>
      {kind === 'chat' ? (
        /* speech bubble mouth */
        <path
          fill="#FFFFFF"
          d="M24 27.5c4.4 0 8 1.9 8 4.6 0 2.2-2.3 3.9-5.4 4.4l1.9 3.4-4.6-3.2C19.6 36.6 16 34.7 16 32.1c0-2.7 3.6-4.6 8-4.6z"
        />
      ) : (
        /* handset mouth */
        <path
          fill="#FFFFFF"
          transform="translate(17 26.4) scale(0.6)"
          d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
        />
      )}
    </svg>
  )
}

/* ─── Voice call popup — mounted only while open, so no LiveKit room exists until then ── */
function PhonePanel({ onClose }: { onClose: () => void }) {
  const { session, isConnecting, isConnected, showLimitNotice, startCall, endCall } = useVoiceDemo()
  const copy = AGENT_BUBBLES.phone

  if (isConnected) {
    return (
      <AgentSessionProvider session={session}>
        <ConnectedPanel onDisconnect={() => endCall()} />
      </AgentSessionProvider>
    )
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="agent-popup-head">
        <div className="agent-popup-avatar">{copy.title[0]}</div>
        <div>
          <p className="agent-popup-name">{copy.title}</p>
          <p className="agent-popup-sub">{copy.subtitle}</p>
        </div>
        <button onClick={onClose} className="agent-popup-close" aria-label={AGENT_BUBBLES.close}>
          <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.5} />
        </button>
      </div>

      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        {showLimitNotice && <LimitNotice />}
        <div className="float-soft" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AgentAudioVisualizerAura
            state={isConnecting ? 'connecting' : 'idle'}
            color="#6D4AFF"
            themeMode="dark"
            size="lg"
          />
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '0 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <p className="agent-popup-sub" style={{ textAlign: 'center', fontSize: 12, lineHeight: 1.5, marginTop: 0 }}>
          {copy.intro}
        </p>
        <button onClick={startCall} disabled={isConnecting} className="agent-call-btn">
          <HugeiconsIcon icon={Call02Icon} size={14} strokeWidth={1.5} />
          {isConnecting ? copy.connecting : copy.cta}
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────── Floating chat + phone bubbles ── */
export function AgentBubbles() {
  const [open, setOpen] = useState<Panel>(null)
  /* The chat stays mounted once opened, so minimising keeps the conversation; closing resets it */
  const [chatMounted, setChatMounted] = useState(false)
  const toggle = (panel: Exclude<Panel, null>) => {
    if (panel === 'chat') setChatMounted(true)
    setOpen(o => (o === panel ? null : panel))
  }
  const closeChat = () => { setOpen(null); setChatMounted(false) }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {chatMounted && (
        <div className="agent-popup agent-popup-chat demo-fade-in" role="dialog" aria-label={AGENT_BUBBLES.chat.label} hidden={open !== 'chat'}>
          <ChatPanel onMinimize={() => setOpen(null)} onClose={closeChat} />
        </div>
      )}
      {open === 'phone' && (
        <div className="agent-popup dark demo-fade-in" role="dialog" aria-label={AGENT_BUBBLES.phone.label}>
          <PhonePanel onClose={() => setOpen(null)} />
        </div>
      )}

      <div className="agent-bubbles">
        <button
          onClick={() => toggle('phone')}
          className={`agent-bubble agent-bubble-phone${open === 'phone' ? ' is-open' : ''}`}
          aria-label={AGENT_BUBBLES.phone.label}
          aria-expanded={open === 'phone'}
          title={AGENT_BUBBLES.phone.label}
        >
          <BubbleFace kind="phone" />
        </button>
        <button
          onClick={() => toggle('chat')}
          className={`agent-bubble agent-bubble-chat${open === 'chat' ? ' is-open' : ''}`}
          aria-label={AGENT_BUBBLES.chat.label}
          aria-expanded={open === 'chat'}
          title={AGENT_BUBBLES.chat.label}
        >
          <BubbleFace kind="chat" />
        </button>
      </div>
    </>
  )
}

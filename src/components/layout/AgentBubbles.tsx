import { useEffect, useId, useState } from 'react'
import { useTrackToggle, useVoiceAssistant } from '@livekit/components-react'
import { Track } from 'livekit-client'
import { HugeiconsIcon } from '@hugeicons/react'
import { Call02Icon, CallEnd01Icon, Cancel01Icon, Mic01Icon, MicOff01Icon } from '@hugeicons/core-free-icons'
import { AgentSessionProvider } from '../agents-ui/agent-session-provider'
import { AgentAudioVisualizerAura } from '../agents-ui/agent-audio-visualizer-aura'
import { ChatPanel, LimitNotice } from '../demo/AgentPanels'
import { useVoiceDemo } from '../../hooks/useVoiceDemo'
import { AGENT_BUBBLES } from '../../lib/constants'
import { OPEN_AGENT_EVENT, type AgentKind } from '../../lib/agentEvents'

type Panel = AgentKind | null

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

const CALL_LIMIT_S = 30
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

function RoundButton({ label, icon, onClick, disabled, tone }: {
  label: string
  icon: typeof Call02Icon
  onClick: () => void
  disabled?: boolean
  tone: 'neutral' | 'danger' | 'go'
}) {
  const tones = {
    neutral: 'bg-gray-bg text-ink hover:bg-gray-bgalt',
    danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626]',
    go: 'bg-[#10B981] text-white hover:bg-[#059669]',
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="flex flex-col items-center gap-2 text-[13px] text-ink disabled:opacity-50">
      <span className={`flex size-12 items-center justify-center rounded-full transition-colors ${tones[tone]}`}>
        <HugeiconsIcon icon={icon} size={20} strokeWidth={1.5} />
      </span>
      {label}
    </button>
  )
}

/* Shared frame of the call view: visualiser, agent name, status line, controls */
function CallLayout({ visualizer, status, controls, onClose, notice }: {
  visualizer: React.ReactNode
  status: React.ReactNode
  controls: React.ReactNode
  onClose: () => void
  notice?: React.ReactNode
}) {
  const copy = AGENT_BUBBLES.phone
  return (
    <div className="absolute inset-0 flex flex-col bg-white font-sans text-ink">
      <div className="flex shrink-0 justify-end p-3">
        <button
          type="button"
          onClick={onClose}
          aria-label={AGENT_BUBBLES.close}
          title={AGENT_BUBBLES.close}
          className="flex size-8 items-center justify-center rounded-full border border-gray-line text-ink-body transition-colors hover:text-ink"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.5} />
        </button>
      </div>
      {notice}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-[200px] w-[200px] items-center justify-center">{visualizer}</div>
        <p className="mt-2 flex items-center gap-2 text-[22px] font-semibold leading-tight">
          {copy.title}
          <span className="rounded-md bg-ink px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">{copy.badge}</span>
        </p>
        <p className="mt-1 text-[14px] text-ink-body">{copy.subtitle}</p>
        <div className="mt-4 min-h-[22px] text-[14px] text-ink-body">{status}</div>
      </div>
      <div className="flex shrink-0 justify-center gap-10 pb-6 pt-2">{controls}</div>
    </div>
  )
}

function StatusLine({ label, seconds }: { label: string; seconds?: number }) {
  return (
    <span className="flex items-center gap-2">
      {label}
      <span className="flex items-center gap-[3px]" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1 rounded-full bg-purple" style={{ animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite` }} />
        ))}
      </span>
      {seconds !== undefined && <span className="ml-2 tabular-nums">{mmss(seconds)} / {mmss(CALL_LIMIT_S)}</span>}
    </span>
  )
}

/* Live call: needs the session context for the agent state and the mic toggle; mounted only while connected */
function LiveCall({ onHangUp, onClose }: { onHangUp: () => void; onClose: () => void }) {
  const { state, audioTrack } = useVoiceAssistant()
  const mic = useTrackToggle({ source: Track.Source.Microphone })
  const copy = AGENT_BUBBLES.phone
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const startedAt = Date.now()
    const id = setInterval(() => setSeconds(Math.min(CALL_LIMIT_S, Math.floor((Date.now() - startedAt) / 1000))), 250)
    return () => clearInterval(id)
  }, [])

  return (
    <CallLayout
      onClose={onClose}
      visualizer={<AgentAudioVisualizerAura state={state} audioTrack={audioTrack} color="#6D4AFF" themeMode="light" size="lg" />}
      status={<StatusLine label={copy.status[state] ?? copy.status.listening} seconds={seconds} />}
      controls={
        <>
          <RoundButton
            label={mic.enabled ? copy.mute : copy.unmute}
            icon={mic.enabled ? Mic01Icon : MicOff01Icon}
            onClick={() => mic.toggle()}
            disabled={mic.pending}
            tone="neutral"
          />
          <RoundButton label={copy.hangUp} icon={CallEnd01Icon} onClick={onHangUp} tone="danger" />
        </>
      }
    />
  )
}

/* ─── Voice call view — mounted on first open, so no LiveKit room exists until then ── */
function PhonePanel({ onClose }: { onClose: () => void }) {
  const { session, isConnecting, isConnected, showLimitNotice, startCall, endCall } = useVoiceDemo()
  const copy = AGENT_BUBBLES.phone

  if (isConnected) {
    return (
      <AgentSessionProvider session={session}>
        <LiveCall onHangUp={() => endCall()} onClose={onClose} />
      </AgentSessionProvider>
    )
  }

  return (
    <CallLayout
      onClose={onClose}
      notice={showLimitNotice && <div className="relative mx-4 h-0"><LimitNotice /></div>}
      visualizer={<AgentAudioVisualizerAura state={isConnecting ? 'connecting' : 'idle'} color="#6D4AFF" themeMode="light" size="lg" />}
      status={isConnecting
        ? <StatusLine label={copy.status.connecting} />
        : <p className="mx-auto max-w-[260px] text-[13px] leading-snug">{copy.intro}</p>}
      controls={isConnecting
        ? <RoundButton label={copy.hangUp} icon={CallEnd01Icon} onClick={() => endCall()} tone="danger" />
        : <RoundButton label={copy.cta} icon={Call02Icon} onClick={startCall} tone="go" />}
    />
  )
}

/* ─────────────────────────────── Floating chat + phone bubbles ── */
export function AgentBubbles() {
  const [open, setOpen] = useState<Panel>(null)
  /* Panels stay mounted once opened: minimising (or opening the other bubble) keeps the conversation and any live call; closing resets */
  const [mounted, setMounted] = useState({ chat: false, phone: false })
  const show = (panel: Exclude<Panel, null>) => {
    setMounted(m => ({ ...m, [panel]: true }))
    setOpen(panel)
  }
  const toggle = (panel: Exclude<Panel, null>) => (open === panel ? setOpen(null) : show(panel))
  const close = (panel: Exclude<Panel, null>) => {
    setOpen(null)
    setMounted(m => ({ ...m, [panel]: false }))
  }

  /* Buttons elsewhere on the site (e.g. /demos) open a bubble through openAgent() */
  useEffect(() => {
    const onOpen = (e: Event) => {
      const panel = (e as CustomEvent<AgentKind>).detail
      setMounted(m => ({ ...m, [panel]: true }))
      setOpen(panel)
    }
    window.addEventListener(OPEN_AGENT_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_AGENT_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {(mounted.chat || mounted.phone) && (
        <div className="agent-popup" role="dialog" aria-label={open ? AGENT_BUBBLES[open].label : undefined} hidden={!open}>
          <div className="relative min-h-0 flex-1">
            {mounted.chat && (
              <div className="absolute inset-0" hidden={open !== 'chat'}>
                <ChatPanel onMinimize={() => setOpen(null)} onClose={() => close('chat')} />
              </div>
            )}
            {mounted.phone && (
              <div className="absolute inset-0" hidden={open !== 'phone'}>
                <PhonePanel onClose={() => close('phone')} />
              </div>
            )}
          </div>

          <p className="shrink-0 border-t border-gray-line bg-gray-bg py-2 text-center font-sans text-[12px] text-ink-body">
            {AGENT_BUBBLES.poweredBy} <span className="font-semibold text-ink">ImmoOps</span>
          </p>
        </div>
      )}

      {/* While a panel is open, both bubbles fold into the bottom slot (see .agent-bubbles[data-open]) */}
      <div className="agent-bubbles" data-open={open ?? undefined}>
        <button
          onClick={() => toggle('phone')}
          className={`agent-bubble agent-bubble-phone${open === 'phone' ? ' is-open' : ''}`}
          aria-label={AGENT_BUBBLES.phone.label}
          aria-expanded={open === 'phone'}
          title={AGENT_BUBBLES.phone.label}
          {...(open && open !== 'phone' ? { tabIndex: -1, 'aria-hidden': true } : {})}
        >
          <BubbleFace kind="phone" />
        </button>
        <button
          onClick={() => toggle('chat')}
          className={`agent-bubble agent-bubble-chat${open === 'chat' ? ' is-open' : ''}`}
          aria-label={AGENT_BUBBLES.chat.label}
          aria-expanded={open === 'chat'}
          title={AGENT_BUBBLES.chat.label}
          {...(open && open !== 'chat' ? { tabIndex: -1, 'aria-hidden': true } : {})}
        >
          <BubbleFace kind="chat" />
        </button>
      </div>
    </>
  )
}

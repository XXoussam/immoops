import { useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { BubbleChatIcon, Call02Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { AgentSessionProvider } from '../agents-ui/agent-session-provider'
import { AgentAudioVisualizerAura } from '../agents-ui/agent-audio-visualizer-aura'
import { ChatPanel, ConnectedPanel, LimitNotice } from '../demo/AgentPanels'
import { useVoiceDemo } from '../../hooks/useVoiceDemo'
import { AGENT_BUBBLES } from '../../lib/constants'

type Panel = 'chat' | 'phone' | null

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
  const toggle = (panel: Exclude<Panel, null>) => setOpen(o => (o === panel ? null : panel))

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {open && (
        <div className="agent-popup dark demo-fade-in" role="dialog" aria-label={AGENT_BUBBLES[open].label}>
          {open === 'chat'
            ? <ChatPanel onBack={() => setOpen(null)} backLabel={<HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.5} />} backAriaLabel={AGENT_BUBBLES.close} />
            : <PhonePanel onClose={() => setOpen(null)} />}
        </div>
      )}

      <div className="agent-bubbles">
        <button
          onClick={() => toggle('phone')}
          className="agent-bubble agent-bubble-phone"
          aria-label={AGENT_BUBBLES.phone.label}
          aria-expanded={open === 'phone'}
          title={AGENT_BUBBLES.phone.label}
        >
          <HugeiconsIcon icon={open === 'phone' ? Cancel01Icon : Call02Icon} size={22} strokeWidth={1.5} />
        </button>
        <button
          onClick={() => toggle('chat')}
          className="agent-bubble agent-bubble-chat"
          aria-label={AGENT_BUBBLES.chat.label}
          aria-expanded={open === 'chat'}
          title={AGENT_BUBBLES.chat.label}
        >
          <HugeiconsIcon icon={open === 'chat' ? Cancel01Icon : BubbleChatIcon} size={22} strokeWidth={1.5} />
        </button>
      </div>
    </>
  )
}

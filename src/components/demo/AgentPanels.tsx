import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { AiMessageBubble } from '../ui/message-bubble'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowUp02Icon, Calendar03Icon, Cancel01Icon, LinkSquare02Icon, MinusSignIcon, RefreshIcon } from '@hugeicons/core-free-icons'
import { CAL_URL, CHAT_WIDGET } from '../../lib/constants'

const CHAT_URL = '/.netlify/functions/chat'

/* ─── Types ── */
type ChatMessage = { role: 'user' | 'assistant'; content: string; card?: 'booking' }

const GREETING: ChatMessage = { role: 'assistant', content: CHAT_WIDGET.greeting }

const SOPHIE_AVATAR = (
  <div className="flex size-7 items-center justify-center rounded-full bg-ink font-sans text-xs font-semibold text-white">
    S
  </div>
)

function HeaderButton({ label, icon, onClick }: { label: string; icon: typeof Cancel01Icon; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex size-8 items-center justify-center rounded-full text-ink-body transition-colors hover:bg-gray-bg hover:text-ink"
    >
      <HugeiconsIcon icon={icon} size={18} strokeWidth={1.5} />
    </button>
  )
}

function BookingCard() {
  const { title, domain, description } = CHAT_WIDGET.booking
  return (
    <a
      href={CAL_URL}
      target="_blank"
      rel="noreferrer"
      className="block w-full rounded-2xl border border-gray-line bg-white p-3.5 no-underline transition-colors hover:border-purple"
    >
      <span className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-faint text-purple">
          <HugeiconsIcon icon={Calendar03Icon} size={18} strokeWidth={1.5} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-medium leading-snug text-ink">{title}</span>
          <span className="block text-[13px] text-purple">{domain}</span>
        </span>
        <HugeiconsIcon icon={LinkSquare02Icon} size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ink-body" />
      </span>
      <span className="mt-2 block text-[13px] leading-snug text-ink-body">{description}</span>
    </a>
  )
}

/* ─── Chat panel (Gemini) ── */
export function ChatPanel({ onClose, onMinimize }: { onClose: () => void; onMinimize?: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)
  const conversationRef = useRef(0)  // bumped on reset so late replies from the old conversation are dropped

  useEffect(() => {
    const el = messagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  const ask = async (text: string) => {
    if (!text || loading) return

    const conversation = conversationRef.current
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)

    let reply = CHAT_WIDGET.error
    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      })
      const data = await res.json()
      reply = data.reply ?? reply
    } catch {
      /* keep the error reply */
    }
    if (conversation !== conversationRef.current) return
    setMessages([...next, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  const book = () => {
    if (loading) return
    const { ask: question, reply } = CHAT_WIDGET.booking
    setMessages([...messages, { role: 'user', content: question }, { role: 'assistant', content: reply, card: 'booking' }])
  }

  const reset = () => {
    conversationRef.current++
    setMessages([GREETING])
    setInput('')
    setLoading(false)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    ask(input.trim())
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[20px] bg-white font-sans text-ink">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-line px-4 py-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
          {CHAT_WIDGET.name[0]}
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold leading-tight">{CHAT_WIDGET.name}</p>
          <p className="flex items-center gap-1.5 text-[13px] leading-tight text-ink-body">
            <span className="size-2 rounded-full bg-[#10B981]" />
            {CHAT_WIDGET.status}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-0.5">
          <HeaderButton label={CHAT_WIDGET.reset} icon={RefreshIcon} onClick={reset} />
          {onMinimize && <HeaderButton label={CHAT_WIDGET.minimize} icon={MinusSignIcon} onClick={onMinimize} />}
          <HeaderButton label={CHAT_WIDGET.close} icon={Cancel01Icon} onClick={onClose} />
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesRef} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <AiMessageBubble
            key={i}
            role={m.role}
            content={m.content}
            avatar={m.role === 'assistant' ? SOPHIE_AVATAR : undefined}
            showAvatar={m.role !== 'assistant' || (messages[i + 1]?.role !== 'assistant' && !(loading && i === messages.length - 1))}
            attachment={m.card === 'booking' ? <BookingCard /> : undefined}
          >
            {m.role === 'assistant' && (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="m-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  ul: ({ children }) => <ul className="my-1 list-disc pl-4">{children}</ul>,
                  ol: ({ children }) => <ol className="my-1 list-decimal pl-4">{children}</ol>,
                  li: ({ children }) => <li className="mb-0.5">{children}</li>,
                  a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer">{children}</a>,
                }}
              >
                {m.content}
              </ReactMarkdown>
            )}
          </AiMessageBubble>
        ))}
        {loading && <AiMessageBubble role="assistant" avatar={SOPHIE_AVATAR} isStreaming />}
      </div>

      {/* Quick replies */}
      <div className="agent-chips flex shrink-0 gap-2 overflow-x-auto border-t border-gray-line px-4 py-2.5">
        {CHAT_WIDGET.chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            disabled={loading}
            onClick={() => (chip.booking ? book() : ask(chip.ask ?? ''))}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-line px-3 py-1.5 text-[13px] text-ink transition-colors hover:border-purple hover:text-purple disabled:opacity-50"
          >
            <HugeiconsIcon icon={chip.Icon as typeof Cancel01Icon} size={15} strokeWidth={1.5} />
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="shrink-0 px-4 pb-4 pt-1">
        <div className="flex items-center gap-2 rounded-full border border-gray-line py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-purple">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={CHAT_WIDGET.placeholder}
            aria-label={CHAT_WIDGET.placeholder}
            className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-body"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label={CHAT_WIDGET.send}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-opacity disabled:opacity-30"
          >
            <HugeiconsIcon icon={ArrowUp02Icon} size={18} strokeWidth={2} />
          </button>
        </div>
      </form>
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

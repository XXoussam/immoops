import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { AiMessageBubble } from '../ui/message-bubble'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowUp02Icon, Calendar03Icon, Cancel01Icon, Delete02Icon, LinkSquare02Icon, Mic01Icon, MinusSignIcon, RefreshIcon } from '@hugeicons/core-free-icons'
import { CAL_URL, CHAT_WIDGET } from '../../lib/constants'
import { blobToBase64, formatSeconds, useVoiceRecorder, type VoiceRecording } from '../../hooks/useVoiceRecorder'
import { CamilleFace } from './CamilleFace'
import { lookAt, lookAtCaret, setThinking } from './faceGaze'
import { RecordingWave } from './RecordingWave'
import { VoiceNote, type VoiceClip } from './VoiceNote'

const CHAT_URL = '/.netlify/functions/chat'
const TRANSCRIBE_URL = '/.netlify/functions/transcribe'

/* ─── Types ── */
/* a voice note is shown as audio; its transcript (content) is what Camille reads */
type ChatMessage = { role: 'user' | 'assistant'; content: string; card?: 'booking'; voice?: VoiceClip; pending?: boolean }

const GREETING: ChatMessage = { role: 'assistant', content: CHAT_WIDGET.greeting }

const AGENT_AVATAR = <CamilleFace size={28} />

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

/* ─── Chat panel (Camille) ── */
export function ChatPanel({ onClose, onMinimize }: { onClose: () => void; onMinimize?: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)
  const conversationRef = useRef(0)  // bumped on reset so late replies from the old conversation are dropped
  const leadSavedRef = useRef(false)  // once the visitor's details are saved, Camille stops asking for them

  // Camille's faces look around while a reply is generated, and bounce when it arrives
  useEffect(() => setThinking(loading), [loading])
  useEffect(() => () => setThinking(false), [])

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
    await answer(next, conversation)
  }

  /* voice note: shown right away, transcribed, then answered like a typed message */
  const sendVoice = async ({ blob, mime, duration, peaks }: VoiceRecording) => {
    if (loading || duration < 0.6) return // a tap on the button, not a message
    const conversation = conversationRef.current
    const note: ChatMessage = { role: 'user', content: '', voice: { url: URL.createObjectURL(blob), duration, peaks } }
    const before = messages
    setMessages([...before, { ...note, pending: true }])
    setLoading(true)

    let text = ''
    try {
      const res = await fetch(TRANSCRIBE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: await blobToBase64(blob), mime }),
      })
      text = (await res.json()).text ?? ''
    } catch {
      /* handled below */
    }
    if (conversation !== conversationRef.current) return
    if (!text) {
      setMessages([...before, note, { role: 'assistant', content: CHAT_WIDGET.voice.notUnderstood }])
      setLoading(false)
      return
    }
    const next: ChatMessage[] = [...before, { ...note, content: text }]
    setMessages(next)
    await answer(next, conversation)
  }

  const answer = async (next: ChatMessage[], conversation: number) => {
    let reply = CHAT_WIDGET.error
    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.filter((m) => m.content).map(({ role, content }) => ({ role, content })),
          leadSaved: leadSavedRef.current,
        }),
      })
      const data = await res.json()
      reply = data.reply ?? reply
      if (data.leadSaved && conversation === conversationRef.current) leadSavedRef.current = true
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
    leadSavedRef.current = false
    recorder.cancel()
    messages.forEach((m) => m.voice && URL.revokeObjectURL(m.voice.url))
    setMessages([GREETING])
    setInput('')
    setLoading(false)
  }

  /* ─── Voice notes ── */
  // notes stop themselves at the limit and are sent
  const recorder = useVoiceRecorder({ maxSeconds: CHAT_WIDGET.voice.maxSeconds, onLimit: (clip) => void sendVoice(clip) })
  const [micError, setMicError] = useState(false)
  const recordBarRef = useRef<HTMLDivElement>(null)

  const startRecording = async () => {
    if (loading) return
    setMicError(false)
    try {
      await recorder.start()
    } catch {
      setMicError(true) // permission refused or no microphone
      setTimeout(() => setMicError(false), 5000)
    }
  }
  const finishRecording = async () => {
    const clip = await recorder.stop()
    if (clip) void sendVoice(clip)
  }

  // Camille listens: her eyes stay on the recording bar
  useEffect(() => {
    if (!recorder.recording) return
    const id = setInterval(() => recordBarRef.current && lookAt(recordBarRef.current), 300)
    return () => clearInterval(id)
  }, [recorder.recording])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    ask(input.trim())
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[20px] bg-white font-sans text-ink">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-line px-4 py-3">
        <CamilleFace size={36} />
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
            avatar={m.role === 'assistant' ? AGENT_AVATAR : undefined}
            showAvatar={m.role !== 'assistant' || (messages[i + 1]?.role !== 'assistant' && !(loading && i === messages.length - 1))}
            attachment={m.card === 'booking' ? <BookingCard /> : undefined}
          >
            {m.voice && <VoiceNote clip={m.voice} transcript={m.content} pending={m.pending} />}
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
        {loading && <AiMessageBubble role="assistant" avatar={AGENT_AVATAR} isStreaming />}
      </div>

      {/* Quick replies */}
      <div className="agent-chips flex shrink-0 gap-2 overflow-x-auto border-t border-gray-line px-4 py-2.5">
        {CHAT_WIDGET.chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            disabled={loading || recorder.recording}
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
        {micError && <p className="mb-1.5 px-1 text-[12px] leading-snug text-[#DC2626]">{CHAT_WIDGET.voice.micError}</p>}
        {recorder.recording ? (
          /* recording: delete | scrolling wave, timer | send */
          <div ref={recordBarRef} className="flex items-center gap-2 rounded-full border border-gray-line py-1.5 pl-1.5 pr-1.5">
            <button
              type="button"
              onClick={recorder.cancel}
              aria-label={CHAT_WIDGET.voice.cancel}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-body transition-colors hover:bg-gray-bg hover:text-ink"
            >
              <HugeiconsIcon icon={Delete02Icon} size={18} strokeWidth={1.5} />
            </button>
            <RecordingWave wave={recorder.wave} className="h-7 min-w-0 flex-1" />
            <span className="font-mono text-[12px] tabular-nums text-ink-body">{formatSeconds(recorder.seconds)}</span>
            <button
              type="button"
              onClick={finishRecording}
              aria-label={CHAT_WIDGET.voice.send}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-white"
            >
              <HugeiconsIcon icon={ArrowUp02Icon} size={18} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-gray-line py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-purple">
            <input
              value={input}
              onChange={(e) => { setInput(e.target.value); lookAtCaret(e.target) }}
              onSelect={(e) => lookAtCaret(e.currentTarget)}
              placeholder={CHAT_WIDGET.placeholder}
              aria-label={CHAT_WIDGET.placeholder}
              className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-body"
            />
            {input.trim() ? (
              <button
                type="submit"
                disabled={loading}
                aria-label={CHAT_WIDGET.send}
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-opacity disabled:opacity-30"
              >
                <HugeiconsIcon icon={ArrowUp02Icon} size={18} strokeWidth={2} />
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                disabled={loading}
                aria-label={CHAT_WIDGET.voice.record}
                title={CHAT_WIDGET.voice.record}
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-opacity disabled:opacity-30"
              >
                <HugeiconsIcon icon={Mic01Icon} size={18} strokeWidth={1.5} />
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}

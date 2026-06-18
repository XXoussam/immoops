import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

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

type VRole = 'agent' | 'caller'
interface Line { role: VRole; text: string; delay: number }

const VOICE_FLOW: Line[] = [
  { role: 'agent',  text: "Bonsoir, agence ImmoOps, je suis votre assistant IA. Comment puis-je vous aider ?", delay: 500 },
  { role: 'caller', text: "Bonsoir, j'appelle pour le bien en vente au 12 rue des Acacias.", delay: 2200 },
  { role: 'agent',  text: "Ce T4 de 87 m² est toujours disponible. Souhaitez-vous programmer une visite ?", delay: 4000 },
  { role: 'caller', text: "Oui, de préférence samedi matin.", delay: 5600 },
  { role: 'agent',  text: "Je vous propose samedi à 10h ou 11h30. Laquelle vous convient ?", delay: 7200 },
  { role: 'caller', text: "10h c'est parfait.", delay: 8600 },
  { role: 'agent',  text: "Visite confirmée samedi à 10h. Vous recevrez un SMS de rappel la veille. Bonne soirée !", delay: 10200 },
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

function VoiceLine({ role, text }: { role: VRole; text: string }) {
  const isAgent = role === 'agent'
  return (
    <div className={`flex gap-2.5 mb-3.5 ${isAgent ? '' : 'flex-row-reverse'}`}>
      <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
        style={{ background: isAgent ? 'rgba(109,74,255,0.28)' : 'rgba(255,255,255,0.07)', fontSize: '0.5rem', fontWeight: 700, color: isAgent ? '#C084FC' : 'rgba(255,255,255,0.45)', letterSpacing: '0.04em' }}>
        {isAgent ? 'IA' : 'CLT'}
      </div>
      <div style={{ maxWidth: '78%' }}>
        <p className="font-sans text-xs mb-1" style={{ color: 'rgba(255,255,255,0.28)', letterSpacing: '0.04em' }}>
          {isAgent ? 'Agent IA' : 'Client'}
        </p>
        <p className="font-sans text-sm leading-relaxed px-3.5 py-2"
          style={{
            borderRadius: '10px',
            background: isAgent ? 'rgba(109,74,255,0.13)' : 'rgba(255,255,255,0.07)',
            border: `1px solid ${isAgent ? 'rgba(109,74,255,0.22)' : 'rgba(255,255,255,0.09)'}`,
            color: 'rgba(255,255,255,0.80)',
          }}>
          {text}
        </p>
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

/* ─────────────────────────────── voice demo ── */

function VoiceDemo() {
  const [lines, setLines] = useState<Line[]>([])
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [pulse, setPulse] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const run = () => {
    if (running) return
    setLines([]); setDone(false); setRunning(true); setPulse(true)
  }

  useEffect(() => {
    if (!running) return
    const timers = VOICE_FLOW.map((line, i) =>
      setTimeout(() => {
        setLines(prev => [...prev, line])
        if (i === VOICE_FLOW.length - 1) { setRunning(false); setDone(true); setPulse(false) }
      }, line.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [running])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {/* Call indicator bar */}
      <div className="flex items-center gap-3 px-5 py-3 flex-shrink-0 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="relative flex items-center justify-center w-8 h-8">
          {pulse && (
            <span className="absolute w-8 h-8 rounded-full animate-ping"
              style={{ background: 'rgba(109,74,255,0.25)' }} />
          )}
          <div className="w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all duration-300"
            style={{ background: pulse ? 'rgba(109,74,255,0.45)' : 'rgba(109,74,255,0.18)', border: '1px solid rgba(109,74,255,0.35)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2" strokeLinecap="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
        </div>
        <div>
          <p className="font-sans text-xs font-medium" style={{ color: pulse ? '#C084FC' : 'rgba(255,255,255,0.45)', lineHeight: 1.3 }}>
            {running ? 'Appel en cours…' : done ? 'Appel terminé · 19h34' : 'Appel simulé · 19h34'}
          </p>
          <p className="font-sans" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>
            Agent vocal ImmoOps
          </p>
        </div>
        {(running || done) && (
          <div className="ml-auto flex gap-0.5">
            {[1,2,3,2,4,2,3,1,2,3].map((h, i) => (
              <span key={i} className="inline-block rounded-sm"
                style={{ width: 3, height: h * 4, background: running ? '#C084FC' : 'rgba(192,132,252,0.35)',
                  transition: 'height 0.3s ease', animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}
      </div>

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto px-5 py-4" style={{ minHeight: 0 }}>
        {lines.length === 0 && !running && (
          <div className="h-full flex flex-col items-center justify-center gap-2 opacity-30 py-8">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="1.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.12h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.96a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z"/>
            </svg>
            <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Lancez la démo pour simuler l'appel</p>
          </div>
        )}
        {lines.map((l, i) => <VoiceLine key={i} role={l.role} text={l.text} />)}
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
          }}>
          {running ? 'Appel en cours…' : done ? "Rejouer l'appel" : "Simuler l'appel →"}
        </button>
      </div>
    </div>
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

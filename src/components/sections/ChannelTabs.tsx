import { useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { AGENT_CHANNELS, DEMOS_PAGE, type ChannelKey } from '../../lib/constants'
import { SectionWrapper } from '../ui/SectionWrapper'
import { SectionHeader } from '../ui/SectionHeader'

/* One tab per channel: what the agent does there, an example exchange, and what reaches the CRM */
export function ChannelTabs() {
  const copy = DEMOS_PAGE.channels
  const [active, setActive] = useState<ChannelKey>(AGENT_CHANNELS[0].key)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const channel = AGENT_CHANNELS.find((c) => c.key === active) ?? AGENT_CHANNELS[0]

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    const next = (index + step + AGENT_CHANNELS.length) % AGENT_CHANNELS.length
    setActive(AGENT_CHANNELS[next].key)
    tabRefs.current[next]?.focus()
  }

  return (
    <SectionWrapper id="canaux" className="bg-white">
      <SectionHeader label={copy.label} title={copy.title} description={copy.description} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div role="tablist" aria-orientation="vertical" className="agent-chips flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {AGENT_CHANNELS.map((c, i) => {
            const selected = c.key === active
            return (
              <button
                key={c.key}
                ref={(el) => { tabRefs.current[i] = el }}
                type="button"
                role="tab"
                id={`tab-${c.key}`}
                aria-selected={selected}
                aria-controls="channel-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(c.key)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`flex shrink-0 items-center gap-3 border px-4 py-3 text-left transition-colors ${
                  selected ? 'border-purple bg-purple-pale' : 'border-gray-line hover:border-purple/40'
                }`}
              >
                <span className={`flex size-9 shrink-0 items-center justify-center ${selected ? 'bg-purple text-white' : 'bg-purple-pale text-purple'}`}>
                  <HugeiconsIcon icon={c.Icon as never} size={18} strokeWidth={1.5} />
                </span>
                <span className="min-w-0">
                  <span className="block font-sans text-[15px] font-medium text-ink">{c.label}</span>
                  <span className="hidden font-sans text-[13px] leading-snug text-ink-body lg:block">{c.short}</span>
                </span>
              </button>
            )
          })}
        </div>

        <div
          key={channel.key}
          id="channel-panel"
          role="tabpanel"
          aria-labelledby={`tab-${channel.key}`}
          className="card-white demo-fade-in grid grid-cols-1 gap-10 p-7 md:grid-cols-2 md:p-9"
        >
          <div>
            <p className="label">[{copy.doesTitle}]</p>
            <h3 className="h3 mb-6">{channel.label}</h3>
            <ul className="flex flex-col gap-4">
              {channel.does.map((item) => (
                <li key={item} className="flex gap-3">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color="#6D4AFF" strokeWidth={1.5} className="mt-0.5 shrink-0" />
                  <span className="body2 text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <p className="label">[{copy.exchangeTitle}]</p>
              <div className="flex flex-col gap-3 bg-gray-bg p-4">
                {channel.exchange.map((m, i) => (
                  <div key={i} className={`flex flex-col gap-1 ${m.from === 'client' ? 'items-end' : 'items-start'}`}>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-body">
                      {m.from === 'client' ? copy.client : copy.agent}
                    </span>
                    <p
                      className={`max-w-[88%] px-3.5 py-2.5 font-sans text-[14px] leading-relaxed ${
                        m.from === 'client' ? 'rounded-[18px] bg-purple text-white' : 'rounded-2xl border border-gray-line bg-white text-ink'
                      }`}
                    >
                      {m.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="label">[{copy.crmTitle}]</p>
              <dl className="flex flex-col">
                {channel.crm.map((row) => (
                  <div key={row.field} className="flex items-baseline justify-between gap-4 border-b border-gray-line py-2.5 last:border-b-0">
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-body">{row.field}</dt>
                    <dd className="text-right font-sans text-[14px] font-medium text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

import { HugeiconsIcon } from '@hugeicons/react'
import { UserIcon } from '@hugeicons/core-free-icons'
import { AGENT_CHANNELS, DEMOS_PAGE } from '../../lib/constants'
import { SectionWrapper } from '../ui/SectionWrapper'
import { SectionHeader } from '../ui/SectionHeader'

const CHANNEL_BY_KEY = Object.fromEntries(AGENT_CHANNELS.map((c) => [c.key, c]))

/* An example lead record whose timeline mixes every channel, plus what gets synced */
export function UnifiedCrm() {
  const copy = DEMOS_PAGE.crm

  return (
    <SectionWrapper id="crm" className="bg-gray-bg">
      <SectionHeader label={copy.label} title={copy.title} description={copy.description} />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        {/* Lead record */}
        <div>
          <p className="label">[{copy.example}]</p>
          <div className="card-white">
            <div className="flex flex-wrap items-center gap-4 border-b border-gray-line px-6 py-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink font-sans text-[15px] font-semibold text-white">
                {copy.lead.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[17px] font-semibold text-ink">{copy.lead.name}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {copy.lead.tags.map((tag) => (
                    <span key={tag} className="tag bg-purple-pale text-ink">{tag}</span>
                  ))}
                </div>
              </div>
              <span className="tag bg-[#10B981]/10 text-[#047857]">{copy.lead.score}</span>
            </div>

            <ol className="relative px-6 py-5">
              <span className="absolute bottom-9 left-[39px] top-9 w-px bg-gray-line" aria-hidden="true" />
              {copy.timeline.map((event, i) => {
                const channel = event.channel === 'advisor' ? null : CHANNEL_BY_KEY[event.channel]
                return (
                  <li key={i} className="relative flex gap-4 py-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-line bg-white text-purple">
                      <HugeiconsIcon icon={(channel?.Icon ?? UserIcon) as never} size={15} strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-ink-body">
                        {event.time} · {channel?.label ?? copy.advisor}
                      </p>
                      <p className="font-sans text-[14px] leading-snug text-ink">{event.text}</p>
                    </div>
                  </li>
                )
              })}
            </ol>

            <p className="border-t border-gray-line bg-purple-pale px-6 py-4 font-sans text-[14px] font-medium text-purple">
              {copy.nextAction}
            </p>
          </div>
        </div>

        {/* What gets synced */}
        <ul className="flex flex-col gap-8 lg:pt-9">
          {copy.sync.map((item) => (
            <li key={item.title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center bg-white">
                <HugeiconsIcon icon={item.Icon as never} size={20} color="#6D4AFF" strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="h4 mb-1.5">{item.title}</h3>
                <p className="body2">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  )
}

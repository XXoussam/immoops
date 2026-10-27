import { HugeiconsIcon } from '@hugeicons/react'
import { BubbleChatIcon, Call02Icon } from '@hugeicons/core-free-icons'
import { DEMOS_PAGE } from '../../lib/constants'
import { openAgent } from '../../lib/agentEvents'
import { SectionWrapper } from '../ui/SectionWrapper'
import { SectionHeader } from '../ui/SectionHeader'

/* Both live demos run in the floating bubbles; these cards just open them */
export function TryLive() {
  const copy = DEMOS_PAGE.live
  const cards = [
    { ...copy.chat, Icon: BubbleChatIcon, kind: 'chat' as const, button: 'btn-primary' },
    { ...copy.call, Icon: Call02Icon, kind: 'phone' as const, button: 'btn-outline' },
  ]

  return (
    <SectionWrapper id="essayer" className="bg-white">
      <SectionHeader label={copy.label} title={copy.title} description={copy.description} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <div key={card.kind} className="card-white p-8 md:p-10">
            <span className="mb-6 flex size-10 items-center justify-center bg-purple-pale">
              <HugeiconsIcon icon={card.Icon} size={20} color="#6D4AFF" strokeWidth={1.5} />
            </span>
            <h3 className="h3 mb-3">{card.title}</h3>
            <p className="body2 mb-7">{card.description}</p>
            <button type="button" onClick={() => openAgent(card.kind)} className={card.button}>
              {card.cta}
            </button>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}

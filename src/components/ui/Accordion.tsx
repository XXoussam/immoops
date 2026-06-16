import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FaqItem } from '../../lib/constants'

interface AccordionProps {
  items: FaqItem[]
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={i}
            className="glass-card overflow-hidden transition-all duration-300"
          >
            <button
              className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 cursor-pointer"
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span className="font-semibold text-text-primary text-sm md:text-base">
                {item.question}
              </span>
              <ChevronDown
                className={`shrink-0 w-5 h-5 text-accent transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-text-muted text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

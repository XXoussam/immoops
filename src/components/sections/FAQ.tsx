import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { FAQ_ITEMS } from '../../lib/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="faq" className="section bg-white">
      <div
        ref={ref}
        className={`container-main transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16">
        <div>
          <span className="label">[FAQ]</span>
          <h2 className="h2">Questions fréquentes</h2>
        </div>

        {/* Accordion */}
        <div className="w-full border-t border-gray-line">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={i} className="border-b border-gray-line">
                <button
                  className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="body1 pr-8 group-hover:text-purple transition-colors duration-200 text-ink">
                    {item.question}
                  </span>
                  <span style={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                  }}>
                    <HugeiconsIcon icon={ArrowDown01Icon} size={18} color="#65707b" strokeWidth={1.5} />
                  </span>
                </button>
                <div
                  className="grid transition-all duration-300 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="body2 pb-6">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        </div>
      </div>
    </section>
  )
}

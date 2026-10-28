import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon, Database01Icon } from '@hugeicons/core-free-icons'
import { AGENT_CHANNELS, DEMOS_PAGE } from '../../lib/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'

/* The agent: two floating eyes whose pupils dart around, mostly reading downward, and dilate now and then */
function FloatingEyes() {
  const eyes = [20, 44]  // eye centres (x); both eyes are 16 × 26, centred on y = 20
  return (
    <div className="floating-eyes" aria-hidden="true">
      <svg viewBox="0 0 64 40" width="96" height="60" fill="none">
        <g className="agent-face-eyes">
          {eyes.map((cx) => (
            <g key={cx}>
              <rect x={cx - 8} y="7" width="16" height="26" rx="8" fill="#FFFFFF" />
              <g className="floating-eyes-pupil">
                <g className="floating-eyes-iris">
                  <circle cx={cx} cy="21" r="4.2" fill="#0F1117" />
                  <circle cx={cx - 1.4} cy="19.4" r="1.2" fill="#FFFFFF" />
                </g>
              </g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

/* Channels on the left feed one agent, which writes everything to one CRM */
function AgentHub() {
  const { hub } = DEMOS_PAGE
  return (
    <div className="mt-14 flex flex-col lg:flex-row lg:items-stretch">
      {/* Channels */}
      <div className="lg:w-[38%]">
        <p className="label-white">[{hub.channelsLabel}]</p>
        <ul className="grid grid-cols-2 gap-3 lg:flex lg:flex-col">
          {AGENT_CHANNELS.map((c) => (
            <li key={c.key} className="flex items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3 border border-white/10 bg-white/[0.04] px-4 py-3">
                <HugeiconsIcon icon={c.Icon as never} size={20} color="#C084FC" strokeWidth={1.5} className="shrink-0" />
                <span className="min-w-0">
                  <span className="block font-sans text-[15px] font-medium text-white">{c.label}</span>
                  <span className="hidden truncate font-sans text-[13px] text-white/45 lg:block">{c.short}</span>
                </span>
              </div>
              <span className="hub-line hidden w-10 lg:block xl:w-14" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>

      <span className="hub-line-v my-3 lg:hidden" aria-hidden="true" />

      {/* Agent */}
      <div
        className="flex flex-col justify-center border border-purple/50 px-7 py-8 lg:w-[26%]"
        style={{ background: 'linear-gradient(160deg, rgba(109,74,255,0.28) 0%, rgba(109,74,255,0.08) 100%)', boxShadow: '0 0 60px rgba(109,74,255,0.25)' }}
      >
        <FloatingEyes />
        <p className="label-white mt-5">[{hub.agentLabel}]</p>
        <p className="h4 text-white">{hub.agentTitle}</p>
        <ol className="mt-5 flex flex-col gap-3">
          {hub.agentSteps.map((step, i) => (
            <li key={step} className="flex gap-3 font-sans text-[14px] leading-snug text-white/75">
              <span className="font-mono text-[12px] text-purple-light">0{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <span className="hub-line hidden w-10 self-center lg:block xl:w-14" aria-hidden="true" />
      <span className="hub-line-v my-3 lg:hidden" aria-hidden="true" />

      {/* CRM */}
      <div className="flex flex-col justify-center bg-white px-7 py-8 lg:flex-1">
        <HugeiconsIcon icon={Database01Icon} size={28} color="#6D4AFF" strokeWidth={1.5} />
        <p className="label mt-5">[{hub.crmLabel}]</p>
        <ul className="mt-1 flex flex-col">
          {hub.crmFields.map((field) => (
            <li key={field} className="flex items-center gap-3 border-b border-gray-line py-3 font-sans text-[15px] text-ink last:border-b-0">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} color="#10B981" strokeWidth={1.5} />
              {field}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function DemosHero() {
  const { ref, isVisible } = useScrollReveal()
  const { hero } = DEMOS_PAGE

  return (
    <section className="bg-purple-dark pb-20 pt-32 md:pt-40">
      <div
        ref={ref}
        className={`container-main transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:items-end lg:gap-16">
          <div>
            <span className="label-white">[{hero.label}]</span>
            <h1 className="h2-white">{hero.title}</h1>
          </div>
          <p className="body2 lg:pb-2 lg:text-right" style={{ color: 'rgba(255,255,255,0.6)' }}>{hero.description}</p>
        </div>

        <AgentHub />
      </div>
    </section>
  )
}

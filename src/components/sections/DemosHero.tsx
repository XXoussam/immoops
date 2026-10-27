import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon, Database01Icon } from '@hugeicons/core-free-icons'
import { AGENT_CHANNELS, DEMOS_PAGE } from '../../lib/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'

/* The agent: two floating eyes reading rows of data while a beam sweeps under their gaze */
function ScanningEyes() {
  /* bar widths per row; each row spans x = 4 → 92 */
  const rows = [
    [8, 16, 24, 10, 18],
    [12, 10, 22, 14, 18],
    [18, 12, 10, 22, 14],
  ]
  return (
    <div className="scan-eyes" aria-hidden="true">
      <svg viewBox="0 0 96 64" width="112" height="75" fill="none">
        <defs>
          <linearGradient id="scan-beam" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#C084FC" stopOpacity="0" />
            <stop offset="0.5" stopColor="#C084FC" stopOpacity="0.9" />
            <stop offset="1" stopColor="#C084FC" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* data being read */}
        {rows.map((widths, r) => {
          let x = 4
          return widths.map((w, i) => {
            const bar = <rect key={`${r}-${i}`} x={x} y={40 + r * 8} width={w} height="3" rx="1.5" fill="#C084FC" opacity="0.28" />
            x += w + 3
            return bar
          })
        })}

        {/* beam sweeping the rows, in step with the gaze */}
        <rect className="scan-eyes-beam" x="0" y="36" width="20" height="26" fill="url(#scan-beam)" opacity="0.55" />

        {/* eyes: look left and right, blink now and then */}
        <g className="scan-eyes-look">
          <g className="agent-face-eyes" fill="#FFFFFF">
            <rect x="29" y="6" width="12" height="20" rx="6" />
            <rect x="55" y="6" width="12" height="20" rx="6" />
          </g>
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
        <ScanningEyes />
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

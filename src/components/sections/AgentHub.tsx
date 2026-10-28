import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon, Database01Icon } from '@hugeicons/core-free-icons'
import { AGENT_CHANNELS, DEMOS_PAGE } from '../../lib/constants'

/* The agent: a searchlight sweeps a dark screen and one eye follows it, blinking now and then */
function SearchlightEye({ slogan }: { slogan: string }) {
  /* lens-like tick marks on the iris: two bars at each diagonal */
  const ticks = [40, 52, 130, 142, 220, 232, 310, 322]
  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden border border-white/10 bg-[#050507]">
      <svg viewBox="0 0 240 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <filter id="searchlight-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <clipPath id="searchlight-almond">
            <path d="M62 58 Q120 14 178 58 Q120 102 62 58 Z" />
          </clipPath>
        </defs>

        {/* the beam: a soft slanted band of light sweeping the frame */}
        <g className="searchlight-beam">
          <polygon points="10,-20 90,-20 150,140 70,140" fill="#FFFFFF" opacity="0.85" filter="url(#searchlight-blur)" />
        </g>

        {/* the eye, blinking (agent-face-eyes) */}
        <g className="agent-face-eyes">
          <path d="M62 58 Q120 14 178 58 Q120 102 62 58 Z" fill="#F4F4F6" stroke="#0B0B10" strokeWidth="1.6" />
          <g clipPath="url(#searchlight-almond)">
            <g className="searchlight-iris">
              <circle cx="120" cy="58" r="22" fill="#0B0B10" />
              {ticks.map((deg) => (
                <rect
                  key={deg}
                  x="118.6"
                  y="38"
                  width="2.8"
                  height="7"
                  rx="0.8"
                  fill="#FFFFFF"
                  opacity="0.9"
                  transform={`rotate(${deg} 120 58)`}
                />
              ))}
              <circle cx="120" cy="58" r="8" fill="#FFFFFF" />
              <circle cx="120" cy="58" r="8" fill="none" stroke="#0B0B10" strokeWidth="1.5" />
            </g>
          </g>
        </g>
      </svg>

      <p className="absolute bottom-2.5 left-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
        <span className="searchlight-rec size-1.5 rounded-full bg-purple-light" aria-hidden="true" />
        {/* inverts against the beam, so it stays readable when the light passes over it */}
        <span className="text-white mix-blend-difference">{slogan}</span>
      </p>
    </div>
  )
}

/* Channels on the left feed one agent, which writes everything to one CRM (dark sections) */
export function AgentHub({ agentTitle }: { agentTitle?: string }) {
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
        <SearchlightEye slogan={hub.slogan} />
        <p className="label-white mt-5">[{hub.agentLabel}]</p>
        <p className="h4 text-white">{agentTitle ?? hub.agentTitle}</p>
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

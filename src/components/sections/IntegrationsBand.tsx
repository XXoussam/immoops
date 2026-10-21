import { INTEGRATIONS } from '../../lib/constants'

const CATEGORY_DOT: Record<string, string> = {
  crm:           '#60A5FA',
  llm:           '#C084FC',
  communication: '#10B981',
  automation:    '#F59E0B',
}

const doubled = [...INTEGRATIONS, ...INTEGRATIONS]

export function IntegrationsBand() {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, rgb(38, 18, 90) 0%, rgb(14, 6, 40) 45%, rgb(4, 2, 12) 100%)',
        paddingTop: '22px',
        paddingBottom: '26px',
      }}
    >
      {/* Label */}
      <p
        className="text-center font-sans font-semibold uppercase mb-4"
        style={{ fontSize: '0.65rem', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.25)' }}
      >
        Compatible avec vos outils
      </p>

      {/* Scrolling track */}
      <div className="relative">
        {/* Fade masks */}
        <div
          className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgb(25,11,62), transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, rgb(25,11,62), transparent)' }}
        />

        <div className="flex marquee-track" style={{ width: 'max-content' }}>
          {doubled.map((item, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-6 px-6">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block flex-shrink-0"
                  style={{
                    width: 6,
                    height: 6,
                    background: CATEGORY_DOT[item.category],
                    boxShadow: `0 0 6px ${CATEGORY_DOT[item.category]}`,
                  }}
                />
                <span
                  className="font-sans font-medium whitespace-nowrap"
                  style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)' }}
                >
                  {item.name}
                </span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '1rem' }}>·</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

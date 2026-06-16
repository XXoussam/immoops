import { LOGOS } from '../../lib/constants'

export function LogoStrip() {
  return (
    <section className="bg-white border-y border-gray-line py-10">
      <div className="container-main text-center">
        <p className="label-muted text-center mb-7">
          Conçu pour les agences immobilières qui veulent aller plus loin
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {LOGOS.map(name => (
            <span key={name} className="font-tight font-semibold text-sm text-ink/25 tracking-tight">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

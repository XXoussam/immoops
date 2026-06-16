import { HugeiconsIcon } from '@hugeicons/react'
import { PlayCircle02Icon } from '@hugeicons/core-free-icons'

export function VideoPlaceholder() {
  return (
    <section className="section bg-white">
      <div className="container-main">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="label">Voyez l'IA en action</span>
          <h2 className="h2 mb-4">
            Une démo vaut mille mots
          </h2>
          <p className="body2 mx-auto" style={{ maxWidth: 560 }}>
            Découvrez comment nos agents IA transforment concrètement le quotidien d'une agence immobilière.
          </p>
        </div>

        {/* Video placeholder */}
        <div
          className="relative w-full overflow-hidden bg-purple-dark rounded-card"
          style={{
            aspectRatio: '16 / 9',
            border: '1px solid rgba(109,74,255,0.2)',
          }}
        >
          {/* Subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(109,74,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(109,74,255,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Glow */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(109,74,255,0.18) 0%, transparent 70%)' }}
          />

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            {/* Play button */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(109,74,255,0.18)', border: '1px solid rgba(109,74,255,0.35)' }}
            >
              <HugeiconsIcon icon={PlayCircle02Icon} size={24} color="#ad88fc" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p
                className="font-tight text-white mb-1"
                style={{ fontWeight: 450, fontSize: '1.125rem', letterSpacing: '-0.01em' }}
              >
                Vidéo de démo, à venir
              </p>
              <p className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Votre vidéo motion sera placée ici
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

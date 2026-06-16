import { HugeiconsIcon } from '@hugeicons/react'
import { PlayCircle02Icon } from '@hugeicons/core-free-icons'
import { CHANNELS } from '../../lib/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function ChannelsSection() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="section bg-purple-dark">
      <div
        ref={ref}
        className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        {/* Heading — contained */}
        <div className="container-main text-center mb-14">
          <span className="label-white">Communication multicanale</span>
          <h2 className="h2-white mb-5">
            Plusieurs canaux, un seul<br />assistant IA
          </h2>
          <p className="body1-white max-w-[520px] mx-auto">
            Votre assistant IA gère les échanges sur tous les canaux : réponses instantanées,
            relances automatiques et qualification des prospects.
          </p>
        </div>

        {/* Grid — wider, less padding so videos breathe */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-10">
            {CHANNELS.map((ch) => (
              <div key={ch.label}>

                {/* Preview area */}
                <div
                  className="relative w-full overflow-hidden mb-5"
                  style={{
                    aspectRatio: '16 / 9',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ede8ff 0%, #ddd4ff 55%, #cfc4ff 100%)',
                  }}
                >
                  {ch.videoSrc ? (
                    <video
                      src={ch.videoSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: ch.videoPosition ?? 'center' }}
                    />
                  ) : (
                    <>
                      {/* Subtle grid */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-[0.07]"
                        style={{
                          backgroundImage:
                            'linear-gradient(rgba(109,74,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(109,74,255,1) 1px, transparent 1px)',
                          backgroundSize: '40px 40px',
                        }}
                      />
                      {/* Glow */}
                      <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{
                          width: '60%', height: '60%',
                          background: 'radial-gradient(ellipse, rgba(109,74,255,0.15) 0%, transparent 70%)',
                        }}
                      />
                      {/* Placeholder */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(109,74,255,0.12)', border: '1px solid rgba(109,74,255,0.28)' }}
                        >
                          <HugeiconsIcon icon={PlayCircle02Icon} size={22} color="#6D4AFF" strokeWidth={1.5} />
                        </div>
                        <p
                          className="font-tight text-center"
                          style={{ color: 'rgba(109,74,255,0.55)', fontSize: '0.75rem', letterSpacing: '0.04em' }}
                        >
                          Vidéo {ch.label}, à venir
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Label + description */}
                <p className="font-tight text-white mb-2" style={{ fontWeight: 600, fontSize: '1.25rem' }}>
                  {ch.label}
                </p>
                <p className="body2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {ch.description}
                </p>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

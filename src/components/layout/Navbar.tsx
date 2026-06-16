import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Menu01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { NAV_LINKS } from '../../lib/constants'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const go = (href: string) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className="fixed top-0 inset-x-0 z-50"
      style={{
        background: 'rgba(15, 17, 23, 0.35)',
        backdropFilter: 'blur(32px) saturate(200%)',
        WebkitBackdropFilter: 'blur(32px) saturate(200%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 32px rgba(0,0,0,0.2)',
      }}
    >
      <div className="container-main flex items-center justify-between h-[64px]">
        {/* Logo */}
        <a
          href="#"
          className="font-tight text-white"
          style={{ fontWeight: 600, fontSize: '1.1rem', letterSpacing: '-0.01em' }}
        >
          ImmoOps<span className="text-purple-light">AI</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(l => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="text-sm font-sans font-medium cursor-pointer transition-colors duration-200"
              style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,1)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => go('#contact')}
            className="text-sm font-sans font-medium cursor-pointer transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
          >
            Se connecter
          </button>
          <a href="#contact" className="btn-primary">
            Prendre contact
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden"
          style={{ color: 'rgba(255,255,255,0.7)' }}
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen
            ? <HugeiconsIcon icon={Cancel01Icon} size={20} color="rgba(255,255,255,0.7)" strokeWidth={1.5} />
            : <HugeiconsIcon icon={Menu01Icon} size={20} color="rgba(255,255,255,0.7)" strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="md:hidden px-5 py-4 space-y-3"
          style={{
            background: 'rgba(15, 17, 23, 0.95)',
            backdropFilter: 'blur(32px)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {NAV_LINKS.map(l => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="block w-full text-left text-sm font-sans py-2 transition-colors"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              {l.label}
            </button>
          ))}
          <a href="#contact" className="btn-primary w-full justify-center mt-2">Prendre contact</a>
        </div>
      )}
    </header>
  )
}

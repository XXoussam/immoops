import { Link } from 'react-router-dom'
import { FOOTER_COLS } from '../../lib/constants'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-line">
      <div className="container-main pt-16 pb-10">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-10 border-b border-gray-line2">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-tight font-bold text-[1.05rem] text-ink mb-3 inline-block" style={{ letterSpacing: '-0.03em' }}>
              ImmoOps<span className="text-purple">AI</span>
            </Link>
            <p className="text-sm text-gray-copy leading-relaxed mb-3">
              L'intelligence artificielle au service de l'immobilier.
            </p>
            <a
              href="mailto:saoudioussama13@gmail.com"
              className="text-sm text-purple hover:text-purple-hover transition-colors"
            >
              saoudioussama13@gmail.com
            </a>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <p className="label-muted mb-4">{col.heading}</p>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-copy hover:text-ink transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-copy">© 2025 ImmoOps AI. Tous droits réservés.</p>
          <div className="flex gap-5">
            <a href="/confidentialite" className="text-xs text-gray-copy hover:text-ink transition-colors">Confidentialité</a>
            <a href="/cookies" className="text-xs text-gray-copy hover:text-ink transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

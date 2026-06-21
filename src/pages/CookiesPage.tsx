import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export function CookiesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen pt-32 pb-24 px-5">
        <div className="w-full max-w-[720px] mx-auto">
          <span className="label mb-4 block">Légal</span>
          <h1 className="h3 mb-10">Politique de cookies</h1>

          <section className="mb-10">
            <h2 className="h4 mb-3">Qu'est-ce qu'un cookie ?</h2>
            <p className="body2 text-ink-body">
              Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site web. Il permet de mémoriser des informations sur votre navigation et d'améliorer votre expérience utilisateur.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Cookies utilisés sur ce site</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-line">
                    <th className="text-left py-3 pr-4 font-semibold text-ink">Type</th>
                    <th className="text-left py-3 pr-4 font-semibold text-ink">Finalité</th>
                    <th className="text-left py-3 font-semibold text-ink">Durée</th>
                  </tr>
                </thead>
                <tbody className="text-ink-body">
                  <tr className="border-b border-gray-line2">
                    <td className="py-3 pr-4">Essentiels</td>
                    <td className="py-3 pr-4">Fonctionnement du site, session utilisateur</td>
                    <td className="py-3">Session</td>
                  </tr>
                  <tr className="border-b border-gray-line2">
                    <td className="py-3 pr-4">Analytiques</td>
                    <td className="py-3 pr-4">Mesure d'audience anonymisée</td>
                    <td className="py-3">13 mois</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Fonctionnels</td>
                    <td className="py-3 pr-4">Mémorisation de vos préférences</td>
                    <td className="py-3">12 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Gestion de vos cookies</h2>
            <p className="body2 text-ink-body mb-3">
              Vous pouvez à tout moment modifier vos préférences en matière de cookies via les paramètres de votre navigateur :
            </p>
            <ul className="body2 text-ink-body list-disc pl-5 space-y-1">
              <li><a href="https://support.google.com/chrome/answer/95647" className="text-purple hover:text-purple-hover" target="_blank" rel="noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" className="text-purple hover:text-purple-hover" target="_blank" rel="noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" className="text-purple hover:text-purple-hover" target="_blank" rel="noreferrer">Safari</a></li>
              <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge" className="text-purple hover:text-purple-hover" target="_blank" rel="noreferrer">Microsoft Edge</a></li>
            </ul>
            <p className="body2 text-ink-body mt-3">
              La désactivation des cookies essentiels peut affecter le fonctionnement du site.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Contact</h2>
            <p className="body2 text-ink-body">
              Pour toute question relative à notre utilisation des cookies : <a href="mailto:saoudioussama13@gmail.com" className="text-purple hover:text-purple-hover">saoudioussama13@gmail.com</a>
            </p>
          </section>

          <p className="text-sm text-ink-body mt-12">Dernière mise à jour : juin 2025</p>
        </div>
      </main>
      <Footer />
    </>
  )
}

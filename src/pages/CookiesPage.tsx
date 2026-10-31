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
              Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site web. D'autres technologies, comme le stockage local du navigateur, permettent aussi de mémoriser des informations sur votre navigation.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Ce site ne dépose aucun cookie</h2>
            <p className="body2 text-ink-body">
              Le site immoops.com ne dépose aucun cookie et n'enregistre aucune donnée dans votre navigateur (ni cookie, ni stockage local). Nous n'utilisons aucun outil de mesure d'audience, aucune publicité ni aucun traceur de réseaux sociaux. C'est pourquoi aucun bandeau ne vous demande votre consentement.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Services tiers</h2>
            <p className="body2 text-ink-body mb-3">
              Certaines fonctionnalités font appel à des services extérieurs :
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-line">
                    <th className="text-left py-3 pr-4 font-semibold text-ink">Service</th>
                    <th className="text-left py-3 pr-4 font-semibold text-ink">Quand</th>
                    <th className="text-left py-3 font-semibold text-ink">Cookies</th>
                  </tr>
                </thead>
                <tbody className="text-ink-body">
                  <tr className="border-b border-gray-line2">
                    <td className="py-3 pr-4 align-top">Google Fonts</td>
                    <td className="py-3 pr-4 align-top">À l'affichage des pages, pour charger les polices de caractères</td>
                    <td className="py-3 align-top">Aucun. Votre adresse IP est transmise à Google pour servir les fichiers.</td>
                  </tr>
                  <tr className="border-b border-gray-line2">
                    <td className="py-3 pr-4 align-top">Calendly</td>
                    <td className="py-3 pr-4 align-top">Uniquement si vous cliquez pour réserver un créneau : vous quittez alors notre site pour calendly.com</td>
                    <td className="py-3 align-top">Ceux de Calendly, selon sa propre politique</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 align-top">Camille, notre assistante IA</td>
                    <td className="py-3 pr-4 align-top">Quand vous lui écrivez, lui envoyez une note vocale ou l'appelez</td>
                    <td className="py-3 align-top">
                      Aucun. Le traitement de vos messages est décrit dans notre <a href="/confidentialite" className="text-purple hover:text-purple-hover">politique de confidentialité</a>.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Gestion de vos cookies</h2>
            <p className="body2 text-ink-body mb-3">
              Ce site ne déposant aucun cookie, vous n'avez rien à paramétrer ici. Vous pouvez gérer les cookies des autres sites, dont Calendly, dans les paramètres de votre navigateur :
            </p>
            <ul className="body2 text-ink-body list-disc pl-5 space-y-1">
              <li><a href="https://support.google.com/chrome/answer/95647" className="text-purple hover:text-purple-hover" target="_blank" rel="noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" className="text-purple hover:text-purple-hover" target="_blank" rel="noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" className="text-purple hover:text-purple-hover" target="_blank" rel="noreferrer">Safari</a></li>
              <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge" className="text-purple hover:text-purple-hover" target="_blank" rel="noreferrer">Microsoft Edge</a></li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Évolution de cette politique</h2>
            <p className="body2 text-ink-body">
              Si nous ajoutons un jour un outil de mesure d'audience ou un autre traceur, cette page sera mise à jour et votre consentement vous sera demandé lorsque la loi l'exige.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Contact</h2>
            <p className="body2 text-ink-body">
              Pour toute question relative à notre utilisation des cookies : <a href="mailto:saoudioussama13@gmail.com" className="text-purple hover:text-purple-hover">saoudioussama13@gmail.com</a>
            </p>
          </section>

          <p className="text-sm text-ink-body mt-12">Dernière mise à jour : octobre 2026</p>
        </div>
      </main>
      <Footer />
    </>
  )
}

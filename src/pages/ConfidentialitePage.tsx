import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export function ConfidentialitePage() {
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen pt-32 pb-24 px-5">
        <div className="w-full max-w-[720px] mx-auto">
          <span className="label mb-4 block">Légal</span>
          <h1 className="h3 mb-10">Politique de confidentialité</h1>

          <section className="mb-10">
            <h2 className="h4 mb-3">Responsable du traitement</h2>
            <p className="body2 text-ink-body">
              ImmoOps AI, représenté par Oussama Saoudi, est responsable du traitement de vos données personnelles. Contact : <a href="mailto:saoudioussama13@gmail.com" className="text-purple hover:text-purple-hover">saoudioussama13@gmail.com</a>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Données collectées</h2>
            <p className="body2 text-ink-body mb-3">Nous collectons uniquement les données nécessaires à la fourniture de nos services :</p>
            <ul className="body2 text-ink-body list-disc pl-5 space-y-1">
              <li>Données de contact (nom, adresse e-mail) lors d'une prise de contact</li>
              <li>Données de navigation (pages visitées, durée des sessions) via des outils d'analyse anonymisés</li>
              <li>Données saisies dans nos agents conversationnels (chatbots, agents vocaux)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Finalités du traitement</h2>
            <ul className="body2 text-ink-body list-disc pl-5 space-y-1">
              <li>Répondre à vos demandes de contact et de démonstration</li>
              <li>Améliorer nos services et l'expérience utilisateur</li>
              <li>Vous envoyer des informations commerciales (avec votre consentement)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Base légale</h2>
            <p className="body2 text-ink-body">
              Le traitement de vos données repose sur votre consentement (art. 6.1.a RGPD) et sur notre intérêt légitime à améliorer nos services (art. 6.1.f RGPD).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Durée de conservation</h2>
            <p className="body2 text-ink-body">
              Vos données sont conservées pendant 3 ans à compter du dernier contact, sauf obligation légale contraire.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Vos droits</h2>
            <p className="body2 text-ink-body mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="body2 text-ink-body list-disc pl-5 space-y-1">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement (droit à l'oubli)</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition au traitement</li>
            </ul>
            <p className="body2 text-ink-body mt-3">
              Pour exercer ces droits, contactez-nous à : <a href="mailto:saoudioussama13@gmail.com" className="text-purple hover:text-purple-hover">saoudioussama13@gmail.com</a>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Partage des données</h2>
            <p className="body2 text-ink-body">
              Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec nos sous-traitants techniques (hébergement, IA) dans le strict respect du RGPD et via des accords de traitement des données appropriés.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Réclamation</h2>
            <p className="body2 text-ink-body">
              Vous avez le droit de déposer une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" className="text-purple hover:text-purple-hover" target="_blank" rel="noreferrer">www.cnil.fr</a>
            </p>
          </section>

          <p className="text-sm text-ink-body mt-12">Dernière mise à jour : juin 2025</p>
        </div>
      </main>
      <Footer />
    </>
  )
}

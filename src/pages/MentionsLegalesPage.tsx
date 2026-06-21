import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export function MentionsLegalesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen pt-32 pb-24 px-5">
        <div className="w-full max-w-[720px] mx-auto">
          <span className="label mb-4 block">Légal</span>
          <h1 className="h3 mb-10">Mentions légales</h1>

          <section className="mb-10">
            <h2 className="h4 mb-3">Éditeur du site</h2>
            <p className="body2 text-ink-body">
              ImmoOps AI<br />
              Responsable de publication : Oussama Saoudi<br />
              Contact : <a href="mailto:saoudioussama13@gmail.com" className="text-purple hover:text-purple-hover">saoudioussama13@gmail.com</a>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Hébergement</h2>
            <p className="body2 text-ink-body">
              Ce site est hébergé par Netlify, Inc.<br />
              512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.<br />
              Site web : <a href="https://www.netlify.com" className="text-purple hover:text-purple-hover" target="_blank" rel="noreferrer">www.netlify.com</a>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Propriété intellectuelle</h2>
            <p className="body2 text-ink-body">
              L'ensemble des contenus présents sur ce site (textes, images, logos, vidéos, etc.) est la propriété exclusive d'ImmoOps AI et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable écrite.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Limitation de responsabilité</h2>
            <p className="body2 text-ink-body">
              ImmoOps AI s'efforce de maintenir les informations publiées sur ce site à jour et exactes. Toutefois, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des informations diffusées. L'utilisation de ces informations se fait sous la seule responsabilité de l'utilisateur.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="h4 mb-3">Droit applicable</h2>
            <p className="body2 text-ink-body">
              Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </section>

          <p className="text-sm text-ink-body mt-12">Dernière mise à jour : juin 2025</p>
        </div>
      </main>
      <Footer />
    </>
  )
}

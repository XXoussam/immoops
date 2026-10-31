import { Link } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { CamilleFace } from '../components/demo/CamilleFace'
import { CAL_URL, NOT_FOUND_PAGE } from '../lib/constants'

/* Unknown URLs: Camille looks around for the missing page (her eyes follow the cursor) */
export function NotFoundPage() {
  const copy = NOT_FOUND_PAGE
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <div className="container-main flex min-h-screen flex-col items-center justify-center pb-24 pt-32 text-center">
          <CamilleFace size={88} />
          <span className="label mb-3 mt-8">[{copy.label}]</span>
          <h1 className="h2 mb-4">{copy.title}</h1>
          <p className="body1 mb-10 max-w-[440px] text-ink-body">{copy.text}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/" className="btn-primary">{copy.home}</Link>
            <Link to="/demos" className="btn-outline">{copy.demos}</Link>
          </div>
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="body2 mt-6 text-purple hover:text-purple-hover">
            {copy.booking} →
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}

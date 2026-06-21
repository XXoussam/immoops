import { Routes, Route } from 'react-router-dom'
import { PixelCursorTrail } from './components/ui/pixel-trail'
import { HomePage } from './pages/HomePage'
import { DemosPage } from './pages/DemosPage'
import { MentionsLegalesPage } from './pages/MentionsLegalesPage'
import { ConfidentialitePage } from './pages/ConfidentialitePage'
import { CookiesPage } from './pages/CookiesPage'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { BlogPage } from './pages/BlogPage'
import { EtudesDeCasPage } from './pages/EtudesDeCasPage'

function App() {
  return (
    <>
      <PixelCursorTrail />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demos" element={<DemosPage />} />
        <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        <Route path="/confidentialite" element={<ConfidentialitePage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/etudes-de-cas" element={<EtudesDeCasPage />} />
        <Route path="/webinaires" element={<ComingSoonPage />} />
        <Route path="/documentation" element={<ComingSoonPage />} />
      </Routes>
    </>
  )
}

export default App

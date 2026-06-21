import { Routes, Route } from 'react-router-dom'
import { PixelCursorTrail } from './components/ui/pixel-trail'
import { HomePage } from './pages/HomePage'
import { DemosPage } from './pages/DemosPage'
import { MentionsLegalesPage } from './pages/MentionsLegalesPage'
import { ConfidentialitePage } from './pages/ConfidentialitePage'
import { CookiesPage } from './pages/CookiesPage'
import { ComingSoonPage } from './pages/ComingSoonPage'

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
        <Route path="/blog" element={<ComingSoonPage />} />
        <Route path="/etudes-de-cas" element={<ComingSoonPage />} />
        <Route path="/webinaires" element={<ComingSoonPage />} />
        <Route path="/documentation" element={<ComingSoonPage />} />
      </Routes>
    </>
  )
}

export default App

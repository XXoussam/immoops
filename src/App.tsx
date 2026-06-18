import { Routes, Route } from 'react-router-dom'
import { PixelCursorTrail } from './components/ui/pixel-trail'
import { HomePage } from './pages/HomePage'
import { DemosPage } from './pages/DemosPage'

function App() {
  return (
    <>
      <PixelCursorTrail />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demos" element={<DemosPage />} />
        <Route path="/demos/:slug" element={<DemosPage />} />
      </Routes>
    </>
  )
}

export default App

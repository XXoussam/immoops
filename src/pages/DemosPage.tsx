import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { DemosHero } from '../components/sections/DemosHero'
import { ChannelTabs } from '../components/sections/ChannelTabs'
import { UnifiedCrm } from '../components/sections/UnifiedCrm'
import { VirtualTour } from '../components/sections/VirtualTour'
import { CTA } from '../components/sections/CTA'

/* Where the agent works (every channel) and how it all lands in one CRM; the live chat and call are in the bubbles */
export function DemosPage() {
  return (
    <>
      <Navbar />
      <main>
        <DemosHero />
        <ChannelTabs />
        <UnifiedCrm />
        <VirtualTour />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

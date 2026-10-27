import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { DemosHero } from '../components/sections/DemosHero'
import { ChannelTabs } from '../components/sections/ChannelTabs'
import { UnifiedCrm } from '../components/sections/UnifiedCrm'
import { TryLive } from '../components/sections/TryLive'
import { VirtualTour } from '../components/sections/VirtualTour'
import { CTA } from '../components/sections/CTA'

/* Where the agents work (every channel) and how it all lands in one CRM; the live chat and call run in the bubbles */
export function DemosPage() {
  return (
    <>
      <Navbar />
      <main>
        <DemosHero />
        <ChannelTabs />
        <UnifiedCrm />
        <TryLive />
        <VirtualTour />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

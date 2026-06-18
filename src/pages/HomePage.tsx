import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/sections/Hero'
import { ValueProp } from '../components/sections/ValueProp'
import { Services } from '../components/sections/Services'
import { Demos } from '../components/sections/Demos'
import { ChannelsSection } from '../components/sections/ChannelsSection'
import { SmartOps } from '../components/sections/SmartOps'
import { About } from '../components/sections/About'
import { LogoStrip } from '../components/sections/LogoStrip'
import { FAQ } from '../components/sections/FAQ'
import { CTA } from '../components/sections/CTA'

export function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ValueProp />
        <Services />
        <Demos />
        <ChannelsSection />
        <SmartOps />
        <About />
        <LogoStrip />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

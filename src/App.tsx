import { Analytics } from "@vercel/analytics/react"
import { Nav } from "@/components/Nav"
import { Hero } from "@/components/Hero"
import { ProtocolLogos } from "@/components/ProtocolLogos"
import { HowItWorks } from "@/components/HowItWorks"
import { Features } from "@/components/Features"
import { FAQ } from "@/components/FAQ"
import { ClosingCta } from "@/components/ClosingCta"
import { Footer } from "@/components/Footer"

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProtocolLogos />
        <HowItWorks />
        <Features />
        <FAQ />
        <ClosingCta />
      </main>
      <Footer />
      <Analytics />
    </>
  )
}

export default App

import { Analytics } from "@vercel/analytics/react"
import { Hero } from "@/components/Hero"
import { HowItWorks } from "@/components/HowItWorks"
import { LiveDemo } from "@/components/LiveDemo"
import { ProtocolLogos } from "@/components/ProtocolLogos"
import { Features } from "@/components/Features"
import { ClosingCta } from "@/components/ClosingCta"
import { FAQ } from "@/components/FAQ"

function App() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <LiveDemo />
      <ProtocolLogos />
      <Features />
      <ClosingCta />
      <FAQ />
      <Analytics />
    </>
  )
}

export default App

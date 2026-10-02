import { Analytics } from "@vercel/analytics/react"
import { Hero } from "@/components/Hero"
import { HowItWorks } from "@/components/HowItWorks"
import { ProtocolLogos } from "@/components/ProtocolLogos"
import { Features } from "@/components/Features"
import { ClosingCta } from "@/components/ClosingCta"
import { FAQ } from "@/components/FAQ"

function App() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ProtocolLogos />
      <Features />
      <ClosingCta />
      <FAQ />
      <footer className="flex justify-center px-6 pb-12 pt-4">
        <a href="https://codehype.ai/product/meridian?utm_source=codehype_badge" target="_blank" rel="noopener noreferrer">
          <img
            src="https://codehype.ai/badges/meridian.svg?variant=find-us&v=20"
            alt="Featured on CodeHype"
            width={180}
            height={65}
            loading="lazy"
            decoding="async"
            style={{ display: "inline-block", border: 0, width: "100%", maxWidth: 180, height: "auto", maxHeight: 65 }}
          />
        </a>
      </footer>
      <Analytics />
    </>
  )
}

export default App

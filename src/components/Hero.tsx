import { Container, XLogo } from "@/components/Section"
import { WaitlistForm } from "@/components/WaitlistForm"
import { SocialProof } from "@/components/SocialProof"
import { TileWall } from "@/components/hero/TileWall"
import { ScopeGrid } from "@/components/hero/ScopeGrid"

export function Hero() {
  return (
    <section id="top" className="hero-bg grain relative isolate overflow-hidden text-white">
      <Container className="relative z-10 flex flex-col items-center pt-32 text-center sm:pt-40">
        <a
          href="https://x.com/meridian_thesis"
          target="_blank"
          rel="noopener noreferrer"
          className="animate-fade-rise inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] py-1 pl-1 pr-3.5 text-xs text-white/75 backdrop-blur transition-colors hover:border-white/30 hover:text-white"
        >
          <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-night">
            Private beta
          </span>
          Prompt-to-trade for DeFi
          <XLogo size={11} />
        </a>

        <h1 className="animate-fade-rise-delay mt-8 max-w-5xl text-[3rem] leading-[0.95] tracking-[-0.045em] sm:text-7xl md:text-[6.5rem]">
          Form your thesis.
          <br />
          <span className="text-white/45">Execute it.</span> All at once.
        </h1>

        <p className="animate-fade-rise-delay mt-7 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
          Say what you believe in plain English. Meridian turns it into an executable trade across
          every major protocol, with the risk shown before you sign.
        </p>

        <WaitlistForm id="waitlist" tone="dark" />
        <SocialProof tone="dark" />
      </Container>

      <div className="animate-fade-rise-delay-3 relative mt-6 sm:mt-0">
        <TileWall />
      </div>

      <div className="relative z-10 -mt-10 sm:-mt-6">
        <ScopeGrid />
      </div>

      {/* fade into the light page, like Basepoint */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper"
        aria-hidden="true"
      />
    </section>
  )
}

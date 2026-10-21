import { Container } from "@/components/Section"
import { WaitlistForm } from "@/components/WaitlistForm"
import { SocialProof } from "@/components/SocialProof"
import { SplitWords } from "@/components/motion/SplitWords"
import { ThesisDemo } from "@/components/ThesisDemo"

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-36">
      <div className="bg-grid grid-drift pointer-events-none absolute inset-0 -z-0" aria-hidden="true" />
      {/* slow floating light, behind everything */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden" aria-hidden="true">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
      </div>

      <Container className="relative flex flex-col items-center text-center">
        <span className="animate-fade-rise inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-xs text-ink-2">
          <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-ink">
            Private beta
          </span>
          The prompt-to-trade terminal for DeFi
        </span>

        <h1 className="mt-7 max-w-4xl text-[2.6rem] leading-[1] text-ink sm:text-6xl md:text-7xl">
          <SplitWords
            baseDelay={120}
            lines={[
              [{ text: "Form your thesis." }],
              [{ text: "Execute it." }, { text: "All at once.", className: "text-shimmer" }],
            ]}
          />
        </h1>

        <p className="animate-fade-rise-delay-2 mt-6 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">
          Say what you believe in plain English. Meridian turns it into an executable
          trade across every major protocol, with the risk shown before you sign.
        </p>

        <WaitlistForm id="waitlist" />
        <SocialProof />

        {/* the thesis types itself, then Meridian shows what it would do */}
        <div className="animate-fade-rise-delay-3 mt-12 w-full max-w-xl">
          <ThesisDemo />
        </div>
      </Container>
    </section>
  )
}

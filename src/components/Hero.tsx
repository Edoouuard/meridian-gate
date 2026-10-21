import { Container } from "@/components/Section"
import { WaitlistForm } from "@/components/WaitlistForm"
import { SocialProof } from "@/components/SocialProof"

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-36">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-0" aria-hidden="true" />
      {/* soft accent bloom */}
      <div
        className="pointer-events-none absolute left-1/2 top-[70%] -z-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #dfe5ff, transparent)" }}
        aria-hidden="true"
      />

      <Container className="relative flex flex-col items-center text-center">
        <span className="animate-fade-rise inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-xs text-ink-2">
          <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-ink">
            Private beta
          </span>
          The prompt-to-trade terminal for DeFi
        </span>

        <h1 className="animate-fade-rise-delay mt-7 max-w-4xl text-[2.6rem] leading-[1] text-ink sm:text-6xl md:text-7xl">
          Form your thesis.
          <br />
          Execute it. <span className="text-accent">All at once.</span>
        </h1>

        <p className="animate-fade-rise-delay mt-6 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">
          Say what you believe in plain English. Meridian turns it into an executable
          trade across every major protocol, with the risk shown before you sign.
        </p>

        <WaitlistForm id="waitlist" />
        <SocialProof />
      </Container>

    </section>
  )
}

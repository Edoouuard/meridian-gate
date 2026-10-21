import { ArrowRight } from "lucide-react"
import { Container, SectionHeading } from "@/components/Section"
import { Reveal } from "@/components/Reveal"

const STEPS = [
  {
    n: "01",
    title: "State your thesis",
    body: "Type what you believe: “go long ETH,” “hedge my portfolio,” “lock in fixed yield.” No forms, no protocol-hopping.",
    example: "› hedge my portfolio against ETH downside",
  },
  {
    n: "02",
    title: "Meridian finds the trade",
    body: "It scans Aave, Morpho, Lido, Pendle, Hyperliquid, Uniswap and more, then proposes the clearest path to execute it.",
    example: "scanned 6 protocols · 3 routes · best: Hyperliquid",
  },
  {
    n: "03",
    title: "Review, then act",
    body: "See the exact positions, the risk and the route before you sign anything. Nothing executes without you.",
    example: "net delta −0.03 · health 1.81 · awaiting signature",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-night py-20 text-white sm:py-24">
      <div className="bg-grid-night pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[620px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #2f54ff, transparent)" }}
        aria-hidden="true"
      />

      <Container className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            tone="dark"
            eyebrow="How it works"
            title={
              <>
                From thesis to trade,
                <br />
                in three steps.
              </>
            }
            sub="Meridian sits between what you believe and the dozen protocols you'd otherwise open to act on it."
          />
          <a
            href="#waitlist"
            className="group mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-ink transition-colors hover:bg-accent hover:text-white"
          >
            Get early access
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>

        <div className="flex flex-col border-b border-night-line">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 sm:gap-x-6 border-t border-night-line py-6">
                <span className="draw-line absolute -top-px left-0 h-px w-full bg-accent" style={{ transitionDelay: `${150 + i * 120}ms` }} />
                <span className="font-mono text-sm text-accent">{s.n}</span>
                <div>
                  <h3 className="text-2xl tracking-tight text-white">{s.title}</h3>
                  <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/60">{s.body}</p>
                  <div className="mt-5 inline-flex max-w-full rounded-lg border border-night-line bg-night-2 px-3 py-2 font-mono text-[11px] text-white/70">
                    <span className="truncate">{s.example}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

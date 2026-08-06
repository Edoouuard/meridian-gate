import { useInView } from "@/hooks/useInView"

const STEPS = [
  {
    n: "01",
    title: "State your thesis",
    body: "Type what you believe — “go long ETH,” “hedge my portfolio,” “lock in fixed yield.” No forms, no protocol-hopping.",
  },
  {
    n: "02",
    title: "Meridian finds the trade",
    body: "We scan Aave, Morpho, Lido, Pendle, Hyperliquid, Uniswap and more to propose the clearest path to execute it.",
  },
  {
    n: "03",
    title: "Review, then act",
    body: "See the exact positions, the risk, and the route before you sign anything. Nothing executes without you.",
  },
]

export function HowItWorks() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section className="relative bg-background border-t border-border">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-8 py-28 ${inView ? "animate-fade-rise" : "opacity-0"}`}
      >
        <h2
          className="text-3xl sm:text-4xl text-foreground max-w-md"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          From <em className="not-italic text-muted-foreground">thesis</em> to
          trade, in three steps.
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {STEPS.map((step) => (
            <div key={step.n} className="liquid-glass rounded-2xl p-8">
              <span className="text-sm text-muted-foreground">{step.n}</span>
              <h3
                className="text-2xl text-foreground mt-4"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useInView } from "@/hooks/useInView"

const FEATURES = [
  {
    title: "Portfolio, unified",
    body: "Every position, every chain, one clean view — not twelve open tabs.",
  },
  {
    title: "Risk you can see",
    body: "Health factor, net delta, concentration — visualized before it becomes a problem.",
  },
  {
    title: "Signal over noise",
    body: "Curated DeFi news and alpha, without the group-chat chaos.",
  },
]

export function Features() {
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
          Built for{" "}
          <em className="not-italic text-muted-foreground">on-chain clarity.</em>
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="liquid-glass rounded-2xl p-8">
              <h3
                className="text-2xl text-foreground"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

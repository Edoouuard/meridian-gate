import { Reveal } from "@/components/Reveal"

const FEATURES = [
  {
    title: "Portfolio, unified",
    body: "Every position, every chain, in one clean view instead of a dozen open tabs.",
  },
  {
    title: "Risk you can see",
    body: "Health factor, net delta, and concentration, visualized before they become a problem.",
  },
  {
    title: "Signal over noise",
    body: "Curated DeFi news and alpha, without the group-chat chaos.",
  },
]

export function Features() {
  return (
    <section className="relative bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-8 py-28">
        <Reveal>
          <h2
            className="text-3xl sm:text-4xl text-foreground max-w-md"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Built for{" "}
            <em className="not-italic text-muted-foreground">
              on-chain clarity.
            </em>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={120 + i * 130}>
              <div className="liquid-glass rounded-2xl p-8 h-full">
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

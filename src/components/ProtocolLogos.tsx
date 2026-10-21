import { Container } from "@/components/Section"
import { Reveal } from "@/components/Reveal"

const PROTOCOLS = [
  { name: "Aave", src: "https://icons.llamao.fi/icons/protocols/aave" },
  { name: "Morpho", src: "https://icons.llamao.fi/icons/protocols/morpho" },
  { name: "Lido", src: "https://icons.llamao.fi/icons/protocols/lido" },
  { name: "Pendle", src: "https://icons.llamao.fi/icons/protocols/pendle" },
  { name: "Hyperliquid", src: "https://icons.llamao.fi/icons/protocols/hyperliquid" },
  { name: "Uniswap", src: "https://icons.llamao.fi/icons/protocols/uniswap" },
]

const CHAINS = [
  { name: "Ethereum", src: "https://icons.llamao.fi/icons/chains/rsz_ethereum" },
  { name: "Base", src: "https://icons.llamao.fi/icons/chains/rsz_base" },
  { name: "Arbitrum", src: "https://icons.llamao.fi/icons/chains/rsz_arbitrum" },
  { name: "Optimism", src: "https://icons.llamao.fi/icons/chains/rsz_optimism" },
  { name: "Polygon", src: "https://icons.llamao.fi/icons/chains/rsz_polygon" },
  { name: "Avalanche", src: "https://icons.llamao.fi/icons/chains/rsz_avalanche" },
]

const STATS = [
  { value: String(PROTOCOLS.length), label: "Protocols in scope" },
  { value: String(CHAINS.length), label: "Chains supported" },
  { value: "1", label: "Sentence to a trade" },
  { value: "0", label: "Funds in our custody" },
]

function Chip({ name, src }: { name: string; src: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 px-6 sm:px-8">
      <img src={src} alt="" loading="lazy" className="h-7 w-7 rounded-full object-contain grayscale-[30%]" />
      <span className="font-display text-lg font-medium tracking-tight text-ink/80">{name}</span>
    </div>
  )
}

export function ProtocolLogos() {
  const items = [...PROTOCOLS, ...CHAINS]
  return (
    <section id="coverage" className="border-y border-line bg-surface">
      <Container className="pt-12 sm:pt-14">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
          One terminal across the protocols and chains you already use
        </p>
      </Container>

      <div className="marquee-mask mt-8 overflow-hidden" aria-label={items.map((i) => i.name).join(", ")}>
        <div className="animate-marquee flex w-max">
          {[...items, ...items].map((item, i) => (
            <Chip key={`${item.name}-${i}`} {...item} />
          ))}
        </div>
      </div>

      <Container className="pb-12 pt-12 sm:pb-14">
        <div className="grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="border-b border-r border-line px-5 py-6 sm:px-7 sm:py-8">
              <div className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm text-ink-2">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

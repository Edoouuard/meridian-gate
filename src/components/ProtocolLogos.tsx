import { Reveal } from "@/components/Reveal"

const PROTOCOLS = [
  { name: "Aave", src: "https://icons.llamao.fi/icons/protocols/aave" },
  { name: "Morpho", src: "https://icons.llamao.fi/icons/protocols/morpho" },
  { name: "Lido", src: "https://icons.llamao.fi/icons/protocols/lido" },
  { name: "Pendle", src: "https://icons.llamao.fi/icons/protocols/pendle" },
  {
    name: "Hyperliquid",
    src: "https://icons.llamao.fi/icons/protocols/hyperliquid",
  },
  { name: "Uniswap", src: "https://icons.llamao.fi/icons/protocols/uniswap" },
]

const CHAINS = [
  { name: "Ethereum", src: "https://icons.llamao.fi/icons/chains/rsz_ethereum" },
  { name: "Base", src: "https://icons.llamao.fi/icons/chains/rsz_base" },
  { name: "Arbitrum", src: "https://icons.llamao.fi/icons/chains/rsz_arbitrum" },
  { name: "Optimism", src: "https://icons.llamao.fi/icons/chains/rsz_optimism" },
  { name: "Polygon", src: "https://icons.llamao.fi/icons/chains/rsz_polygon" },
  {
    name: "Avalanche",
    src: "https://icons.llamao.fi/icons/chains/rsz_avalanche",
  },
]

function LogoChip({ name, src }: { name: string; src: string }) {
  return (
    <div
      title={name}
      className="liquid-glass rounded-full w-12 h-12 flex items-center justify-center"
    >
      <img
        src={src}
        alt={name}
        loading="lazy"
        className="w-6 h-6 rounded-full object-contain"
      />
    </div>
  )
}

export function ProtocolLogos() {
  return (
    <section className="relative bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <Reveal>
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground text-center">
            Already in scope
          </p>
        </Reveal>

        <Reveal
          delay={120}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          {[...PROTOCOLS, ...CHAINS].map((item) => (
            <LogoChip key={item.name} {...item} />
          ))}
          <div
            title="More protocols and chains coming"
            className="liquid-glass rounded-full w-12 h-12 flex items-center justify-center text-foreground text-lg"
          >
            +
          </div>
        </Reveal>
      </div>
    </section>
  )
}

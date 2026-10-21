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

function Cell({ name, src, size = "lg" }: { name: string; src: string; size?: "lg" | "sm" }) {
  return (
    <div
      className={`group flex items-center justify-center gap-3 border-b border-r border-white/10 transition-colors hover:bg-white/[0.04] ${
        size === "lg" ? "h-24 sm:h-28" : "h-16 sm:h-20"
      }`}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        className={`rounded-full object-contain opacity-80 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 ${
          size === "lg" ? "h-8 w-8" : "h-6 w-6"
        }`}
      />
      <span
        className={`font-display font-medium tracking-tight text-white/80 transition-colors group-hover:text-white ${
          size === "lg" ? "text-lg sm:text-xl" : "text-sm sm:text-base"
        }`}
      >
        {name}
      </span>
    </div>
  )
}

/** "Already in scope": Basepoint's bordered logo grid, on the dark hero. */
export function ScopeGrid() {
  return (
    <div id="coverage" className="relative pb-28 pt-6 sm:pb-36">
      <Container>
        <Reveal>
          <h2 className="text-center text-2xl text-white sm:text-[28px]">Already in scope</h2>
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-white/55">
            One terminal across the protocols and chains you already use. More are being added.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="mx-auto mt-10 max-w-4xl border-l border-t border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-3">
              {PROTOCOLS.map((p) => (
                <Cell key={p.name} {...p} />
              ))}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6">
              {CHAINS.map((c) => (
                <Cell key={c.name} {...c} size="sm" />
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  )
}

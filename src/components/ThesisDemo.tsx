import { useEffect, useState } from "react"

const DEMOS = [
  {
    thesis: "Hedge my portfolio against ETH downside",
    protocol: "Hyperliquid",
    steps: [
      "Short 2.5 ETH perpetual, sized to your spot exposure",
      "Post 950 USDC margin for a safe 12x liquidation buffer",
      "Set a stop-loss at $4,850 in case ETH reverses hard",
    ],
    stats: [
      { label: "Net delta", value: "−0.03" },
      { label: "Hedge cost", value: "0.018% / 8h" },
    ],
  },
  {
    thesis: "Lock in 8% fixed yield on USDC",
    protocol: "Pendle",
    steps: [
      "Scanned 14 fixed-rate pools across Pendle and Aave",
      "Buy PT-USDC at a fixed discount, no rate exposure",
      "Hold to maturity for a return that's locked in today",
    ],
    stats: [
      { label: "Fixed APY", value: "8.4%" },
      { label: "vs Aave variable", value: "+3.6%" },
    ],
  },
  {
    thesis: "Go long ETH with 2x leverage",
    protocol: "Aave",
    steps: [
      "Supply 5 ETH as collateral, ~$22,500 at spot",
      "Borrow $22,500 USDC at 50% LTV, well under the 82% liquidation line",
      "Swap the USDC into 5 more ETH and redeposit for 10 ETH total",
    ],
    stats: [
      { label: "Leverage", value: "2.0x" },
      { label: "Health factor", value: "1.65" },
    ],
  },
  {
    thesis: "Find me the best yield on my idle USDC",
    protocol: "Morpho",
    steps: [
      "Scanned yield across Aave, Compound, and Morpho vaults",
      "Deposit 5,000 USDC into the vault with the best risk-adjusted rate",
      "Rate auto-rebalances as liquidity shifts, nothing for you to manage",
    ],
    stats: [
      { label: "Net APY", value: "9.1%" },
      { label: "vs Aave direct", value: "+2.4%" },
    ],
  },
]

const TYPE_SPEED = 45
const DELETE_SPEED = 25
const RESULT_DELAY_MS = 450
const RESULT_HOLD_MS = 3400

const STEP_ANIM = [
  "animate-fade-rise",
  "animate-fade-rise-delay",
  "animate-fade-rise-delay-2",
]

type Phase = "typing" | "result" | "holding" | "deleting"

export function ThesisDemo() {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState("")
  const [phase, setPhase] = useState<Phase>("typing")

  const demo = DEMOS[index]

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    if (phase === "typing") {
      if (text.length < demo.thesis.length) {
        timeout = setTimeout(
          () => setText(demo.thesis.slice(0, text.length + 1)),
          TYPE_SPEED
        )
      } else {
        timeout = setTimeout(() => setPhase("result"), RESULT_DELAY_MS)
      }
    } else if (phase === "result") {
      timeout = setTimeout(() => setPhase("holding"), RESULT_HOLD_MS)
    } else if (phase === "holding") {
      timeout = setTimeout(() => setPhase("deleting"), 0)
    } else {
      if (text.length > 0) {
        timeout = setTimeout(
          () => setText(text.slice(0, -1)),
          DELETE_SPEED
        )
      } else {
        setIndex((i) => (i + 1) % DEMOS.length)
        setPhase("typing")
      }
    }

    return () => clearTimeout(timeout)
  }, [text, phase, demo.thesis])

  const showResult = phase === "result" || phase === "holding"

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="liquid-glass rounded-3xl sm:rounded-full flex items-center px-5 py-4 sm:px-8 sm:py-6 min-h-[3.75rem] sm:min-h-[4.5rem]">
        <span className="text-base sm:text-xl text-foreground break-words min-w-0">
          {text}
        </span>
        <span className="inline-block w-[2px] h-5 sm:h-6 bg-foreground ml-1 shrink-0 animate-pulse" />
      </div>

      <div
        className="grid transition-all duration-500 ease-out"
        style={{
          gridTemplateRows: showResult ? "1fr" : "0fr",
          opacity: showResult ? 1 : 0,
          marginTop: showResult ? "1rem" : "0rem",
        }}
      >
        <div className="overflow-hidden min-h-0">
          <div
            key={index}
            className="liquid-glass rounded-2xl p-5 sm:p-6 text-left"
          >
            <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
              {demo.protocol}
            </span>

            <ol className="mt-3 flex flex-col gap-2">
              {demo.steps.map((step, i) => (
                <li
                  key={step}
                  className={`flex items-start gap-3 text-foreground text-sm sm:text-base ${STEP_ANIM[i]}`}
                >
                  <span className="text-muted-foreground shrink-0">
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-4 pt-4 border-t border-border">
              {demo.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                  <div
                    className="text-foreground text-lg sm:text-xl mt-0.5"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

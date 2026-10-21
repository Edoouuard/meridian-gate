import { useEffect, useState } from "react"
import { ArrowUp, Check, ShieldCheck } from "lucide-react"

const DEMOS = [
  {
    thesis: "Hedge my portfolio against ETH downside",
    protocol: "Hyperliquid",
    action: "Short ETH-PERP",
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
    action: "Buy PT-USDC",
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
    action: "Loop ETH",
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
    action: "Deposit to vault",
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

const PROTOCOL_ICON: Record<string, string> = {
  Hyperliquid: "https://icons.llamao.fi/icons/protocols/hyperliquid",
  Pendle: "https://icons.llamao.fi/icons/protocols/pendle",
  Aave: "https://icons.llamao.fi/icons/protocols/aave",
  Morpho: "https://icons.llamao.fi/icons/protocols/morpho",
}

const TYPE_SPEED = 42
const DELETE_SPEED = 18
const RESULT_DELAY_MS = 450
const RESULT_HOLD_MS = 3800

const STEP_ANIM = ["animate-fade-rise", "animate-fade-rise-delay", "animate-fade-rise-delay-2"]

type Phase = "typing" | "result" | "holding" | "deleting"

/** Event the live terminal listens to: run this thesis in the demo. */
export const RUN_THESIS_EVENT = "meridian:run-thesis"

export function ThesisDemo() {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState("")
  const [phase, setPhase] = useState<Phase>("typing")

  const demo = DEMOS[index]

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    if (phase === "typing") {
      if (text.length < demo.thesis.length) {
        timeout = setTimeout(() => setText(demo.thesis.slice(0, text.length + 1)), TYPE_SPEED)
      } else {
        timeout = setTimeout(() => setPhase("result"), RESULT_DELAY_MS)
      }
    } else if (phase === "result") {
      timeout = setTimeout(() => setPhase("holding"), RESULT_HOLD_MS)
    } else if (phase === "holding") {
      timeout = setTimeout(() => setPhase("deleting"), 0)
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), DELETE_SPEED)
      } else {
        setIndex((i) => (i + 1) % DEMOS.length)
        setPhase("typing")
      }
    }

    return () => clearTimeout(timeout)
  }, [text, phase, demo.thesis])

  const showResult = phase === "result" || phase === "holding"

  return (
    <div className="flex min-h-[340px] w-full flex-col sm:min-h-[310px]">
      {/* Prompt bar: the thesis types itself */}
      <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-line bg-surface px-4 py-3.5 shadow-[0_10px_30px_-18px_rgb(10_17_24/0.35)] sm:px-5">
        <span className="sheen pointer-events-none absolute inset-0" aria-hidden="true" />
        <span className="font-mono text-xs text-accent">›</span>
        <span className="min-w-0 flex-1 text-left text-[15px] leading-snug text-ink sm:truncate sm:text-base">
          {text}
          <span className="type-caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] bg-accent" />
          {!text && <span className="text-ink-3">Describe your thesis…</span>}
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
            text ? "bg-accent text-white" : "bg-paper-2 text-ink-3"
          }`}
        >
          <ArrowUp size={14} />
        </span>
      </div>

      {/* Proposal */}
      <div
        className="grid transition-all duration-500 ease-out"
        style={{
          gridTemplateRows: showResult ? "1fr" : "0fr",
          opacity: showResult ? 1 : 0,
          marginTop: showResult ? "0.875rem" : "0rem",
        }}
      >
        <div className="min-h-0 overflow-hidden">
          <div key={index} className="rounded-2xl border border-line bg-surface text-left shadow-[0_16px_40px_-24px_rgb(10_17_24/0.3)]">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={PROTOCOL_ICON[demo.protocol]}
                  alt=""
                  className="h-6 w-6 rounded-full bg-paper-2"
                />
                <div>
                  <div className="text-sm font-medium text-ink">{demo.action}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                    via {demo.protocol}
                  </div>
                </div>
              </div>
              <span className="rounded-md bg-accent-soft px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-accent">
                Proposed
              </span>
            </div>

            <ol className="flex flex-col gap-2 px-4 py-3.5">
              {demo.steps.map((step, i) => (
                <li
                  key={step}
                  className={`flex items-start gap-2.5 text-[13px] leading-snug text-ink-2 ${STEP_ANIM[i]}`}
                >
                  <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-positive/10 text-positive">
                    <Check size={10} strokeWidth={3} />
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line px-4 py-3">
              <div className="flex gap-6">
                {demo.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
                      {stat.label}
                    </div>
                    <div className="font-display text-lg font-medium tracking-tight text-ink">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" })
                  window.dispatchEvent(new CustomEvent(RUN_THESIS_EVENT, { detail: demo.thesis }))
                }}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-xs font-medium text-paper transition-colors hover:bg-accent"
              >
                <ShieldCheck size={13} />
                Try it live
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

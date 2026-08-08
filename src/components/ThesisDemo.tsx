import { useEffect, useState } from "react"

const DEMOS = [
  {
    thesis: "Hedge my portfolio against ETH downside",
    protocol: "Hyperliquid",
    action: "Short 2.5 ETH perpetual to offset spot exposure",
    stats: [
      { label: "Net delta", value: "−0.02" },
      { label: "Funding cost", value: "0.01% / 8h" },
    ],
  },
  {
    thesis: "Lock in 8% fixed yield on USDC",
    protocol: "Pendle",
    action: "Deposit 10,000 USDC into the fixed-rate PT pool",
    stats: [
      { label: "Fixed APY", value: "8.2%" },
      { label: "Maturity", value: "Dec 2026" },
    ],
  },
  {
    thesis: "Go long ETH with 2x leverage",
    protocol: "Aave",
    action: "Supply ETH, borrow USDC, loop into stETH",
    stats: [
      { label: "Leverage", value: "2.1x" },
      { label: "Health factor", value: "1.8" },
    ],
  },
  {
    thesis: "Rotate idle stables into Pendle",
    protocol: "Pendle",
    action: "Swap 5,000 USDC into PT-USDe",
    stats: [
      { label: "Fixed APY", value: "12.4%" },
      { label: "Maturity", value: "90 days" },
    ],
  },
]

const TYPE_SPEED = 45
const DELETE_SPEED = 25
const RESULT_DELAY_MS = 450
const RESULT_HOLD_MS = 2800

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
    <div className="max-w-2xl mx-auto">
      <div className="liquid-glass rounded-full flex items-center px-8 py-6 min-h-[4.5rem]">
        <span className="text-lg sm:text-xl text-foreground">{text}</span>
        <span className="inline-block w-[2px] h-6 bg-foreground ml-1 animate-pulse" />
      </div>

      <div
        className="overflow-hidden transition-all duration-500 ease-out"
        style={{
          maxHeight: showResult ? "240px" : "0px",
          opacity: showResult ? 1 : 0,
          marginTop: showResult ? "1rem" : "0rem",
        }}
      >
        <div className="liquid-glass rounded-2xl p-6 text-left">
          <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
            {demo.protocol}
          </span>
          <p className="text-foreground mt-2">{demo.action}</p>
          <div className="flex gap-8 mt-4">
            {demo.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
                <div
                  className="text-foreground text-xl mt-0.5"
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
  )
}

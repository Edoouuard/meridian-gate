import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

const THESES = [
  "Hedge my portfolio against ETH downside",
  "Lock in 8% fixed yield on my USDC",
  "Stake my idle ETH, nothing exotic",
  "Find the best yield on my stablecoins",
  "Repay debt before my health factor drops",
]

const TYPE_MS = 48
const DELETE_MS = 22
const HOLD_MS = 1900

/** Event the live terminal listens to: run this thesis in the demo. */
export const RUN_THESIS_EVENT = "meridian:run-thesis"

/**
 * A prompt bar that types theses by itself, then deletes and moves on.
 * Clicking it sends the current thesis to the live demo below.
 */
export function TypingPrompt() {
  const [i, setI] = useState(0)
  const [text, setText] = useState("")
  const [phase, setPhase] = useState<"type" | "hold" | "delete">("type")

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const full = THESES[i]
    if (reduce) {
      setText(full)
      const t = setTimeout(() => setI((n) => (n + 1) % THESES.length), 3500)
      return () => clearTimeout(t)
    }
    let t: ReturnType<typeof setTimeout>
    if (phase === "type") {
      if (text.length < full.length) t = setTimeout(() => setText(full.slice(0, text.length + 1)), TYPE_MS)
      else t = setTimeout(() => setPhase("hold"), 0)
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("delete"), HOLD_MS)
    } else if (text.length > 0) {
      t = setTimeout(() => setText(text.slice(0, -1)), DELETE_MS)
    } else {
      t = setTimeout(() => {
        setI((n) => (n + 1) % THESES.length)
        setPhase("type")
      }, 250)
    }
    return () => clearTimeout(t)
  }, [text, phase, i])

  const run = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" })
    window.dispatchEvent(new CustomEvent(RUN_THESIS_EVENT, { detail: THESES[i] }))
  }

  const done = phase === "hold"

  return (
    <div className="mt-8 flex w-full max-w-xl flex-col items-center">
    <button
      type="button"
      onClick={run}
      aria-label={`Try it: ${THESES[i]}`}
      className="group relative flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border border-line bg-surface/90 px-4 py-3.5 text-left shadow-[0_10px_30px_-18px_rgb(10_17_24/0.35)] backdrop-blur transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_18px_40px_-20px_rgb(47_84_255/0.45)] sm:px-5"
    >
      {/* moving sheen */}
      <span className="sheen pointer-events-none absolute inset-0" aria-hidden="true" />
      <span className="font-mono text-sm text-accent">›</span>
      <span className="min-h-[2.6em] min-w-0 flex-1 text-[15px] leading-snug text-ink sm:min-h-0 sm:truncate sm:text-base">
        {text}
        <span className="type-caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] bg-accent" />
      </span>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
          done ? "scale-100 bg-accent text-white" : "scale-90 bg-paper-2 text-ink-3"
        }`}
      >
        <ArrowUp size={15} />
      </span>
    </button>
    <span className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
      Click to run it in the live demo ↓
    </span>
    </div>
  )
}

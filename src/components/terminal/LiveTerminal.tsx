import { useCallback, useEffect, useRef, useState } from "react"
import { Ticker } from "./Ticker"
import { LeftPanel, type HistoryItem, type Tracked } from "./LeftPanel"
import { RightPanel } from "./RightPanel"
import { ThreadPane, type Thread } from "./ThreadPane"
import { Seg } from "./ui"
import { SCENARIOS, START_HOLDINGS, matchScenario, type Holding, type Scenario } from "./data"
import { cn } from "@/lib/utils"

const THINK_MS = 650
const STEP_MS = 850
const AUTOPLAY_PROMPT = "Best yield on my stablecoins"

const PANES = ["Portfolio", "Trade", "Markets"] as const
type Pane = (typeof PANES)[number]

/** What each strategy turns into once it is executed, by risk level. */
const RECEIVED: Record<string, string[]> = {
  yield: ["aUSDC", "steakUSDC", "PT-USDe"],
  stake: ["stETH", "stETH · restaked", "YT-weETH"],
  fixed: ["PT-aUSDC", "PT-sUSDS", "PT-USDe"],
}
const DELTA_AFTER = [0.31, -0.03, -0.4]

/**
 * A working replica of the Meridian terminal, faithful to the real UI
 * (Instrument Serif + Inter on navy, three columns) but driven by demo data:
 * prompts are matched to scripted scenarios and execution is simulated.
 */
export function LiveTerminal() {
  const [holdings, setHoldings] = useState<Holding[]>(START_HOLDINGS)
  const [hf, setHf] = useState(1.32)
  const [delta, setDelta] = useState(0.62)
  const [history, setHistory] = useState<HistoryItem[]>([
    { text: "Supplied 34,500 USDC on Aave v3 · Arbitrum", time: "3 days ago" },
    { text: "Bought PT-weETH on Pendle · Ethereum", time: "1 week ago" },
    { text: "Staked 10 ETH with Lido", time: "2 weeks ago" },
  ])
  const [tracked, setTracked] = useState<Tracked[]>([
    { name: "PT-weETH to maturity", venue: "Pendle · Ethereum", metric: "4.8%" },
    { name: "USDC supply", venue: "Aave v3 · Arbitrum", metric: "6.7%" },
  ])
  const [thread, setThread] = useState<Thread | null>(null)
  const [input, setInput] = useState("")
  const [pane, setPane] = useState<Pane>("Trade")

  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const touched = useRef(false)
  const keyRef = useRef(0)

  const start = useCallback((scenario: Scenario, prompt: string) => {
    keyRef.current += 1
    setThread({
      key: keyRef.current,
      scenario,
      prompt,
      thought: 0,
      selected: scenario.defaultOption,
      exec: "idle",
      step: 0,
    })
    setInput("")
    setPane("Trade")
  }, [])

  const runById = useCallback(
    (id: string, prompt?: string) => {
      touched.current = true
      const s = SCENARIOS.find((x) => x.id === id) ?? SCENARIOS[0]
      start(s, prompt ?? s.title)
    },
    [start]
  )

  const submit = useCallback(
    (text: string) => {
      start(matchScenario(text), text)
    },
    [start]
  )

  // Apply what an executed strategy changes in the portfolio.
  const applyEffect = useCallback((t: Thread) => {
    const s = t.scenario
    const o = s.options[t.selected]
    const now = "just now"
    setHistory((h) => [{ text: `${o.exec[o.exec.length - 1]} · ${s.amount}`, time: now }, ...h])

    if (s.effect === "repay") {
      setHf(1.81)
      return
    }
    if (s.effect === "hedge") {
      setDelta(DELTA_AFTER[t.selected] ?? 0)
      setTracked((tr) => [{ name: `ETH-PERP short · ${o.title}`, venue: "Hyperliquid", metric: o.metric.value }, ...tr])
      setHoldings((hs) => [...hs, { asset: "ETH-PERP short", venue: "Hyperliquid · margin", value: 950, change: 0 }].map((h) =>
        h.asset === "USDC" ? { ...h, value: h.value - 950 } : h
      ))
      return
    }

    const amountUsd = s.effect === "stake" ? 9625 : 5000
    const fromAsset = s.effect === "stake" ? "ETH" : "USDC"
    const received = RECEIVED[s.id]?.[t.selected] ?? o.title
    setHoldings((hs) => [
      ...hs.map((h) => (h.asset === fromAsset ? { ...h, value: h.value - amountUsd } : h)),
      { asset: received, venue: `${o.protocol} · ${o.chain}`, value: amountUsd, change: 0 },
    ])
    setTracked((tr) => [{ name: o.title, venue: `${o.protocol} · ${o.chain}`, metric: o.metric.value }, ...tr])
  }, [])

  // Drive the reasoning steps and the execution steps.
  useEffect(() => {
    if (!thread) return
    const s = thread.scenario
    if (thread.thought < s.thinking.length) {
      const t = setTimeout(() => setThread((th) => th && th.key === thread.key ? { ...th, thought: th.thought + 1 } : th), THINK_MS)
      return () => clearTimeout(t)
    }
    if (thread.exec === "running") {
      const steps = s.options[thread.selected].exec.length
      if (thread.step < steps) {
        const t = setTimeout(() => setThread((th) => th && th.key === thread.key ? { ...th, step: th.step + 1 } : th), STEP_MS)
        return () => clearTimeout(t)
      }
      applyEffect(thread)
      setThread({ ...thread, exec: "done" })
    }
  }, [thread, applyEffect])

  // Autoplay once when the terminal scrolls into view, unless the visitor got there first.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let typing: ReturnType<typeof setInterval> | undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || touched.current) return
        io.disconnect()
        let i = 0
        typing = setInterval(() => {
          if (touched.current) return clearInterval(typing)
          i += 1
          setInput(AUTOPLAY_PROMPT.slice(0, i))
          if (i >= AUTOPLAY_PROMPT.length) {
            clearInterval(typing)
            setTimeout(() => {
              if (!touched.current) submit(AUTOPLAY_PROMPT)
            }, 450)
          }
        }, 55)
      },
      { threshold: 0.45 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (typing) clearInterval(typing)
    }
  }, [submit])

  const markTouched = () => {
    touched.current = true
  }

  const reset = () => {
    touched.current = true
    setThread(null)
    setInput("")
    inputRef.current?.focus({ preventScroll: true })
  }

  const panelProps = { onRun: runById }

  return (
    <div
      ref={rootRef}
      onPointerDown={markTouched}
      onKeyDown={markTouched}
      className="overflow-hidden rounded-[10px] border border-black/10 bg-t-bg font-t-body text-t-text shadow-[0_40px_90px_-40px_rgb(17_16_14/0.55),0_12px_32px_-16px_rgb(17_16_14/0.25)]"
    >
      <Ticker />

      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-t-line px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="font-t-head text-[24px] leading-none tracking-[-0.015em]">Meridian</span>
          <span className="hidden items-center gap-1.5 truncate rounded-full border border-t-line px-2.5 py-1 text-[11px] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-t-good" />
            Demo wallet · 8 chains
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="hidden cursor-pointer rounded-full border border-t-line px-2.5 py-1 text-[11px] text-t-muted transition-colors hover:text-t-text sm:inline-block"
          >
            Reset demo
          </button>
          <span className="rounded-[4px] border border-t-accent px-3 py-1.5 text-[12px] text-t-accent">0x7a…3f1c</span>
        </div>
      </div>

      {/* mobile pane switcher */}
      <div className="border-b border-t-line p-2 lg:hidden">
        <Seg options={PANES} value={pane} onChange={setPane} />
      </div>

      <div className="grid h-[620px] lg:h-[640px] lg:grid-cols-[264px_minmax(0,1fr)_256px]">
        <aside className={cn("min-h-0 border-t-line lg:block lg:border-r", pane === "Portfolio" ? "block" : "hidden")}>
          <LeftPanel holdings={holdings} hf={hf} delta={delta} history={history} tracked={tracked} {...panelProps} />
        </aside>

        <section className={cn("min-h-0 lg:block", pane === "Trade" ? "block" : "hidden")}>
          <ThreadPane
            thread={thread}
            input={input}
            setInput={(v) => {
              touched.current = true
              setInput(v)
            }}
            onSubmit={(t) => {
              touched.current = true
              submit(t)
            }}
            onRun={runById}
            onSelect={(i) => setThread((th) => (th ? { ...th, selected: i } : th))}
            onExecute={() => setThread((th) => (th ? { ...th, exec: "sign" } : th))}
            onSign={() => setThread((th) => (th ? { ...th, exec: "running", step: 0 } : th))}
            onReject={() => setThread((th) => (th ? { ...th, exec: "rejected" } : th))}
            onReset={reset}
            inputRef={inputRef}
          />
        </section>

        <aside className={cn("min-h-0 border-t-line lg:block lg:border-l", pane === "Markets" ? "block" : "hidden")}>
          <RightPanel {...panelProps} />
        </aside>
      </div>
    </div>
  )
}

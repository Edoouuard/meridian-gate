import { useEffect, useRef, useState } from "react"
import { ArrowRight, ArrowLeftRight, Repeat, Droplets, TrendingDown } from "lucide-react"
import { Btn, Card, Kicker, Seg, Tag } from "./ui"
import { fmtUsd, type Holding } from "./data"

export type HistoryItem = { text: string; time: string }
export type Tracked = { name: string; venue: string; metric: string }

const TABS = ["Risk", "Strategies", "Tools", "History"] as const
type Tab = (typeof TABS)[number]

/** Flash a value when it changes, like the real terminal's live numbers. */
function useFlash(value: number) {
  const prev = useRef(value)
  const [flash, setFlash] = useState<"" | "mt-flash-up" | "mt-flash-down">("")
  useEffect(() => {
    if (value === prev.current) return
    setFlash(value > prev.current ? "mt-flash-up" : "mt-flash-down")
    prev.current = value
    const t = setTimeout(() => setFlash(""), 900)
    return () => clearTimeout(t)
  }, [value])
  return flash
}

function HealthBar({ hf }: { hf: number }) {
  const pos = Math.min(Math.max((hf - 1) / 1, 0), 1) * 100
  return (
    <div>
      <div className="relative mt-2 h-2">
        <div className="flex h-2 overflow-hidden rounded-[2px]">
          <span className="w-[30%] bg-t-bad" />
          <span className="w-[30%] bg-t-warn" />
          <span className="flex-1 bg-t-good" />
        </div>
        <span
          className="absolute -top-1 h-4 w-[3px] -translate-x-1/2 rounded-sm bg-t-text transition-[left] duration-1000 ease-out"
          style={{ left: `${pos}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-t-muted">
        <span>Liquidation · 1.0</span>
        <span>Safe · 1.6+</span>
      </div>
    </div>
  )
}

function DeltaBar({ delta }: { delta: number }) {
  const c = Math.max(-1, Math.min(1, delta))
  const left = c >= 0 ? 50 : 50 + c * 50
  const width = Math.abs(c) * 50
  return (
    <div>
      <div className="relative mt-2 h-2 rounded-[2px] bg-[#eae7e7]">
        <span className="absolute left-1/2 top-[-3px] h-[14px] w-px bg-[#9b9797]" />
        <span
          className="absolute top-0 h-2 rounded-[2px] bg-t-accent transition-all duration-1000 ease-out"
          style={{ left: `${left}%`, width: `${Math.max(width, 0.8)}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-t-muted">
        <span>Short</span>
        <span>Flat</span>
        <span>Long</span>
      </div>
    </div>
  )
}

function NowAfter({ now, after, max, fmt }: { now: number; after: number; max: number; fmt: (n: number) => string }) {
  return (
    <div className="mt-2 grid grid-cols-[38px_1fr_42px] items-center gap-x-2 gap-y-1 text-[10px] text-t-muted">
      <span>Now</span>
      <span className="h-1.5 rounded-full bg-[#eae7e7]">
        <span className="block h-1.5 rounded-full bg-t-warn" style={{ width: `${(now / max) * 100}%` }} />
      </span>
      <span className="text-right text-t-text">{fmt(now)}</span>
      <span>After</span>
      <span className="h-1.5 rounded-full bg-[#eae7e7]">
        <span className="block h-1.5 rounded-full bg-t-good" style={{ width: `${(after / max) * 100}%` }} />
      </span>
      <span className="text-right text-t-text">{fmt(after)}</span>
    </div>
  )
}

export function LeftPanel({
  holdings,
  hf,
  delta,
  history,
  tracked,
  onRun,
}: {
  holdings: Holding[]
  hf: number
  delta: number
  history: HistoryItem[]
  tracked: Tracked[]
  onRun: (scenarioId: string, prompt?: string) => void
}) {
  const [tab, setTab] = useState<Tab>("Risk")
  const net = holdings.reduce((n, h) => n + h.value, 0)
  const flash = useFlash(net)
  const hfFlash = useFlash(hf)

  return (
    <div className="mt-scroll flex h-full flex-col gap-3 p-3">
      <Card>
        <div className="flex items-center justify-between">
          <Kicker>Portfolio</Kicker>
          <Tag>Demo wallet</Tag>
        </div>
        <div className={`mt-1.5 w-fit rounded-[3px] font-t-head text-[30px] font-semibold leading-none ${flash}`}>
          {fmtUsd(net)}
        </div>
        <div className="mt-1 text-[11px] text-t-good">+$2,184 · 1.74% today</div>
        <div className="mt-3 divide-y divide-t-line">
          {holdings.map((h) => (
            <div key={h.asset + h.venue} className="flex items-center justify-between py-1.5 animate-fade-rise">
              <div className="min-w-0">
                <div className="truncate text-[12px]">{h.asset}</div>
                <div className="truncate text-[10px] text-t-muted">{h.venue}</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] tabular-nums">{fmtUsd(h.value)}</div>
                <div className={`text-[10px] tabular-nums ${h.change >= 0 ? "text-t-good" : "text-t-bad"}`}>
                  {h.change >= 0 ? "+" : ""}
                  {h.change.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Seg options={TABS} value={tab} onChange={setTab} />

      {tab === "Risk" && (
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Kicker>Risk</Kicker>
            <Tag tone="good">Live</Tag>
          </div>

          <div>
            <div className="flex items-baseline justify-between text-[12px]">
              <span>Lowest health factor · Aave</span>
              <span
                className={`rounded-[3px] px-1 font-t-head text-lg font-semibold ${hf < 1.5 ? "text-t-warn" : "text-t-good"} ${hfFlash}`}
              >
                {hf.toFixed(2)}
              </span>
            </div>
            <HealthBar hf={hf} />
          </div>

          <div>
            <div className="flex items-baseline justify-between text-[12px]">
              <span>Net ETH delta</span>
              <span className="font-t-head text-lg font-semibold text-t-accent">
                {delta >= 0 ? "+" : "−"}
                {Math.abs(delta).toFixed(2)} ETH
              </span>
            </div>
            <DeltaBar delta={delta} />
          </div>

          {hf < 1.6 && (
            <div className="rounded-[4px] border border-t-line p-2.5">
              <p className="text-[12px] leading-snug">
                Repaying $4,200 USDC on Aave brings the health factor from {hf.toFixed(2)} to 1.81.
              </p>
              <NowAfter now={hf} after={1.81} max={2.2} fmt={(n) => n.toFixed(2)} />
              <Btn className="mt-2.5 w-full" onClick={() => onRun("repay", "Repay $4,200 USDC on Aave")}>
                Review <ArrowRight size={12} />
              </Btn>
            </div>
          )}

          {delta > 0.35 && (
            <div className="rounded-[4px] border border-t-line p-2.5">
              <p className="text-[12px] leading-snug">
                Shorting 2.5 ETH on Hyperliquid brings the ETH net delta from +{delta.toFixed(2)} to about 0.
              </p>
              <NowAfter now={Math.abs(delta)} after={0.03} max={1} fmt={(n) => `+${n.toFixed(2)}`} />
              <Btn className="mt-2.5 w-full" onClick={() => onRun("hedge", "Hedge my ETH downside")}>
                Review <ArrowRight size={12} />
              </Btn>
            </div>
          )}

          {hf >= 1.6 && delta <= 0.35 && (
            <p className="text-[12px] text-t-good">Nothing urgent. Your positions are within safe ranges.</p>
          )}
        </Card>
      )}

      {tab === "Strategies" && (
        <Card>
          <Kicker>Tracked strategies</Kicker>
          <div className="mt-2 divide-y divide-t-line">
            {tracked.map((s, i) => (
              <div key={s.name + i} className="flex items-center justify-between gap-2 py-2 animate-fade-rise">
                <div className="min-w-0">
                  <div className="truncate text-[12px]">{s.name}</div>
                  <div className="truncate text-[10px] text-t-muted">{s.venue}</div>
                </div>
                <span className="shrink-0 font-t-head text-base font-semibold">{s.metric}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Tools" && (
        <Card>
          <Kicker>Tools</Kicker>
          <div className="mt-2 flex flex-col gap-1.5">
            {[
              { icon: <ArrowLeftRight size={14} />, name: "Bridge", sub: "Move assets across 8 chains via LI.FI" },
              { icon: <Repeat size={14} />, name: "Swap", sub: "Best route across DEX aggregators" },
              { icon: <Droplets size={14} />, name: "Lido withdrawals", sub: "Track and claim stETH exits" },
              { icon: <TrendingDown size={14} />, name: "Perps", sub: "Hyperliquid and Extended positions" },
            ].map((t) => (
              <div key={t.name} className="flex items-start gap-2.5 rounded-[4px] border border-t-line p-2.5">
                <span className="mt-0.5 text-t-accent">{t.icon}</span>
                <div>
                  <div className="text-[12px]">{t.name}</div>
                  <div className="text-[10px] text-t-muted">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "History" && (
        <Card>
          <Kicker>History</Kicker>
          <div className="mt-2 divide-y divide-t-line">
            {history.map((h, i) => (
              <div key={h.text + i} className="py-2 animate-fade-rise">
                <div className="text-[12px] leading-snug">{h.text}</div>
                <div className="text-[10px] text-t-muted">{h.time}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

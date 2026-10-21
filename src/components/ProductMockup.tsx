import { useId } from "react"
import { ThesisDemo } from "@/components/ThesisDemo"

const ALLOCATION = [
  { label: "stETH · Lido", pct: 38, color: "var(--ink)" },
  { label: "USDC · Aave", pct: 27, color: "var(--accent)" },
  { label: "PT-weETH · Pendle", pct: 21, color: "#8ea2ff" },
  { label: "Perp margin · HL", pct: 14, color: "var(--line-strong)" },
]

const POSITIONS = [
  { asset: "stETH", venue: "Lido", value: "$48,210", pnl: "+2.4%", up: true },
  { asset: "USDC", venue: "Aave v3", value: "$34,500", pnl: "+0.6%", up: true },
  { asset: "PT-weETH", venue: "Pendle", value: "$26,880", pnl: "+1.1%", up: true },
  { asset: "ETH-PERP", venue: "Hyperliquid", value: "$17,940", pnl: "−0.8%", up: false },
]

/** Health-factor gauge: a half-ring with a needle. */
export function HealthGauge({ value = 1.81 }: { value?: number }) {
  // map 1.0 → 3.0 onto 0 → 180deg
  const t = Math.min(Math.max((value - 1) / 2, 0), 1)
  const angle = -90 + t * 180
  const gid = `hf-${useId().replace(/:/g, "")}`
  return (
    <svg viewBox="0 0 120 68" className="w-full" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" x2="1">
          <stop offset="0" stopColor="var(--negative)" />
          <stop offset="0.35" stopColor="#f5a524" />
          <stop offset="0.7" stopColor="var(--positive)" />
        </linearGradient>
      </defs>
      <path
        d="M 10 60 A 50 50 0 0 1 110 60"
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <g transform={`rotate(${angle} 60 60)`}>
        <line x1="60" y1="60" x2="60" y2="20" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      </g>
      <circle cx="60" cy="60" r="4" fill="var(--ink)" />
    </svg>
  )
}

export function ProductMockup() {
  return (
    <div className="product-frame overflow-hidden text-left">
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-line bg-paper/60 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        </div>
        <div className="mx-auto rounded-md border border-line bg-surface px-3 py-1 font-mono text-[10px] text-ink-3 sm:text-[11px]">
          meridian-terminal.com
        </div>
        <span className="hidden items-center gap-1.5 font-mono text-[10px] text-ink-3 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-positive" />
          0x7a…3f1c
        </span>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr_220px]">
        {/* Portfolio */}
        <aside className="hidden border-r border-line p-5 lg:block">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Net worth</div>
          <div className="mt-1 font-display text-[28px] font-medium tracking-tight text-ink">$127,530</div>
          <div className="mt-0.5 text-xs text-positive">+$2,184 · 1.74% today</div>

          <div className="mt-5 flex h-2 overflow-hidden rounded-full">
            {ALLOCATION.map((a) => (
              <span key={a.label} style={{ width: `${a.pct}%`, background: a.color }} />
            ))}
          </div>
          <ul className="mt-3 flex flex-col gap-1.5">
            {ALLOCATION.map((a) => (
              <li key={a.label} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 text-ink-2">
                  <span className="h-2 w-2 rounded-sm" style={{ background: a.color }} />
                  {a.label}
                </span>
                <span className="font-mono text-ink-3">{a.pct}%</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Positions</div>
          <ul className="mt-2 divide-y divide-line">
            {POSITIONS.map((p) => (
              <li key={p.asset} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-xs font-medium text-ink">{p.asset}</div>
                  <div className="text-[10px] text-ink-3">{p.venue}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[11px] text-ink">{p.value}</div>
                  <div className={`font-mono text-[10px] ${p.up ? "text-positive" : "text-negative"}`}>
                    {p.pnl}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Prompt-to-trade */}
        <div className="min-h-[380px] p-4 sm:min-h-[400px] sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
              Prompt to trade
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-ink-3">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
              Scanning 6 protocols
            </span>
          </div>
          <ThesisDemo />
        </div>

        {/* Risk */}
        <aside className="hidden border-l border-line p-5 lg:block">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Health factor</div>
          <div className="mt-3 px-2">
            <HealthGauge value={1.81} />
          </div>
          <div className="-mt-1 text-center font-display text-2xl font-medium text-ink">1.81</div>
          <div className="text-center text-[11px] text-positive">Safe · liq. at 1.00</div>

          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Net delta</div>
          <div className="relative mt-3 h-1.5 rounded-full bg-paper-2">
            <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-y-1/2 bg-line-strong" />
            <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-accent shadow" style={{ left: "58%" }} />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[10px] text-ink-3">
            <span>Short</span>
            <span>Flat</span>
            <span>Long</span>
          </div>

          <div className="mt-6 rounded-lg border border-line bg-paper p-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">Suggestion</div>
            <p className="mt-1 text-[11px] leading-snug text-ink-2">
              Repay $4,200 USDC to lift health factor from 1.81 to 2.30.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

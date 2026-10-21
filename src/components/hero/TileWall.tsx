import type { ReactNode } from "react"

/*
 * A tilted, slowly scrolling wall of small Meridian moments, in the spirit of
 * Basepoint's hero: agent notifications (dark glass) mixed with fragments of
 * the terminal UI (cream, Cormorant + Lora, gold accent).
 * Purely decorative: aria-hidden, and frozen under prefers-reduced-motion.
 */

const GLASS =
  "rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-white/85 backdrop-blur-sm shadow-[0_20px_40px_-20px_rgb(0_0_0/0.6)]"
const CREAM =
  "rounded-2xl border border-black/5 bg-t-bg p-4 font-t-body text-t-text shadow-[0_24px_48px_-24px_rgb(0_0_0/0.7)]"

function Note({ kind, time, children }: { kind: string; time: string; children: ReactNode }) {
  return (
    <div className={GLASS}>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-t-accent" />
          {kind}
        </span>
        <span>{time}</span>
      </div>
      <p className="mt-2 text-[15px] leading-snug">{children}</p>
    </div>
  )
}

function Status({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-white/80 backdrop-blur-sm">
      <span className="relative flex h-2 w-2">
        <span className="absolute inset-0 animate-ping rounded-full bg-t-accent/70" />
        <span className="relative h-2 w-2 rounded-full bg-t-accent" />
      </span>
      {children}
    </div>
  )
}

function Kicker({ children }: { children: ReactNode }) {
  return <div className="text-[10px] uppercase tracking-[0.1em] text-t-accent">{children}</div>
}

function StrategyTile({ title, sub, apy }: { title: string; sub: string; apy: string }) {
  return (
    <div className={CREAM}>
      <Kicker>Strategy</Kicker>
      <div className="mt-1 font-t-head text-xl font-semibold leading-tight">{title}</div>
      <div className="mt-1 text-[12px] text-t-muted">{sub}</div>
      <div className="mt-3 flex items-end justify-between">
        <span className="font-t-head text-2xl font-semibold">{apy}</span>
        <span className="rounded-[3px] border border-t-accent px-2.5 py-1 text-[11px] text-t-accent">Execute</span>
      </div>
    </div>
  )
}

function YieldsTile() {
  const rows = [
    ["Morpho", "Base", "9.1%"],
    ["Pendle PT", "Ethereum", "8.4%"],
    ["Aave v3", "Arbitrum", "6.7%"],
    ["Compound", "Optimism", "5.9%"],
  ]
  return (
    <div className={CREAM}>
      <div className="flex items-center justify-between">
        <Kicker>Yields · Stablecoins</Kicker>
        <span className="text-[10px] text-t-good">live</span>
      </div>
      <div className="mt-2 divide-y divide-t-line">
        {rows.map(([p, c, a]) => (
          <div key={p} className="flex items-center justify-between py-1.5 text-[12px]">
            <span>
              {p} <span className="text-t-muted">· {c}</span>
            </span>
            <span className="font-t-head text-base font-semibold">{a}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HealthTile({ value, label }: { value: string; label: string }) {
  return (
    <div className={CREAM}>
      <div className="flex items-center justify-between">
        <Kicker>Risk</Kicker>
        <span className="font-t-head text-xl font-semibold text-t-warn">{value}</span>
      </div>
      <div className="mt-1 text-[12px] text-t-muted">{label}</div>
      <div className="relative mt-3 flex h-1.5 overflow-hidden rounded-full">
        <span className="w-[45%] bg-t-bad" />
        <span className="w-[20%] bg-t-warn" />
        <span className="flex-1 bg-t-good" />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-t-muted">
        <span>Liquidation · 1.0</span>
        <span>Safe · 1.6+</span>
      </div>
    </div>
  )
}

function PromptTile({ text }: { text: string }) {
  return (
    <div className={CREAM}>
      <div className="ml-auto w-fit max-w-[90%] rounded-[6px] bg-t-surface px-3 py-2 text-[13px]">{text}</div>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-t-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-t-accent" />
        Fetching live rates across 8 chains…
      </div>
    </div>
  )
}

function SparkTile() {
  const pts = [22, 26, 24, 31, 29, 35, 33, 40, 38, 46, 44, 52]
  const d = pts.map((y, i) => `${i === 0 ? "M" : "L"} ${i * 18} ${60 - y}`).join(" ")
  return (
    <div className={CREAM}>
      <div className="flex items-center justify-between">
        <Kicker>Portfolio</Kicker>
        <span className="text-[11px] text-t-good">+1.74% today</span>
      </div>
      <div className="mt-1 font-t-head text-2xl font-semibold">$127,530</div>
      <svg viewBox="0 0 200 60" className="mt-2 h-12 w-full" aria-hidden="true">
        <path d={d} fill="none" stroke="var(--t-accent)" strokeWidth="2" />
      </svg>
    </div>
  )
}

const COLUMNS: { dir: "up" | "down"; dur: string; tiles: ReactNode[] }[] = [
  {
    dir: "up",
    dur: "46s",
    tiles: [
      <Note key="t1" kind="Health watch" time="6:02 AM">
        Aave health factor fell to <b className="text-white">1.32</b>. Repaying $4,200 brings it back to 1.81.
      </Note>,
      <YieldsTile key="t2" />,
      <Status key="t3">Scanning 14 Pendle pools</Status>,
      <HealthTile key="t4" value="1.32" label="Lowest health factor · Aave" />,
    ],
  },
  {
    dir: "down",
    dur: "54s",
    tiles: [
      <PromptTile key="t5" text="Best yield on my stablecoins" />,
      <Note key="t6" kind="Rate alert" time="7:15 AM">
        PT-USDe now pays <b className="text-white">11.2% fixed</b> to maturity. 3.1% above Aave variable.
      </Note>,
      <StrategyTile key="t7" title="Lock a fixed rate" sub="Pendle PT on USDC, held to maturity" apy="8.4%" />,
      <Status key="t8">Comparing 6 protocols</Status>,
    ],
  },
  {
    dir: "up",
    dur: "50s",
    tiles: [
      <SparkTile key="t9" />,
      <Status key="t10">Routing via Base · gas $0.04</Status>,
      <Note key="t11" kind="Executed" time="9:31 AM">
        <b className="text-white">5,000 USDC</b> deposited into Morpho on Base. Signed in your wallet.
      </Note>,
      <StrategyTile key="t12" title="Stake my ETH" sub="Lido staking, optional EigenLayer restaking" apy="3.2%" />,
    ],
  },
  {
    dir: "down",
    dur: "58s",
    tiles: [
      <Note key="t13" kind="Hedge" time="10:48 AM">
        Net ETH delta at <b className="text-white">+0.62</b>. A 2.5 ETH short on Hyperliquid takes it to flat.
      </Note>,
      <PromptTile key="t14" text="Hedge my portfolio against ETH downside" />,
      <Status key="t15">Simulating the deposit</Status>,
      <YieldsTile key="t16" />,
    ],
  },
  {
    dir: "up",
    dur: "48s",
    tiles: [
      <StrategyTile key="t17" title="Best yield on my stablecoins" sub="Aave, Morpho, Pendle across 8 chains" apy="9.1%" />,
      <Note key="t18" kind="Lido" time="11:20 AM">
        Withdrawal queue under <b className="text-white">2 days</b>. Your 3.4 stETH can exit at par.
      </Note>,
      <HealthTile key="t19" value="1.81" label="After repaying $4,200 USDC" />,
      <Status key="t20">Watching 8 chains</Status>,
    ],
  },
]

export function TileWall() {
  return (
    <div className="tile-wall pointer-events-none relative h-[380px] overflow-hidden sm:h-[520px]" aria-hidden="true">
      <div className="tile-wall-plane mx-auto grid w-[1500px] max-w-none grid-cols-5 gap-5 px-5 [margin-left:50%] [translate:-50%_0]">
        {COLUMNS.map((col, ci) => (
          <div key={ci} className="h-[900px] overflow-hidden">
            <div
              className={`flex flex-col ${col.dir === "up" ? "wall-up" : "wall-down"}`}
              style={{ ["--dur" as string]: col.dur }}
            >
              {[...col.tiles, ...col.tiles].map((t, i) => (
                <div key={i} className="pb-5">
                  {t}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

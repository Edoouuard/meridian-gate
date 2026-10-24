import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Btn, Card, Kicker, Seg, TIcon, Tag } from "./ui"
import { ALPHA, CHAINS, NEWS, POOLS, fmtUsd, icon, type Pool } from "./data"

const TABS = ["Yields", "News", "Chains", "Alpha"] as const
type Tab = (typeof TABS)[number]
const ASSETS = ["Stablecoins", "ETH", "HYPE"] as const
type Asset = (typeof ASSETS)[number]

function Yields({ onRun }: { onRun: (id: string, prompt?: string) => void }) {
  const [asset, setAsset] = useState<Asset>("Stablecoins")
  const [execOnly, setExecOnly] = useState(false)
  const [pools, setPools] = useState(POOLS)

  // Rates drift a little, the way live DefiLlama data does.
  useEffect(() => {
    const id = setInterval(() => {
      setPools((prev) => {
        const next = { ...prev }
        for (const k of ASSETS) {
          next[k] = prev[k].map((p) =>
            Math.random() > 0.5 ? p : { ...p, apy: Math.max(0.5, p.apy + (Math.random() - 0.5) * 0.12) }
          )
        }
        return next
      })
    }, 2600)
    return () => clearInterval(id)
  }, [])

  const list = pools[asset].filter((p) => !execOnly || p.executable).sort((a, b) => b.apy - a.apy)
  const execCount = pools[asset].filter((p) => p.executable).length

  const run = (p: Pool) => {
    if (!p.executable) return
    if (asset === "ETH") onRun("stake", `Put my ETH into ${p.asset} on ${p.protocol}`)
    else onRun("yield", `Deposit into ${p.protocol} ${p.asset} on ${p.chain}`)
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <Kicker>Yields</Kicker>
        <span className="flex items-center gap-1.5 text-[10px] text-t-good">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-t-good" />
          live
        </span>
      </div>
      <Seg options={ASSETS} value={asset} onChange={setAsset} size="sm" className="mt-2" />
      <label className="mt-2 flex cursor-pointer items-center gap-2 text-[11px]">
        <input
          type="checkbox"
          checked={execOnly}
          onChange={(e) => setExecOnly(e.target.checked)}
          className="accent-[#b68235]"
        />
        Executable only ({execCount})
      </label>
      <div className="mt-2 divide-y divide-t-line">
        {list.map((p) => (
          <button
            key={p.protocol + p.chain + p.asset}
            type="button"
            onClick={() => run(p)}
            disabled={!p.executable}
            className="group flex w-full cursor-pointer items-center gap-2 py-2 text-left disabled:cursor-default"
          >
            <TIcon src={icon.protocol(p.slug)} name={p.protocol} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px]">
                {p.asset} <span className="text-t-muted">· {p.protocol}</span>
              </div>
              <div className="truncate text-[10px] text-t-muted">
                {p.chain} · TVL {p.tvl}
                {!p.executable && " · view only"}
              </div>
            </div>
            <span className="font-t-head text-base tabular-nums transition-colors group-enabled:group-hover:text-t-accent">
              {p.apy.toFixed(1)}%
            </span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-[10px] leading-snug text-t-muted">
        Click an executable pool and Meridian builds the deposit. Demo rates.
      </p>
    </Card>
  )
}

export function RightPanel({ onRun }: { onRun: (id: string, prompt?: string) => void }) {
  const [tab, setTab] = useState<Tab>("Yields")
  const total = CHAINS.reduce((n, c) => n + c.value, 0)

  return (
    <div className="mt-scroll flex h-full flex-col gap-3 p-3">
      <Seg options={TABS} value={tab} onChange={setTab} />

      {tab === "Yields" && <Yields onRun={onRun} />}

      {tab === "News" && (
        <Card>
          <Kicker>News</Kicker>
          <div className="mt-2 divide-y divide-t-line">
            {NEWS.map((n) => (
              <div key={n.title} className="py-2">
                <div className="flex items-center justify-between">
                  <Tag tone="accent">{n.tag}</Tag>
                  <span className="text-[10px] text-t-muted">{n.time}</span>
                </div>
                <p className="mt-1 text-[12px] leading-snug">{n.title}</p>
                <div className="text-[10px] text-t-muted">{n.delta}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Chains" && (
        <Card>
          <Kicker>Chains</Kicker>
          <div className="mt-2 flex flex-col gap-2.5">
            {CHAINS.map((c) => (
              <div key={c.name}>
                <div className="flex items-center gap-2 text-[12px]">
                  <TIcon src={icon.chain(c.slug)} name={c.name} size={16} />
                  <span className="flex-1">{c.name}</span>
                  <span className={c.value ? "tabular-nums" : "text-t-muted"}>{c.value ? fmtUsd(c.value) : "—"}</span>
                </div>
                <div className="mt-1 h-1 rounded-full bg-[#eae7e7]">
                  <div className="h-1 rounded-full bg-t-accent" style={{ width: `${(c.value / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Alpha" && (
        <div className="flex flex-col gap-3">
          {ALPHA.map((a) => (
            <Card key={a.title}>
              <Kicker>Signal</Kicker>
              <div className="mt-1 font-t-head text-lg leading-tight">{a.title}</div>
              <p className="mt-1 text-[12px] leading-snug text-t-muted">{a.body}</p>
              <Btn className="mt-2.5" onClick={() => onRun(a.scenario)}>
                Ask Meridian <ArrowRight size={12} />
              </Btn>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

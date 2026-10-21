import { useEffect, useState } from "react"
import { TICKERS } from "./data"

type Live = { sym: string; price: number; open: number; dir: 0 | 1 | -1 }

const fmt = (p: number) =>
  p >= 1000
    ? p.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Top price strip. The real terminal streams prices; here they random-walk. */
export function Ticker() {
  const [rows, setRows] = useState<Live[]>(() =>
    TICKERS.map((t) => ({ ...t, open: t.price * (1 - (Math.random() * 0.03 - 0.012)), dir: 0 }))
  )

  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) =>
        prev.map((r) => {
          if (Math.random() > 0.45) return { ...r, dir: 0 }
          const next = r.price * (1 + (Math.random() - 0.5) * 0.0024)
          return { ...r, price: next, dir: next >= r.price ? 1 : -1 }
        })
      )
    }, 1800)
    return () => clearInterval(id)
  }, [])

  const item = (r: Live, i: number) => {
    const ch = ((r.price - r.open) / r.open) * 100
    return (
      <span key={`${r.sym}-${i}`} className="inline-flex items-center gap-1.5 px-4 text-[11px]">
        <span className="font-semibold tracking-[0.04em]">{r.sym}</span>
        <span
          key={r.price}
          className={`rounded-[2px] px-1 tabular-nums ${r.dir === 1 ? "mt-flash-up" : r.dir === -1 ? "mt-flash-down" : ""}`}
        >
          ${fmt(r.price)}
        </span>
        <span className={`tabular-nums ${ch >= 0 ? "text-t-good" : "text-t-bad"}`}>
          {ch >= 0 ? "▲" : "▼"}
          {Math.abs(ch).toFixed(2)}%
        </span>
      </span>
    )
  }

  return (
    <div className="marquee-mask overflow-hidden whitespace-nowrap border-b border-t-line bg-t-surface py-1.5">
      <div className="animate-marquee inline-flex w-max [animation-duration:55s] hover:[animation-play-state:paused]">
        {rows.map(item)}
        {rows.map((r, i) => item(r, i + rows.length))}
      </div>
    </div>
  )
}

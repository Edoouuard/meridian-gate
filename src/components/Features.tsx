import { useId, type ReactNode } from "react"
import { Check, Fingerprint, Newspaper, Route, ShieldCheck, Wallet, Activity } from "lucide-react"
import { Container, SectionHeading } from "@/components/Section"
import { Reveal } from "@/components/Reveal"
import { cn } from "@/lib/utils"

function FeatureCard({
  icon,
  title,
  body,
  children,
  className,
  delay = 0,
}: {
  icon: ReactNode
  title: string
  body: string
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <Reveal delay={delay} className={cn("h-full", className)}>
      <div className="card group flex h-full flex-col overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-[0_16px_40px_-20px_rgb(10_17_24/0.18)]">
        <div className="relative flex min-h-[200px] flex-1 items-center justify-center overflow-hidden border-b border-line bg-paper p-6">
          {children}
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 text-ink">
            <span className="text-accent">{icon}</span>
            <h3 className="text-lg tracking-tight">{title}</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
        </div>
      </div>
    </Reveal>
  )
}

/* ---------- Visuals ---------- */

/** Health-factor gauge: a half-ring with a needle. */
function HealthGauge({ value = 1.81 }: { value?: number }) {
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


const BARS = [38, 44, 41, 52, 49, 58, 55, 63, 61, 70, 68, 76]

function PortfolioVisual() {
  const chains = ["Ethereum", "Base", "Arbitrum", "Optimism", "Polygon", "Avalanche"]
  return (
    <div className="w-full max-w-md">
      <div className="flex flex-wrap gap-1.5">
        {chains.map((c) => (
          <span key={c} className="rounded-md border border-line bg-surface px-2 py-1 font-mono text-[10px] text-ink-2">
            {c}
          </span>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-line bg-surface p-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">All chains · all protocols</div>
            <div className="mt-1 font-display text-2xl font-medium tracking-tight text-ink">$127,530</div>
          </div>
          <span className="font-mono text-xs text-positive">+18.4% 30d</span>
        </div>
        <div className="mt-4 flex h-20 items-end gap-1.5">
          {BARS.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-[3px] transition-all duration-500 group-hover:opacity-100"
              style={{
                height: `${h}%`,
                background: i === BARS.length - 1 ? "var(--accent)" : "var(--paper-2)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function RiskVisual() {
  return (
    <div className="w-full max-w-[220px] text-center">
      <HealthGauge value={1.65} />
      <div className="-mt-1 font-display text-3xl font-medium tracking-tight text-ink">1.65</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">Health factor</div>
    </div>
  )
}

function RouteVisual() {
  const rows = [
    { name: "Morpho vault", rate: "9.1%", best: true },
    { name: "Aave v3", rate: "6.7%" },
    { name: "Compound", rate: "5.9%" },
  ]
  return (
    <div className="w-full max-w-[260px] rounded-xl border border-line bg-surface p-2">
      {rows.map((r) => (
        <div
          key={r.name}
          className={cn(
            "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm",
            r.best ? "bg-accent-soft text-ink" : "text-ink-2"
          )}
        >
          <span className="flex items-center gap-2">
            {r.best ? (
              <Check size={13} className="text-accent" strokeWidth={3} />
            ) : (
              <span className="w-[13px]" />
            )}
            {r.name}
          </span>
          <span className={cn("font-mono text-xs", r.best && "font-medium text-accent")}>{r.rate}</span>
        </div>
      ))}
    </div>
  )
}

function SignalVisual() {
  const items = [
    { tag: "Pendle", text: "New PT-USDe pool opens at 11.2% fixed", delta: "+$42M TVL" },
    { tag: "Aave", text: "Supply cap raised on Base market", delta: "+1.3% APY" },
    { tag: "Lido", text: "Withdrawal queue drops under 2 days", delta: "−3d" },
  ]
  return (
    <div className="flex w-full max-w-[280px] flex-col gap-2">
      {items.map((n) => (
        <div key={n.text} className="rounded-lg border border-line bg-surface px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent">{n.tag}</span>
            <span className="font-mono text-[10px] text-ink-3">{n.delta}</span>
          </div>
          <p className="mt-1 text-xs leading-snug text-ink">{n.text}</p>
        </div>
      ))}
    </div>
  )
}

function CustodyVisual() {
  return (
    <div className="w-full max-w-[250px] rounded-xl border border-line bg-surface p-4 shadow-[0_12px_30px_-18px_rgb(10_17_24/0.25)]">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paper-2 text-ink">
          <Wallet size={14} />
        </span>
        <div>
          <div className="text-xs font-medium text-ink">Signature request</div>
          <div className="font-mono text-[10px] text-ink-3">Your wallet · 0x7a…3f1c</div>
        </div>
      </div>
      <div className="mt-3 rounded-md bg-paper px-3 py-2 font-mono text-[10px] leading-relaxed text-ink-2">
        deposit(USDC, 5,000)
        <br />→ Morpho · Steakhouse vault
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <span className="rounded-md border border-line py-1.5 text-center text-[11px] text-ink-2">Reject</span>
        <span className="flex items-center justify-center gap-1 rounded-md bg-ink py-1.5 text-[11px] font-medium text-paper">
          <Fingerprint size={11} /> Sign
        </span>
      </div>
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Features"
            title={
              <>
                Total visibility across your DeFi book.{" "}
                <span className="text-ink-3">Built for people who trade a thesis, not a UI.</span>
              </>
            }
          />
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          <FeatureCard
            className="md:col-span-4"
            icon={<Activity size={16} />}
            title="Portfolio, unified"
            body="Every position on every chain in one clean view, instead of a dozen open tabs."
          >
            <PortfolioVisual />
          </FeatureCard>
          <FeatureCard
            className="md:col-span-2"
            delay={80}
            icon={<ShieldCheck size={16} />}
            title="Risk you can see"
            body="Health factor, net delta and concentration, visualized before they become a problem."
          >
            <RiskVisual />
          </FeatureCard>
          <FeatureCard
            className="md:col-span-2"
            icon={<Route size={16} />}
            title="The best route, found"
            body="Meridian compares venues and picks the clearest path to execute your view."
          >
            <RouteVisual />
          </FeatureCard>
          <FeatureCard
            className="md:col-span-2"
            delay={80}
            icon={<Newspaper size={16} />}
            title="Signal over noise"
            body="Curated DeFi news and yield moves, without the group-chat chaos."
          >
            <SignalVisual />
          </FeatureCard>
          <FeatureCard
            className="md:col-span-2"
            delay={160}
            icon={<Fingerprint size={16} />}
            title="You stay in control"
            body="Non-custodial by design. Nothing executes until you sign it in your own wallet."
          >
            <CustodyVisual />
          </FeatureCard>
        </div>
      </Container>
    </section>
  )
}

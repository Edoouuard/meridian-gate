import { useState, type ButtonHTMLAttributes, type ReactNode } from "react"
import { cn } from "@/lib/utils"

/* Small primitives mirroring meridian-terminal's globals.css classes
   (.card-kicker, .tag, .btn-primary, .seg …). */

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("text-[10px] uppercase tracking-[0.1em] text-t-accent", className)}>{children}</div>
  )
}

export function Tag({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode
  tone?: "neutral" | "accent" | "outline" | "good" | "warn" | "bad"
  className?: string
}) {
  const tones = {
    neutral: "bg-[#f8f4f4] text-[#444141]",
    accent: "bg-t-accent-100 text-t-accent-800",
    outline: "border border-t-accent text-t-accent",
    good: "bg-t-good/10 text-t-good",
    warn: "bg-t-warn/10 text-t-warn",
    bad: "bg-t-bad/10 text-t-bad",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[3px] px-2 py-[2px] text-[10px] uppercase tracking-[0.04em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

export function Btn({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "solid" }) {
  const v = {
    primary: "border-t-accent text-t-accent hover:bg-t-accent/10 active:bg-t-accent/20",
    secondary: "border-t-line text-t-text hover:bg-t-text/[0.07]",
    solid: "border-t-accent bg-t-accent text-t-bg hover:bg-white",
  }
  return (
    <button
      type="button"
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[4px] border px-3 py-1.5 text-[12px] transition-colors disabled:cursor-not-allowed disabled:opacity-45",
        v[variant],
        className
      )}
      {...props}
    />
  )
}

export function Seg<T extends string>({
  options,
  value,
  onChange,
  className,
  size = "md",
}: {
  options: readonly T[]
  value: T
  onChange: (v: T) => void
  className?: string
  size?: "sm" | "md"
}) {
  return (
    <div className={cn("flex rounded-[4px] border border-t-line p-[3px]", className)} role="tablist">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="tab"
          aria-selected={o === value}
          onClick={() => onChange(o)}
          className={cn(
            "flex-1 cursor-pointer rounded-[3px] transition-colors",
            size === "md" ? "px-2 py-1 text-[12px]" : "px-2 py-0.5 text-[11px]",
            o === value ? "bg-t-accent text-t-bg" : "text-t-text hover:bg-t-text/[0.08]"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

/** Protocol / chain icon with a lettered fallback if the CDN misses. */
export function TIcon({ src, name, size = 18 }: { src: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-t-surface font-t-head text-[10px] text-t-muted"
        style={{ width: size, height: size }}
      >
        {name[0]}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className="shrink-0 rounded-full bg-t-surface object-contain"
      style={{ width: size, height: size }}
    />
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-[4px] border border-t-line p-3", className)}>{children}</div>
}

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  )
}

/** Small mono label above section titles: "● HOW IT WORKS" */
export function Eyebrow({
  children,
  className,
  tone = "light",
}: {
  children: ReactNode
  className?: string
  tone?: "light" | "dark"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]",
        tone === "light" ? "text-ink-2" : "text-white/60",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  sub?: ReactNode
  align?: "left" | "center"
  tone?: "light" | "dark"
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "max-w-2xl text-[2rem] leading-[1.05] sm:text-5xl",
          tone === "light" ? "text-ink" : "text-white"
        )}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={cn(
            "max-w-xl text-base leading-relaxed sm:text-lg",
            tone === "light" ? "text-ink-2" : "text-white/60"
          )}
        >
          {sub}
        </p>
      )}
    </div>
  )
}

export const XLogo = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

/** Meridian mark: a meridian line through a globe. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10.25" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="4.25" ry="10.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 1.75v20.5" stroke="var(--accent)" strokeWidth="1.75" />
      </svg>
      <span className="font-display text-[19px] font-medium tracking-[-0.03em]">Meridian</span>
    </span>
  )
}

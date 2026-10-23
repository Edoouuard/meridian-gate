import { useState } from "react"
import { Lock } from "lucide-react"

/** The terminal this form opens. Override with VITE_TERMINAL_URL (no trailing slash). */
const TERMINAL_URL = (import.meta.env.VITE_TERMINAL_URL || "https://meridian-terminal-liart.vercel.app").replace(/\/+$/, "")

// Set by the terminal when it sends someone back: a wrong password, or every seat taken.
function accessFromUrl(): "wrong" | "full" | null {
  if (typeof window === "undefined") return null
  const v = new URLSearchParams(window.location.search).get("access")
  return v === "wrong" || v === "full" ? v : null
}

/**
 * Early access, under the waitlist CTA: people who have the beta password
 * enter it here and land in the terminal. The form posts straight to the
 * terminal's /api/beta-login, which checks it, takes a seat and opens the
 * terminal, or sends them back here with the reason.
 */
export function EarlyAccess() {
  const [refusal] = useState(accessFromUrl)

  return (
    <div id="early-access" className="w-full max-w-sm sm:max-w-md mt-8 animate-fade-rise-delay-2">
      <div className="flex items-center justify-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
        <Lock size={11} aria-hidden="true" />
        Early access · Restricted
      </div>
      <form
        method="POST"
        action={`${TERMINAL_URL}/api/beta-login`}
        className="mt-3 liquid-glass rounded-full flex items-center gap-2 pl-5 pr-1.5 py-1.5 sm:pl-6 sm:pr-2 sm:py-2 w-full"
      >
        <input type="hidden" name="from" value="landing" />
        <input type="hidden" name="next" value="/" />
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="Access password"
          aria-label="Early access password"
          className="flex-1 min-w-0 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="rounded-full border border-white/25 text-foreground px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap shrink-0 hover:bg-white/10 transition-colors cursor-pointer"
        >
          Enter the terminal →
        </button>
      </form>
      {refusal && (
        <p className={`mt-3 text-xs ${refusal === "wrong" ? "text-destructive" : "text-foreground"}`}>
          {refusal === "wrong"
            ? "Wrong password. Check it and try again."
            : "Early access is full for now: every seat is taken. Join the waitlist above and we'll let you in as seats open."}
        </p>
      )}
    </div>
  )
}

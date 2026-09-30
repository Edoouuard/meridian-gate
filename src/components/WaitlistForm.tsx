import { useEffect, useState, type FormEvent } from "react"
import { Copy, Check, Share2 } from "lucide-react"

const STORAGE_KEY = "meridian_referral_code"
const X_URL = "https://x.com/meridian_thesis"

type Status = {
  referralCode: string
  referralCount: number
  position: number
  confirmed?: boolean
}

// Set by /api/confirm when the user clicks the link in the confirmation email.
function confirmedFromUrl(): "1" | "invalid" | null {
  if (typeof window === "undefined") return null
  const v = new URLSearchParams(window.location.search).get("confirmed")
  return v === "1" || v === "invalid" ? v : null
}

function ReferralStatus({ status }: { status: Status }) {
  const [copied, setCopied] = useState(false)
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${status.referralCode}`
      : ""

  const tweetText =
    "I just joined the @meridian_thesis waitlist. The prompt-to-trade terminal for DeFi. Join me:"
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}&url=${encodeURIComponent(link)}`

  function handleCopy() {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="liquid-glass rounded-3xl px-6 py-6 sm:px-8 sm:py-7 mt-12 w-full max-w-sm sm:max-w-md text-center animate-fade-rise-delay-2">
      {status.confirmed ? (
        <p className="text-muted-foreground text-xs sm:text-sm mb-3">
          ✓ Email confirmed
        </p>
      ) : (
        <p className="text-foreground text-xs sm:text-sm mb-4 rounded-2xl border border-border/60 px-4 py-3">
          Check your inbox and click the link to confirm your email.
        </p>
      )}
      <p className="text-foreground text-base sm:text-lg">
        You're{" "}
        <span style={{ fontFamily: "'Instrument Serif', serif" }}>
          #{status.position}
        </span>{" "}
        on the list.
      </p>
      <p className="text-muted-foreground text-xs sm:text-sm mt-2">
        {status.referralCount > 0
          ? `${status.referralCount} friend${status.referralCount === 1 ? "" : "s"} joined through your link. Share it to move up further.`
          : "Share your link. Every friend who joins moves you up."}
      </p>

      <button
        type="button"
        onClick={handleCopy}
        className="liquid-glass rounded-full flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 sm:py-3 mt-5 w-full cursor-pointer hover:scale-[1.02] transition-transform"
      >
        <span className="text-foreground text-xs sm:text-sm truncate">
          {link}
        </span>
        {copied ? (
          <Check size={16} className="text-foreground shrink-0" />
        ) : (
          <Copy size={16} className="text-muted-foreground shrink-0" />
        )}
      </button>

      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="liquid-glass rounded-full flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 mt-3 w-full cursor-pointer hover:scale-[1.02] transition-transform"
      >
        <Share2 size={15} className="text-muted-foreground shrink-0" />
        <span className="text-foreground text-xs sm:text-sm">
          Share on X
        </span>
      </a>

      <div className="mt-6 pt-5 border-t border-white/10">
        <p className="text-muted-foreground text-xs sm:text-sm">
          Follow us on X to get all the updates.
        </p>
        <a
          href={X_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-primary text-primary-foreground flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 mt-3 w-full cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-xs sm:text-sm">Follow @meridian_thesis</span>
        </a>
      </div>
    </div>
  )
}

export function WaitlistForm({ id }: { id?: string }) {
  const [email, setEmail] = useState("")
  // Honeypot: invisible to humans, bots tend to fill every field.
  const [company, setCompany] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState<Status | null>(null)
  const [confirmState] = useState(confirmedFromUrl)

  useEffect(() => {
    if (confirmState) {
      // Clean the URL so a refresh doesn't show the message again.
      const url = new URL(window.location.href)
      url.searchParams.delete("confirmed")
      window.history.replaceState(null, "", url.toString())
    }

    const savedCode = localStorage.getItem(STORAGE_KEY)
    if (savedCode) {
      fetch(`/api/waitlist-status?code=${encodeURIComponent(savedCode)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setStatus(data)
          else localStorage.removeItem(STORAGE_KEY)
        })
        .catch(() => {})
    }

    function onJoined(e: Event) {
      setStatus((e as CustomEvent<Status>).detail)
    }
    window.addEventListener("meridian:waitlist-joined", onJoined)
    return () =>
      window.removeEventListener("meridian:waitlist-joined", onJoined)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email.")
      return
    }

    setError("")
    setSubmitting(true)
    try {
      const ref = new URLSearchParams(window.location.search).get("ref")
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ref, company }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(body.error || "Something went wrong. Try again.")
      }
      const newStatus: Status = {
        referralCode: body.referralCode,
        referralCount: body.referralCount,
        position: body.position,
        confirmed: body.confirmed,
      }
      localStorage.setItem(STORAGE_KEY, body.referralCode)
      setStatus(newStatus)
      window.dispatchEvent(
        new CustomEvent("meridian:waitlist-joined", { detail: newStatus })
      )
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (status) {
    return (
      <div id={id}>
        <ReferralStatus status={status} />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md mt-12 animate-fade-rise-delay-2">
      {confirmState === "1" && (
        <span className="mb-3 text-xs text-foreground">
          ✓ Email confirmed. You're on the list.
        </span>
      )}
      {confirmState === "invalid" && (
        <span className="mb-3 text-xs text-destructive">
          This confirmation link is invalid or expired. Sign up again to get a new one.
        </span>
      )}
      <form
        id={id}
        onSubmit={handleSubmit}
        className="liquid-glass rounded-full flex items-center gap-2 pl-5 pr-1.5 py-1.5 sm:pl-6 sm:pr-2 sm:py-2 w-full"
      >
        <input
          type="text"
          name="hp_field"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={submitting}
          className="bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground flex-1 min-w-0 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap shrink-0 hover:scale-[1.03] transition-transform cursor-pointer disabled:opacity-60 disabled:cursor-default disabled:hover:scale-100"
        >
          {submitting ? "Joining…" : "Join Waitlist"}
        </button>
      </form>
      {error && (
        <span className="mt-3 text-xs text-destructive">{error}</span>
      )}
    </div>
  )
}

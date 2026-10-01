import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { Copy, Check, Share2 } from "lucide-react"

const STORAGE_KEY = "meridian_referral_code"
const X_URL = "https://x.com/meridian_thesis"
const ANNOUNCEMENT_URL = "https://x.com/meridian_thesis/status/2105600165583507633"

type Status = {
  referralCode: string
  referralCount: number
  position: number
  confirmed?: boolean
  tasks?: string[]
}

// Set by /api/confirm when the user clicks the link in the confirmation email.
function confirmedFromUrl(): "1" | "invalid" | null {
  if (typeof window === "undefined") return null
  const v = new URLSearchParams(window.location.search).get("confirmed")
  return v === "1" || v === "invalid" ? v : null
}

const TASKS_KEY = "meridian_tasks_done"

type TaskId = "follow" | "engage" | "share" | "copy"

// Points shown to participants. Purely a marketing/engagement signal.
const TASK_POINTS: Record<TaskId, number> = { follow: 10, engage: 15, share: 10, copy: 5 }
const REFERRAL_POINTS = 5

function loadDone(): Record<TaskId, boolean> {
  try {
    return { follow: false, engage: false, share: false, copy: false, ...JSON.parse(localStorage.getItem(TASKS_KEY) || "{}") }
  } catch {
    return { follow: false, engage: false, share: false, copy: false }
  }
}

function XLogo({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function Task({
  n,
  title,
  points,
  done,
  children,
}: {
  n: number
  title: string
  points: string
  done: boolean
  children: ReactNode
}) {
  return (
    <div className="flex gap-3 text-left py-4 border-t border-white/10 first:border-t-0">
      <span
        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition-colors ${
          done ? "bg-primary text-primary-foreground" : "border border-white/25 text-muted-foreground"
        }`}
      >
        {done ? <Check size={13} strokeWidth={3} /> : n}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
            {title}
          </p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums ${
              done ? "bg-white/10 text-muted-foreground" : "bg-primary text-primary-foreground"
            }`}
          >
            {points}
          </span>
        </div>
        <div className="mt-2.5">{children}</div>
      </div>
    </div>
  )
}

function ReferralStatus({ status }: { status: Status }) {
  const [copied, setCopied] = useState(false)
  const [done, setDone] = useState<Record<TaskId, boolean>>(loadDone)
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${status.referralCode}`
      : ""

  const tweetText =
    "I just joined the @meridian_thesis waitlist. The prompt-to-trade terminal for DeFi. Join me:"
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}&url=${encodeURIComponent(link)}`

  function markDone(id: TaskId) {
    if (!done[id]) {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: status.referralCode, task: id }),
        keepalive: true,
      }).catch(() => {})
    }
    setDone((prev) => {
      const next = { ...prev, [id]: true }
      try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(next))
      } catch {
        /* storage unavailable */
      }
      return next
    })
  }

  function handleCopy() {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      markDone("copy")
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Tasks recorded on the server (e.g. completed on another device).
  useEffect(() => {
    const serverTasks = (status.tasks || []).filter((t): t is TaskId => t in TASK_POINTS)
    if (serverTasks.some((t) => !done[t])) {
      setDone((prev) => {
        const next = { ...prev }
        for (const t of serverTasks) next[t] = true
        try {
          localStorage.setItem(TASKS_KEY, JSON.stringify(next))
        } catch {
          /* storage unavailable */
        }
        return next
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.tasks])

  const completed = Object.values(done).filter(Boolean).length
  const points =
    (Object.keys(TASK_POINTS) as TaskId[]).reduce((sum, t) => sum + (done[t] ? TASK_POINTS[t] : 0), 0) +
    status.referralCount * REFERRAL_POINTS
  const buttonClass =
    "rounded-full flex items-center justify-center gap-2 px-4 py-2.5 w-full cursor-pointer hover:scale-[1.02] transition-transform text-xs sm:text-sm"

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
          ? `${status.referralCount} friend${status.referralCount === 1 ? "" : "s"} joined through your link.`
          : "Help us spread the word. Friends who join through your link move you up."}
      </p>

      <div className="flex items-center justify-between mt-6 mb-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>Your tasks · {completed}/4 done</span>
        <span className="text-foreground text-sm normal-case tracking-normal font-medium tabular-nums">
          {points} pts
        </span>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden mb-2">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${(completed / 4) * 100}%` }}
        />
      </div>

      <Task n={1} title="Follow Meridian on X" points={`+${TASK_POINTS.follow} pts`} done={done.follow}>
        <a
          href={X_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => markDone("follow")}
          className={`${buttonClass} bg-primary text-primary-foreground`}
        >
          <XLogo />
          <span>Follow @meridian_thesis</span>
        </a>
      </Task>

      <Task n={2} title="Comment, like & repost our announcement" points={`+${TASK_POINTS.engage} pts`} done={done.engage}>
        <a
          href={ANNOUNCEMENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => markDone("engage")}
          className={`${buttonClass} liquid-glass text-foreground`}
        >
          <XLogo />
          <span>Open the announcement</span>
        </a>
      </Task>

      <Task n={3} title="Share a post about Meridian" points={`+${TASK_POINTS.share} pts`} done={done.share}>
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => markDone("share")}
          className={`${buttonClass} liquid-glass text-foreground`}
        >
          <Share2 size={15} className="text-muted-foreground shrink-0" />
          <span>Post on X</span>
        </a>
      </Task>

      <Task n={4} title="Copy and share your referral link" points={`+${TASK_POINTS.copy} pts`} done={done.copy}>
        <button
          type="button"
          onClick={handleCopy}
          className="liquid-glass rounded-full flex items-center justify-between gap-3 px-4 py-2.5 w-full cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <span className="text-foreground text-xs sm:text-sm truncate">{link}</span>
          {copied ? (
            <Check size={16} className="text-foreground shrink-0" />
          ) : (
            <Copy size={16} className="text-muted-foreground shrink-0" />
          )}
        </button>
        <div className="flex items-center justify-between gap-2 mt-3 rounded-2xl border border-white/10 px-3 py-2">
          <span className="text-[11px] sm:text-xs text-muted-foreground text-left">
            Each friend who joins through your link
            {status.referralCount > 0 ? ` (${status.referralCount} so far)` : ""}
          </span>
          <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium bg-primary text-primary-foreground">
            +{REFERRAL_POINTS} pts each
          </span>
        </div>
      </Task>
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
  const [invited] = useState(
    () => typeof window !== "undefined" && !!new URLSearchParams(window.location.search).get("ref")
  )

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
      {invited && id && !confirmState && (
        <span className="mb-3 rounded-full liquid-glass px-4 py-1.5 text-xs text-foreground">
          You've been invited by a friend. Join the waitlist below.
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
      <p className="mt-3 text-[11px] text-muted-foreground/80">
        By joining, you agree to receive emails from Meridian. Unsubscribe anytime.
      </p>
    </div>
  )
}

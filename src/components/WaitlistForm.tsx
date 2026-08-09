import { useState, type FormEvent } from "react"

export function WaitlistForm({ id }: { id?: string }) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email.")
      return
    }

    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Something went wrong. Try again.")
      }
      setSubmitted(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div
        id={id}
        className="liquid-glass rounded-full px-8 sm:px-14 py-4 sm:py-5 text-sm sm:text-base text-foreground mt-12 animate-fade-rise-delay-2 max-w-full text-center"
      >
        You're on the list. We'll be in touch.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md mt-12 animate-fade-rise-delay-2">
      <form
        id={id}
        onSubmit={handleSubmit}
        className="liquid-glass rounded-full flex items-center gap-2 pl-5 pr-1.5 py-1.5 sm:pl-6 sm:pr-2 sm:py-2 w-full"
      >
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

import { useState, type FormEvent } from "react"

// No backend wired yet — this only confirms locally in the UI.
// Wire to a real capture service (e.g. Resend, Formspree, Airtable) before
// treating any submission as an actual signup.
export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email.")
      return
    }
    setError("")
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div
        id="waitlist"
        className="liquid-glass rounded-full px-14 py-5 text-base text-foreground mt-12 animate-fade-rise-delay-2"
      >
        You're on the list — we'll be in touch.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center mt-12 animate-fade-rise-delay-2">
      <form
        id="waitlist"
        onSubmit={handleSubmit}
        className="liquid-glass rounded-full flex items-center gap-2 pl-6 pr-2 py-2"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground w-48 sm:w-64"
        />
        <button
          type="submit"
          className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm hover:scale-[1.03] transition-transform cursor-pointer"
        >
          Join Waitlist
        </button>
      </form>
      {error && (
        <span className="mt-3 text-xs text-destructive">{error}</span>
      )}
    </div>
  )
}

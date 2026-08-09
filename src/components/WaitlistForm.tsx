import { useState, type FormEvent } from "react"

// No backend wired yet — this only confirms locally in the UI.
// Wire to a real capture service (e.g. Resend, Formspree, Airtable) before
// treating any submission as an actual signup.
export function WaitlistForm({ id }: { id?: string }) {
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
          className="bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground flex-1 min-w-0"
        />
        <button
          type="submit"
          className="rounded-full bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap shrink-0 hover:scale-[1.03] transition-transform cursor-pointer"
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

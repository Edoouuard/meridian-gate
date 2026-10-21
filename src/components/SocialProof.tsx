import { useEffect, useState } from "react"

export function SocialProof() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/waitlist-count")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && typeof data.count === "number") setCount(data.count)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (count === null || count === 0) return null

  return (
    <p className="mt-4 flex items-center gap-2 text-xs text-ink-2 sm:text-sm">
      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
      <span>
        <span className="font-medium text-ink">{count.toLocaleString()}</span>{" "}
        {count === 1 ? "person has" : "people have"} already joined
      </span>
    </p>
  )
}

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
    <p className="mt-4 text-xs sm:text-sm text-muted-foreground">
      {count.toLocaleString()} {count === 1 ? "person has" : "people have"}{" "}
      already joined
    </p>
  )
}

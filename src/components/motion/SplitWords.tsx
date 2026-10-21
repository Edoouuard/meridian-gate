import type { ReactNode } from "react"

/**
 * Splits a line into words that rise and un-blur one after another.
 * Each `lines` entry is one line; words keep their own className.
 */
export function SplitWords({
  lines,
  baseDelay = 0,
  step = 70,
}: {
  lines: { text: string; className?: string }[][]
  baseDelay?: number
  step?: number
}) {
  let n = 0
  const out: ReactNode[] = []
  lines.forEach((line, li) => {
    line.forEach((chunk) => {
      chunk.text.split(" ").forEach((word, wi, arr) => {
        const d = baseDelay + n++ * step
        out.push(
          <span key={`${li}-${n}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span className={`word-in inline-block ${chunk.className ?? ""}`} style={{ animationDelay: `${d}ms` }}>
              {word}
            </span>
            {wi < arr.length - 1 || chunk !== line[line.length - 1] ? " " : ""}
          </span>
        )
      })
    })
    if (li < lines.length - 1) out.push(<br key={`br-${li}`} />)
  })
  return <>{out}</>
}

import { useEffect, useState } from "react"

const EXAMPLES = [
  "Hedge my portfolio against ETH downside",
  "Lock in 8% fixed yield on USDC",
  "Go long ETH with 2x leverage",
  "Rotate idle stables into Pendle",
]

const TYPE_SPEED = 45
const DELETE_SPEED = 25
const HOLD_MS = 1500

export function ThesisBar() {
  const [exampleIndex, setExampleIndex] = useState(0)
  const [text, setText] = useState("")
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">(
    "typing"
  )

  useEffect(() => {
    const target = EXAMPLES[exampleIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (phase === "typing") {
      if (text.length < target.length) {
        timeout = setTimeout(
          () => setText(target.slice(0, text.length + 1)),
          TYPE_SPEED
        )
      } else {
        timeout = setTimeout(() => setPhase("holding"), HOLD_MS)
      }
    } else if (phase === "holding") {
      timeout = setTimeout(() => setPhase("deleting"), 0)
    } else {
      if (text.length > 0) {
        timeout = setTimeout(
          () => setText(text.slice(0, -1)),
          DELETE_SPEED
        )
      } else {
        setExampleIndex((i) => (i + 1) % EXAMPLES.length)
        setPhase("typing")
      }
    }

    return () => clearTimeout(timeout)
  }, [text, phase, exampleIndex])

  return (
    <div className="liquid-glass rounded-full flex items-center px-8 py-6 max-w-2xl mx-auto min-h-[4.5rem]">
      <span className="text-lg sm:text-xl text-foreground">{text}</span>
      <span className="inline-block w-[2px] h-6 bg-foreground ml-1 animate-pulse" />
    </div>
  )
}

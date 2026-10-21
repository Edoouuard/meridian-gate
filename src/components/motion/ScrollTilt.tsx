import { useEffect, useRef, type ReactNode } from "react"

/**
 * Scroll-linked entrance: the child starts tilted back and slightly smaller,
 * then settles flat as it scrolls into the middle of the viewport.
 */
export function ScrollTilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the top edge is at the bottom of the screen, 1 when it reaches ~25% from the top
      const p = Math.min(Math.max((vh - r.top) / (vh * 0.75), 0), 1)
      const e = 1 - Math.pow(1 - p, 3)
      el.style.transform = `perspective(1600px) rotateX(${(1 - e) * 14}deg) scale(${0.92 + e * 0.08}) translateY(${(1 - e) * 40}px)`
      el.style.opacity = String(0.35 + e * 0.65)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div ref={ref} className={className} style={{ transformOrigin: "50% 0%", willChange: "transform" }}>
      {children}
    </div>
  )
}

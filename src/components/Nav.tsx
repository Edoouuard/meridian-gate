import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Container, Logo, XLogo } from "@/components/Section"
import { cn } from "@/lib/utils"

const X_URL = "https://x.com/meridian_thesis"

const LINKS = [
  { label: "Live demo", href: "#demo" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Coverage", href: "#coverage" },
  { label: "FAQ", href: "#faq" },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  // Light text while the nav sits over the dark hero, paper bar after it.
  const [overDark, setOverDark] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      const hero = document.getElementById("top")
      const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - 160 : 0
      setOverDark(y < heroEnd - 64)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        !scrolled
          ? "border-b border-transparent"
          : overDark
            ? "border-b border-white/10 bg-night/60 backdrop-blur-md"
            : "border-b border-line bg-paper/80 backdrop-blur-md"
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" aria-label="Meridian home" className={`transition-colors ${overDark ? "text-white" : "text-ink"}`}>
          <Logo />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${overDark ? "text-white/70 hover:text-white" : "text-ink-2 hover:text-ink"}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Meridian on X"
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${overDark ? "border-white/20 text-white hover:border-white/40" : "border-line bg-surface text-ink hover:border-line-strong"}`}
          >
            <XLogo size={13} />
          </a>
          <a
            href="#waitlist"
            className={`group flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors ${overDark ? "bg-white text-night hover:bg-white/85" : "bg-ink text-paper hover:bg-accent"}`}
          >
            Join waitlist
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </Container>
    </header>
  )
}

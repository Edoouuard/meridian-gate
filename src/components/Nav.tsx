import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Container, Logo, XLogo } from "@/components/Section"
import { cn } from "@/lib/utils"

const X_URL = "https://x.com/meridian_thesis"

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Coverage", href: "#coverage" },
  { label: "FAQ", href: "#faq" },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-line bg-paper/80 backdrop-blur-md"
          : "border-b border-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" aria-label="Meridian home" className="text-ink">
          <Logo />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-ink-2 transition-colors hover:text-ink"
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
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-surface text-ink transition-colors hover:border-line-strong"
          >
            <XLogo size={13} />
          </a>
          <a
            href="#waitlist"
            className="group flex h-9 items-center gap-1.5 rounded-[10px] bg-ink px-3.5 text-sm font-medium text-paper transition-colors hover:bg-accent"
          >
            Join waitlist
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </Container>
    </header>
  )
}

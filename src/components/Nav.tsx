const NAV_LINKS = [
  { label: "Home", href: "#", active: true },
  { label: "Terminal", href: "#" },
  { label: "Protocols", href: "#" },
  { label: "Journal", href: "#" },
  { label: "Contact", href: "#" },
]

export function Nav() {
  return (
    <nav className="relative z-10 flex flex-row items-center justify-between px-8 py-6 max-w-7xl mx-auto">
      <span
        className="text-3xl tracking-tight text-foreground"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Meridian
      </span>

      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={
              link.active
                ? "text-sm text-foreground"
                : "text-sm text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            {link.label}
          </a>
        ))}
      </div>

      <a
        href="#waitlist"
        className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-transform cursor-pointer"
      >
        Join Waitlist
      </a>
    </nav>
  )
}

export function Nav() {
  return (
    <nav className="relative z-10 flex flex-row items-center justify-between px-8 py-6 max-w-7xl mx-auto">
      <span
        className="text-3xl tracking-tight text-foreground"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Meridian
      </span>

      <a
        href="#waitlist"
        className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-transform cursor-pointer"
      >
        Join Waitlist
      </a>
    </nav>
  )
}

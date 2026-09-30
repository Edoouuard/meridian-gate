const X_URL = "https://x.com/meridian_thesis"

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
        href={X_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow Meridian on X"
        className="liquid-glass rounded-full flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-foreground hover:scale-[1.03] transition-transform"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span className="hidden sm:inline">Follow us</span>
      </a>
    </nav>
  )
}

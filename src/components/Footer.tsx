import { Container, Logo, XLogo } from "@/components/Section"

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Live demo", href: "#demo" },
  { label: "FAQ", href: "#faq" },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo className="text-ink" />
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            The prompt-to-trade terminal for DeFi. Form your thesis, execute it, all at once.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-12 gap-y-8">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Product</div>
            <ul className="mt-3 flex flex-col gap-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-ink-2 hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Community</div>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <a
                  href="https://x.com/meridian_thesis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink"
                >
                  <XLogo size={12} /> @meridian_thesis
                </a>
              </li>
              <li>
                <a href="#waitlist" className="text-sm text-ink-2 hover:text-ink">
                  Join the waitlist
                </a>
              </li>
            </ul>
          </div>
          <a
            href="https://codehype.ai/product/meridian?utm_source=codehype_badge"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start"
          >
            <img
              src="https://codehype.ai/badges/meridian.svg?variant=find-us&v=20"
              alt="Featured on CodeHype"
              width={150}
              height={54}
              loading="lazy"
              decoding="async"
              className="h-auto w-[150px]"
            />
          </a>
        </div>
      </Container>
      <Container className="flex flex-col justify-between gap-2 border-t border-line py-6 text-xs text-ink-3 sm:flex-row">
        <span>© {new Date().getFullYear()} Meridian. All rights reserved.</span>
        <span>Non-custodial. Not financial advice.</span>
      </Container>
    </footer>
  )
}

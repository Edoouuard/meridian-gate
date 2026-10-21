import { MousePointerClick } from "lucide-react"
import { Container, SectionHeading } from "@/components/Section"
import { Reveal } from "@/components/Reveal"
import { LiveTerminal } from "@/components/terminal/LiveTerminal"
import { ScrollTilt } from "@/components/motion/ScrollTilt"

export function DemoSection() {
  return (
    <section id="demo" className="relative border-t border-line bg-surface py-16 sm:py-20">
      <Container className="max-w-7xl">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Live demo"
              title={
                <>
                  The terminal, live.{" "}
                  <span className="text-ink-3">Type a thesis and watch it become a trade.</span>
                </>
              }
            />
            <p className="flex max-w-xs items-start gap-2 text-sm leading-relaxed text-ink-2">
              <MousePointerClick size={16} className="mt-0.5 shrink-0 text-accent" />
              Everything is clickable. Demo wallet and illustrative figures; nothing touches a real wallet.
            </p>
          </div>
        </Reveal>
        <ScrollTilt className="mt-8 sm:mt-10">
          <LiveTerminal />
        </ScrollTilt>
      </Container>
    </section>
  )
}

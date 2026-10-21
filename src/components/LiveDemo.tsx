import { Reveal } from "@/components/Reveal"
import { ScrollTilt } from "@/components/motion/ScrollTilt"
import { LiveTerminal } from "@/components/terminal/LiveTerminal"

export function LiveDemo() {
  return (
    <section id="demo" className="relative bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-28">
        <Reveal className="flex flex-col items-center text-center">
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Live demo
          </span>
          <h2
            className="mt-4 text-3xl sm:text-5xl text-foreground max-w-2xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Try the terminal.{" "}
            <em className="not-italic text-muted-foreground">Right here.</em>
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mt-4">
            Type a thesis or click around. Everything works, on a demo wallet with
            illustrative figures. Nothing touches a real wallet.
          </p>
        </Reveal>

        <ScrollTilt className="mt-14">
          <LiveTerminal />
        </ScrollTilt>
      </div>
    </section>
  )
}

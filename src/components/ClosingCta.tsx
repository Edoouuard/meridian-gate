import { Reveal } from "@/components/Reveal"
import { WaitlistForm } from "@/components/WaitlistForm"

export function ClosingCta() {
  return (
    <section className="relative bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-8 py-28 flex flex-col items-center text-center">
        <Reveal className="flex flex-col items-center">
          <h2
            className="text-4xl sm:text-5xl text-foreground max-w-2xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Be early to{" "}
            <em className="not-italic text-muted-foreground">Meridian.</em>
          </h2>
          <p className="text-muted-foreground text-base max-w-md mt-4">
            Join the waitlist. We'll let you know the moment it opens.
          </p>
          <WaitlistForm />
        </Reveal>
      </div>
    </section>
  )
}

import { useInView } from "@/hooks/useInView"
import { WaitlistForm } from "@/components/WaitlistForm"

export function ClosingCta() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section className="relative bg-background border-t border-border">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-8 py-28 flex flex-col items-center text-center ${inView ? "animate-fade-rise" : "opacity-0"}`}
      >
        <h2
          className="text-4xl sm:text-5xl text-foreground max-w-2xl"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Be early to{" "}
          <em className="not-italic text-muted-foreground">Meridian.</em>
        </h2>
        <p className="text-muted-foreground text-base max-w-md mt-4">
          Join the waitlist — we'll let you know the moment it opens.
        </p>
        <WaitlistForm />
      </div>
    </section>
  )
}

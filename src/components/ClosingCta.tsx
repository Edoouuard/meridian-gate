import { Container } from "@/components/Section"
import { Reveal } from "@/components/Reveal"
import { WaitlistForm } from "@/components/WaitlistForm"

export function ClosingCta() {
  return (
    <section className="pb-24 sm:pb-32">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-16 text-center sm:px-12 sm:py-20">
            <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="relative flex flex-col items-center">
              <h2 className="max-w-3xl text-4xl leading-[1.05] text-ink sm:text-6xl">
                Ready to trade <span className="text-accent">your thesis?</span>
              </h2>
              <p className="mt-5 max-w-md text-base text-ink-2 sm:text-lg">
                Join the waitlist. We'll let you know the moment Meridian opens.
              </p>
              <WaitlistForm />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

import { Nav } from "@/components/Nav"
import { WaitlistForm } from "@/components/WaitlistForm"

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"

export function Hero() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      <Nav />

      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-40 py-[90px]">
        <h1
          className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Where <em className="not-italic text-muted-foreground">conviction</em>{" "}
          rises{" "}
          <em className="not-italic text-muted-foreground">
            through the noise.
          </em>
        </h1>

        <p className="animate-fade-rise-delay text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed">
          We're building the terminal for deep thinkers navigating on-chain
          markets, deliberate allocators, and quiet believers in a
          decentralized future. Amid the noise of a thousand protocols,
          Meridian brings one clear place to think, decide, and act.
        </p>

        <WaitlistForm />
      </div>
    </div>
  )
}

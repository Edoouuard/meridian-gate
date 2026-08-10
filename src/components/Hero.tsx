import { useEffect, useRef } from "react"
import { Nav } from "@/components/Nav"
import { WaitlistForm } from "@/components/WaitlistForm"
import { SocialProof } from "@/components/SocialProof"

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        {...{ "webkit-playsinline": "true" }}
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      <Nav />

      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-40 py-[90px]">
        <span className="animate-fade-rise text-xs tracking-[0.2em] uppercase text-muted-foreground">
          Prompt-to-trade · DeFi terminal
        </span>

        <h1
          className="animate-fade-rise-delay mt-6 text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-6xl font-normal text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Form your thesis. Execute it.
          <br />
          <em className="not-italic text-muted-foreground">All at once.</em>
        </h1>

        <p className="animate-fade-rise-delay text-muted-foreground text-base sm:text-lg max-w-xl mt-6 leading-relaxed">
          Say what you believe. Meridian turns it into an executable trade
          across every major protocol, with the risk shown up front.
        </p>

        <WaitlistForm id="waitlist" />
        <SocialProof />
      </div>
    </div>
  )
}

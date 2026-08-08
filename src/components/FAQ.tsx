import { useState } from "react"
import { Plus } from "lucide-react"
import { Reveal } from "@/components/Reveal"

const FAQS = [
  {
    q: "What is Meridian?",
    a: "A prompt-to-trade terminal for DeFi. Type what you believe, and Meridian turns it into an executable trade across the protocols and chains it supports, with the risk shown before you sign.",
  },
  {
    q: "Does Meridian custody my funds?",
    a: "No. Meridian is non-custodial. Every trade it proposes is reviewed by you and only executes once you sign it in your own wallet.",
  },
  {
    q: "Which protocols and chains are supported?",
    a: "Aave, Morpho, Lido, Pendle, Hyperliquid, and Uniswap today, across Ethereum, Base, Arbitrum, Optimism, Polygon, and Avalanche, with more being added.",
  },
  {
    q: "Do I need to know DeFi jargon to use it?",
    a: "No. You describe your thesis in plain English. Meridian handles translating it into the right protocol, position, and route.",
  },
  {
    q: "When can I get access?",
    a: "Meridian is in private beta. Join the waitlist and we'll let you know the moment it opens.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="relative bg-background border-t border-border">
      <div className="max-w-3xl mx-auto px-8 py-28">
        <Reveal>
          <h2
            className="text-3xl sm:text-4xl text-foreground text-center"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Questions,{" "}
            <em className="not-italic text-muted-foreground">answered.</em>
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <Reveal key={faq.q} delay={80 + i * 80}>
                <div className="liquid-glass rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                  >
                    <span className="text-foreground text-base sm:text-lg">
                      {faq.q}
                    </span>
                    <Plus
                      size={20}
                      className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-out"
                    style={{ maxHeight: isOpen ? "200px" : "0px" }}
                  >
                    <p className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

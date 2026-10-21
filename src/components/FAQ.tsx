import { useState } from "react"
import { Plus } from "lucide-react"
import { Container, SectionHeading } from "@/components/Section"
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
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="border-t border-line py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered."
            sub={
              <>
                Something else on your mind? Ask us on{" "}
                <a
                  href="https://x.com/meridian_thesis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent"
                >
                  X
                </a>
                .
              </>
            }
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="border-t border-line">
            {FAQS.map((faq, i) => {
              const isOpen = openIndex === i
              return (
                <div key={faq.q} className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="font-display text-lg tracking-tight text-ink sm:text-xl">{faq.q}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 ${
                        isOpen ? "border-ink bg-ink text-paper" : "border-line bg-surface text-ink"
                      }`}
                    >
                      <Plus size={15} className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-xl pb-6 text-[15px] leading-relaxed text-ink-2">{faq.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import Image from "next/image";

export default function BuySellHorsesPage() {
  return (
    <div className="py-14">
      <Container>
        <Reveal delayMs={60}>
          <SectionHeading
            eyebrow="Webuyhorses by Pasio Life"
            title="A safer marketplace for horses"
            subtitle="Inspired by webuycars—built with trust, transparency, and horse welfare at the center."
          />
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          <Reveal delayMs={120}>
            <div className="rounded-3xl bg-sand-50/60 p-8 ring-1 ring-ink-900/10 shadow-glow">
              <div className="font-display text-2xl font-bold tracking-tight">Why it exists</div>
              <p className="mt-3 text-sm leading-relaxed text-ink-900/70">
                Horses are not products. They are living partners with needs, emotions, and
                individual stories. Our marketplace is designed to help horses find the right homes—
                and to help people find the right horses safely.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-900/70">
                We focus on care, matching, and clear communication—so everyone feels protected.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="/contact?topic=Sell%20Your%20Horse"
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  Sell Your Horse
                </ButtonLink>
                <ButtonLink
                  href="/contact?topic=Buy%20a%20Horse"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Buy a Horse
                </ButtonLink>
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={160}>
            <div className="relative overflow-hidden rounded-3xl ring-1 ring-ink-900/10">
              <Image
                src="/images/BiscuitNationals.jpg"
                alt="Horse welfare and safety"
                width={1400}
                height={1000}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/45 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="font-display text-2xl font-bold text-sand-50">
                  Trust is the product
                </div>
                <div className="mt-2 text-sm text-sand-50/80">
                  Welfare first. Clear matching. Calm conversations.
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Sell Your Horse",
              desc: "Tell us their story—temperament, experience, and care needs. We help you present honestly.",
              topic: "Sell Your Horse"
            },
            {
              title: "Buy a Horse",
              desc: "Share your goals and experience. We match you to horses with safe, suitable temperaments.",
              topic: "Buy a Horse"
            },
            {
              title: "How it Works",
              desc: "Screening, welfare checks, and guided conversations—designed to protect horses and people.",
              topic: "How it Works"
            }
          ].map((card, idx) => (
            <Reveal key={card.title} delayMs={idx * 110}>
              <div className="rounded-3xl bg-sand-50/60 p-6 ring-1 ring-ink-900/10 shadow-glow">
                <div className="font-display text-xl font-bold tracking-tight">{card.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-ink-900/70">{card.desc}</div>
                <div className="mt-5">
                  <ButtonLink
                    href={`/contact?topic=${encodeURIComponent(card.topic)}`}
                    variant="ghost"
                    className="px-0 py-0"
                  >
                    Enquire
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={200}>
          <div className="mt-12 rounded-[2.5rem] bg-ink-900/5 p-10 ring-1 ring-ink-900/10 shadow-glow">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="font-display text-3xl font-bold tracking-tight">
                  A marketplace built for horse welfare
                </div>
                <div className="mt-3 text-sm leading-relaxed text-ink-900/70">
                  If a match isn’t right, we don’t push it. We’d rather take the time than risk the outcome.
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact?topic=Horse%20Welfare%20Safety" variant="secondary">
                  Ask about safety checks
                </ButtonLink>
                <ButtonLink href="/contact?topic=Start%20a%20Listing" variant="primary">
                  Start a listing
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}


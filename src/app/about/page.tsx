import Image from "next/image";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="py-14">
      <Container>
        <Reveal delayMs={60}>
          <SectionHeading
            eyebrow="About Pasio Life"
            title="A place where dreams feel real"
            subtitle="This is a horse-led adventure lifestyle brand—built with heart, grounded in nature, and inspired by freedom."
          />
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          <Reveal delayMs={120}>
            <div className="rounded-3xl bg-sand-50/60 p-8 ring-1 ring-ink-900/10 shadow-glow">
              <div className="font-display text-2xl font-bold tracking-tight">Story</div>
              <p className="mt-3 text-sm leading-relaxed text-ink-900/75">
                Pasio Life began with a longing: to give people a different kind of experience. Not
                a quick activity—but a lifestyle moment where you feel understood by nature and
                welcomed by horses.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-900/75">
                We coach with patience. We ride with intention. And we celebrate the small
                transformation that happens when trust grows—slowly, beautifully, and for real.
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={160}>
            <div className="relative overflow-hidden rounded-3xl ring-1 ring-ink-900/10">
              <Image
                src="/images/Purple.jpg"
                alt="Nature landscape"
                width={1400}
                height={1000}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/45 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-xs font-semibold tracking-[0.18em] uppercase text-sand-50/80">
                  Vision
                </div>
                <div className="font-display text-3xl font-bold text-sand-50">
                  A place where dreams come true
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Horses living naturally",
              body: "We honour wellbeing, calm routines, and respectful training principles."
            },
            {
              title: "Connection before control",
              body: "You’ll learn through listening—so confidence is built with trust."
            },
            {
              title: "Passion for life",
              body: "Freedom isn’t just a feeling. It’s a way of showing up—every day."
            }
          ].map((c, idx) => (
            <Reveal key={c.title} delayMs={idx * 110}>
              <div className="rounded-3xl bg-sand-50/60 p-6 ring-1 ring-ink-900/10 shadow-glow">
                <div className="font-display text-xl font-bold tracking-tight">{c.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-ink-900/70">{c.body}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl text-sm leading-relaxed text-ink-900/70">
            If you’re ready to meet horses in a way that feels meaningful—start with an experience,
            then let the journey unfold.
          </div>
          <ButtonLink href="/experiences" variant="secondary">
            Explore experiences
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}


import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import SubscribePanel from "@/components/school/SubscribePanel";

export default function SchoolLandingPage() {
  return (
    <div className="py-14">
      <Container>
        <Reveal delayMs={70}>
          <SectionHeading
            eyebrow="School of Life by Pasio Life"
            title="Learn horse theory online—feel it in your bones"
            subtitle="A calm, progressive learning space. Start with fundamentals, then build deeper understanding through structured levels."
          />
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          <Reveal delayMs={120}>
            <div className="space-y-6">
              <div className="rounded-3xl bg-sand-50/60 p-8 ring-1 ring-ink-900/10 shadow-glow">
                <div className="font-display text-2xl font-bold tracking-tight">
                  Three learning levels
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-900/70">
                  Each level unlocks new theory modules and course notes. Your dashboard keeps your progress together.
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    {
                      level: "Beginner",
                      desc: "Behavior basics, safe handling mindset, and confident groundwork."
                    },
                    {
                      level: "Intermediate",
                      desc: "Signals, riding balance, and how trust grows through practice."
                    },
                    {
                      level: "Advanced",
                      desc: "Training principles, reading horse language deeper, and lifelong care."
                    }
                  ].map((x) => (
                    <div key={x.level} className="rounded-2xl bg-sand-50 px-4 py-3 ring-1 ring-ink-900/10">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-display text-lg font-bold tracking-tight">{x.level}</div>
                        <div className="rounded-full bg-ink-900/5 px-3 py-1 text-xs font-semibold text-ink-900/70 ring-1 ring-ink-900/10">
                          Locked until subscribed
                        </div>
                      </div>
                      <div className="mt-2 text-sm leading-relaxed text-ink-900/70">{x.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink
                    href="/school-of-life/login"
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Login
                  </ButtonLink>
                  <ButtonLink href="/school-of-life/signup" className="w-full sm:w-auto">
                    Create account
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={160}>
            <SubscribePanel />
          </Reveal>
        </div>
      </Container>
    </div>
  );
}


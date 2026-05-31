import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/forms/ContactForm";
import { ButtonLink } from "@/components/ui/Button";

type ContactSearchParams = Promise<{
  topic?: string | string[];
  experience?: string | string[];
}>;

type ContactPageProps = {
  searchParams: ContactSearchParams;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const topicParam = params.topic;
  const expParam = params.experience;

  const topic =
    typeof topicParam === "string" ? topicParam : Array.isArray(topicParam) ? topicParam[0] : "";
  const experience =
    typeof expParam === "string" ? expParam : Array.isArray(expParam) ? expParam[0] : "";

  return (
    <div className="py-14">
      <Container>
        <Reveal delayMs={60}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <div className="font-display text-4xl font-bold tracking-tight">Contact Pasio Life</div>
              <div className="mt-3 text-sm leading-relaxed text-ink-900/70">
                Near Parys, South Africa. Tell us what you want to feel—and we’ll help you plan an
                experience that fits your dream.
              </div>
              <div className="mt-6 space-y-2 text-sm font-semibold text-ink-900/75">
                <div>Location: Parys area, South Africa</div>
                <div>Hours: by appointment</div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="https://instagram.com/" variant="secondary">
                  Instagram
                </ButtonLink>
                <ButtonLink href="https://facebook.com/" variant="ghost">
                  Facebook
                </ButtonLink>
              </div>
            </div>

            <div className="w-full lg:max-w-xl">
              <div className="rounded-[2.25rem] bg-sand-50/60 p-6 ring-1 ring-ink-900/10 shadow-glow">
                <ContactForm initialTopic={topic || undefined} initialExperience={experience || undefined} />
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "General enquiries",
              body: "Ask us anything about Pasio Life and we’ll reply with the best next step."
            },
            {
              title: "Horse welfare first",
              body: "We ask questions so horses and people stay safe and comfortable."
            },
            {
              title: "Dream-life planning",
              body: "Tell us what you want to feel. We’ll shape the day around it."
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
      </Container>
    </div>
  );
}


import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import AuthForms from "@/components/school/AuthForms";
import { ButtonLink } from "@/components/ui/Button";

export default function SchoolLoginPage() {
  return (
    <div className="py-14">
      <Container>
        <Reveal delayMs={60}>
          <SectionHeading
            eyebrow="School of Life"
            title="Login"
            subtitle="Welcome back. Let’s keep learning—one calm lesson at a time."
          />
        </Reveal>

        <div className="mt-10 max-w-xl">
          <Reveal delayMs={120}>
            <div className="rounded-3xl bg-sand-50/60 p-8 ring-1 ring-ink-900/10 shadow-glow">
              <AuthForms mode="login" />
              <div className="mt-4 text-sm text-ink-900/70">
                New here?{" "}
                <ButtonLink href="/school-of-life/signup" variant="ghost" className="p-0">
                  Create your account
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}


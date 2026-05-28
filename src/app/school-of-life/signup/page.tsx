import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import AuthForms from "@/components/school/AuthForms";
import { ButtonLink } from "@/components/ui/Button";

export default function SchoolSignupPage() {
  return (
    <div className="py-14">
      <Container>
        <Reveal delayMs={60}>
          <SectionHeading
            eyebrow="School of Life"
            title="Create your account"
            subtitle="A gentle place to learn horse theory online. Unlock your dashboard after signup."
          />
        </Reveal>

        <div className="mt-10 max-w-xl">
          <Reveal delayMs={120}>
            <div className="rounded-3xl bg-sand-50/60 p-8 ring-1 ring-ink-900/10 shadow-glow">
              <AuthForms mode="signup" />
              <div className="mt-4 text-sm text-ink-900/70">
                Already have an account?{" "}
                <ButtonLink href="/school-of-life/login" variant="ghost" className="p-0">
                  Login
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}


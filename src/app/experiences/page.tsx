import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ExperienceCard from "@/components/cards/ExperienceCard";
import { ButtonLink } from "@/components/ui/Button";
import { publicImagePath, siteImages } from "@/lib/images";

export default function ExperiencesPage() {
  const { experiences: img } = siteImages;

  const experiences = [
    {
      title: "Horse Riding Trails",
      eyebrow: "Freedom on Earth",
      description: "Ride through nature with a pace that feels like your own rhythm.",
      imageSrc: publicImagePath(img.trails),
      href: "/booking?topic=Horse%20Riding%20Trails&experience=Trail%20Ride",
      ctaLabel: "Book"
    },
    {
      title: "Clinics",
      eyebrow: "Learn with Intention",
      description: "Coaching for technique, confidence, and kind communication.",
      imageSrc: publicImagePath(img.clinics),
      href: "/booking?topic=Clinics&experience=Coaching%20Clinic",
      ctaLabel: "Enquire"
    },
    {
      title: "Horse Riding Lessons",
      eyebrow: "From Ground Up",
      description: "Build connection first—then skills that last.",
      imageSrc: publicImagePath(img.lessons),
      href: "/booking?topic=Riding%20Lessons&experience=Lessons",
      ctaLabel: "Book"
    },
    {
      title: "Pony Camps",
      eyebrow: "Dream Days",
      description: "A camp where young hearts learn calm courage with horses.",
      imageSrc: publicImagePath(img.ponyCamps),
      href: "/booking?topic=Pony%20Camps&experience=Pony%20Camp",
      ctaLabel: "Enquire"
    },
    {
      title: "Parties",
      eyebrow: "A Celebration with Heart",
      description: "A safe, thoughtful horse experience designed for joy.",
      imageSrc: publicImagePath(img.parties),
      href: "/booking?topic=Parties&experience=Horse%20Party",
      ctaLabel: "Book"
    }
  ];

  return (
    <div className="py-14">
      <Container>
        <Reveal delayMs={80}>
          <SectionHeading
            eyebrow="Experiences"
            title="Adventure, guided by horses"
            subtitle="Every experience at Pasio Life is designed to protect horse welfare and grow real connection."
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {experiences.map((x, idx) => (
            <Reveal key={x.title} delayMs={idx * 70}>
              <ExperienceCard {...x} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl text-sm leading-relaxed text-ink-900/70">
            Not sure what to choose? Tell us your dream: first ride, calm confidence, or deep coaching—
            we’ll recommend the right experience and the right pace.
          </div>
          <ButtonLink href="/contact?topic=Help%20Choosing%20an%20Experience" variant="secondary">
            Enquire for a recommendation
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}

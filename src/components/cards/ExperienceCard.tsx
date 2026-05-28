import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

export type ExperienceCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  href: string;
  ctaLabel: string;
  eyebrow?: string;
};

export default function ExperienceCard({
  title,
  description,
  imageSrc,
  href,
  ctaLabel,
  eyebrow
}: ExperienceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-sand-50 shadow-glow ring-1 ring-ink-900/10">
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-ink-900/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {eyebrow ? (
            <div className="text-xs font-semibold tracking-[0.18em] uppercase text-sand-50/80">
              {eyebrow}
            </div>
          ) : null}
          <div className="mt-2 font-display text-xl font-bold text-sand-50">{title}</div>
          <div className="mt-2 text-sm leading-relaxed text-sand-50/85">{description}</div>
        </div>
      </div>

      <div className="p-5">
        <ButtonLink href={href} variant="primary" className="w-full">
          {ctaLabel}
        </ButtonLink>
      </div>
    </div>
  );
}


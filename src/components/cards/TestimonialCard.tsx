import Image from "next/image";

export default function TestimonialCard({
  quote,
  name,
  role,
  imageSrc
}: {
  quote: string;
  name: string;
  role?: string;
  imageSrc?: string;
}) {
  return (
    <div className="rounded-3xl bg-sand-50/60 p-6 ring-1 ring-ink-900/10 shadow-glow">
      <div className="flex items-start gap-4">
        {imageSrc ? (
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl ring-1 ring-ink-900/10">
            <Image src={imageSrc} alt={name} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-900/5 text-ink-900/60 ring-1 ring-ink-900/10">
            <span className="font-display text-lg">“</span>
          </div>
        )}
        <div>
          <div className="font-display text-lg font-bold tracking-tight text-ink-900">
            {name}
          </div>
          {role ? <div className="mt-1 text-xs font-semibold text-ink-900/60">{role}</div> : null}
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-900/75">“{quote}”</p>
    </div>
  );
}


import Image from "next/image";

export default function ProfileCard({
  name,
  title,
  story,
  imageSrc,
  highlights
}: {
  name: string;
  title: string;
  story: string;
  imageSrc: string;
  highlights?: string[];
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-sand-50/60 ring-1 ring-ink-900/10 shadow-glow">
      <div className="relative aspect-[4/3] w-full">
        <Image src={imageSrc} alt={name} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="text-xs font-semibold tracking-[0.18em] uppercase text-sand-50/80">
            {title}
          </div>
          <div className="mt-2 font-display text-xl font-bold text-sand-50">{name}</div>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm leading-relaxed text-ink-900/75">{story}</p>
        {highlights && highlights.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {highlights.map((h) => (
              <span
                key={h}
                className="rounded-full bg-sand-50/80 px-3 py-1 text-xs font-semibold text-ink-900/70 ring-1 ring-ink-900/10"
              >
                {h}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}


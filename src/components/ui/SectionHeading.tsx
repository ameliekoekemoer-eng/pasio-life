import type { ReactNode } from "react";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left"
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  const textAlign =
    align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col gap-3 ${textAlign}`}>
      {eyebrow ? (
        <div className="text-xs font-semibold tracking-[0.22em] uppercase text-ink-900/60">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="font-display text-3xl font-bold tracking-tight">{title}</h2>
      {subtitle ? (
        <div className="max-w-2xl text-sm leading-relaxed text-ink-900/70">{subtitle}</div>
      ) : null}
    </div>
  );
}


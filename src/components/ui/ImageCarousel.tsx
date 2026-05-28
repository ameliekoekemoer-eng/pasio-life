"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

export type CarouselItem = {
  src: string;
  alt: string;
  eyebrow?: string;
  title?: string;
  description?: string;
};

export default function ImageCarousel({
  items,
  autoPlayMs = 6500,
  overlay
}: {
  items: CarouselItem[];
  autoPlayMs?: number;
  overlay?: ReactNode;
}) {
  const [index, setIndex] = useState(0);

  const safeItems = useMemo(() => items.filter((i) => !!i.src), [items]);

  useEffect(() => {
    if (safeItems.length <= 1) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % safeItems.length);
    }, autoPlayMs);
    return () => window.clearInterval(t);
  }, [autoPlayMs, safeItems.length]);

  const current = safeItems[index];
  if (!current) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl ring-1 ring-ink-900/10 bg-ink-50">
      <div className="relative aspect-[16/9] w-full">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          sizes="100vw"
          className={clsx(
            "object-cover transition-transform duration-700",
            "group-hover:scale-[1.03]"
          )}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-ink-900/20 to-transparent" />
        {overlay ? (
          <div className="absolute inset-0">{overlay}</div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {current.eyebrow ? (
              <div className="mb-2 text-xs font-semibold tracking-[0.18em] uppercase text-sand-50/80">
                {current.eyebrow}
              </div>
            ) : null}
            {current.title ? (
              <div className="font-display text-2xl font-bold text-sand-50">
                {current.title}
              </div>
            ) : null}
            {current.description ? (
              <div className="mt-2 text-sm leading-relaxed text-sand-50/85">
                {current.description}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-ink-900/35 px-3 py-2 backdrop-blur-sm">
        {safeItems.map((_, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              aria-label={`Carousel slide ${i + 1}`}
              className={clsx(
                "h-2 w-2 rounded-full transition",
                active ? "bg-sand-50" : "bg-sand-50/45 hover:bg-sand-50/75"
              )}
              onClick={() => setIndex(i)}
            />
          );
        })}
      </div>
    </div>
  );
}


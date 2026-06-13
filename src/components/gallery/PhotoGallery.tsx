"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import clsx from "clsx";
import type { GalleryCategory, GalleryImage } from "@/lib/gallery";
import Modal from "@/components/ui/Modal";

const FILTERS: { id: GalleryCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "horses", label: "Horses" },
  { id: "experiences", label: "Experiences" },
  { id: "family", label: "Family" }
];

export default function PhotoGallery({ images }: { images: GalleryImage[] }) {
  const [activeFilter, setActiveFilter] = useState<GalleryCategory>("all");
  const [active, setActive] = useState<GalleryImage | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return images;
    return images.filter((img) => img.categories.includes(activeFilter));
  }, [images, activeFilter]);

  function openImage(image: GalleryImage) {
    const idx = filtered.findIndex((i) => i.src === image.src);
    setActiveIndex(idx >= 0 ? idx : 0);
    setActive(image);
  }

  function showAdjacent(delta: number) {
    if (!filtered.length) return;
    const next = (activeIndex + delta + filtered.length) % filtered.length;
    setActiveIndex(next);
    setActive(filtered[next]);
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={clsx(
              "rounded-full px-4 py-2 text-sm font-semibold transition ring-1",
              activeFilter === filter.id
                ? "bg-[#C8A2C8] text-ink-900 ring-[#C8A2C8] shadow-sm"
                : "bg-sand-50/80 text-ink-900/75 ring-ink-900/10 hover:bg-sand-50"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-ink-900/60">No photos in this category yet.</p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((image, idx) => (
            <button
              key={image.src}
              type="button"
              onClick={() => openImage(image)}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-3xl ring-1 ring-ink-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500"
            >
              <div
                className={clsx(
                  "relative w-full overflow-hidden",
                  idx % 3 === 0 ? "aspect-[3/4]" : idx % 3 === 1 ? "aspect-square" : "aspect-[4/3]"
                )}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <span className="absolute bottom-0 left-0 right-0 p-4 text-left text-sm font-semibold text-sand-50 opacity-0 transition group-hover:opacity-100">
                  {image.alt.replace("Pasio Life — ", "")}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal
        open={!!active}
        title={active?.alt ?? "Photo"}
        onClose={() => setActive(null)}
      >
        {active ? (
          <div className="space-y-4">
            <div className="relative max-h-[70vh] min-h-[240px] w-full overflow-hidden rounded-2xl ring-1 ring-ink-900/10">
              <Image
                src={active.src}
                alt={active.alt}
                width={1200}
                height={900}
                className="mx-auto h-auto max-h-[70vh] w-full object-contain bg-ink-900/5"
                priority
              />
            </div>
            {filtered.length > 1 ? (
              <div className="flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => showAdjacent(-1)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-ink-900/10 hover:bg-sand-50/80"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={() => showAdjacent(1)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-ink-900/10 hover:bg-sand-50/80"
                >
                  Next →
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </>
  );
}

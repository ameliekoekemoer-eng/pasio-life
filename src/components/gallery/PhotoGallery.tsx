"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryImage } from "@/lib/gallery";
import Modal from "@/components/ui/Modal";

export default function PhotoGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActive(image)}
            className="group relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-ink-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <span className="absolute bottom-0 left-0 right-0 p-4 text-left text-sm font-semibold text-sand-50 opacity-0 transition group-hover:opacity-100">
              {image.alt.replace("Pasio Life — ", "")}
            </span>
          </button>
        ))}
      </div>

      <Modal open={!!active} title={active?.alt ?? "Photo"} onClose={() => setActive(null)}>
        {active ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-ink-900/10">
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-contain bg-ink-900/5"
              priority
            />
          </div>
        ) : null}
      </Modal>
    </>
  );
}

"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import clsx from "clsx";

export default function Modal({
  open,
  title,
  onClose,
  children
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110]">
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative mx-auto mt-16 w-[92%] max-w-2xl rounded-2xl bg-sand-50 p-6 shadow-glow ring-1 ring-ink-900/10">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink-900">
            {title}
          </h2>
          <button
            className={clsx(
              "rounded-xl px-3 py-2 text-sm font-semibold ring-1 ring-ink-900/10 hover:bg-sand-50/70"
            )}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}


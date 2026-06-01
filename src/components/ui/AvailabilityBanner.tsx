"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";

const STORAGE_KEY = "pasio-availability-banner-dismissed";

export default function AvailabilityBanner() {
  const [dismissed, setDismissed] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDismissed(sessionStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (!mounted || dismissed) return null;

  return (
    <div
      className={clsx(
        "flex h-11 items-center justify-center gap-3 px-3 text-center text-sm font-semibold",
        "bg-[#C8A2C8] text-ink-900 ring-1 ring-ink-900/10"
      )}
      role="region"
      aria-label="Availability notice"
    >
      <Link href="/booking" className="flex-1 truncate hover:underline">
        🐴 Check our available dates for lessons &amp; trail rides — Book Now
      </Link>
      <button
        type="button"
        aria-label="Dismiss banner"
        className="shrink-0 rounded-lg px-2 py-1 text-lg leading-none ring-1 ring-ink-900/15 transition hover:bg-sand-50/60"
        onClick={() => {
          sessionStorage.setItem(STORAGE_KEY, "1");
          setDismissed(true);
        }}
      >
        ×
      </button>
    </div>
  );
}

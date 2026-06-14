import Link from "next/link";
import clsx from "clsx";

const TABS = [
  { href: "/admin", label: "Availability calendar", key: "calendar" },
  { href: "/admin/bookings", label: "Bookings", key: "bookings" }
] as const;

export default function AdminTabs({
  active
}: {
  active: "calendar" | "bookings";
}) {
  return (
    <nav className="flex flex-wrap gap-2">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={clsx(
            "rounded-xl px-4 py-2 text-sm font-semibold ring-1 transition",
            active === tab.key
              ? "bg-ember-500 text-sand-50 ring-ember-600 shadow-glow"
              : "bg-sand-50/80 text-ink-900/80 ring-ink-900/10 hover:bg-sand-50"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

import Link from "next/link";
import Image from "next/image";

const socials = [
  { href: "https://instagram.com/", label: "Instagram" },
  { href: "https://facebook.com/", label: "Facebook" },
  { href: "https://youtube.com/", label: "YouTube" }
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/experiences", label: "Experiences" },
  { href: "/booking", label: "Booking" },
  { href: "/meet-the-family", label: "Meet the Family" },
  { href: "/school-of-life", label: "School of Life" },
  { href: "/buy-sell-horses", label: "Buy & Sell Horses" }
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-900/10 bg-sand-50/50">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 rounded-2xl bg-sand-50 ring-1 ring-ink-900/10">
                <Image
                  src="/logo.png"
                  alt="Pasio Life logo"
                  fill
                  sizes="36px"
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div className="font-display text-xl font-bold tracking-tight">Pasio Life</div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-900/70">
              A dream lifestyle brand for horse connection, freedom, and adventure in nature.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {socials.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="rounded-xl px-3 py-2 text-sm font-semibold ring-1 ring-ink-900/10 hover:bg-sand-50/70"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {quickLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-semibold text-ink-900/70 hover:text-ink-900"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="text-sm font-semibold text-ink-900/70 hover:text-ink-900"
              >
                Contact
              </Link>
            </div>

            <div className="mt-10 rounded-2xl bg-ink-900/5 p-4 ring-1 ring-ink-900/10">
              <div className="text-xs font-semibold tracking-[0.18em] uppercase text-ink-900/60">
                Based near Parys, South Africa
              </div>
              <div className="mt-2 text-sm font-semibold text-ink-900">
                Passion for Life
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs text-ink-900/55">
          © {new Date().getFullYear()} Pasio Life. All rights reserved.
        </div>
      </div>
    </footer>
  );
}


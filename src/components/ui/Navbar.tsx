"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { ButtonLink } from "./Button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/experiences", label: "Experiences" },
  { href: "/meet-the-family", label: "Meet the Family" },
  { href: "/about", label: "About" },
  { href: "/school-of-life", label: "School of Life" },
  { href: "/buy-sell-horses", label: "Trotalot" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const activeHref = useMemo(() => {
    const clean = pathname.split("?")[0];
    if (clean === "/") return "/";
    return clean;
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-[80] w-full border-b transition",
        scrolled
          ? "border-black/10 bg-[#C8A2C8]/75 backdrop-blur-md" // lilac with transparency
          : "border-transparent bg-[#C8A2C8]" // solid lilac when not scrolled
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-2xl ring-1 ring-ink-900/10 shadow-glow bg-sand-50">
            <Image
              src="/logo.png"
              alt="Pasio Life logo"
              fill
              sizes="40px"
              className="object-contain p-1"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-tight">Pasio Life</div>
            <div className="text-xs font-semibold tracking-[0.18em] uppercase text-ink-900/60">
              Passion for Life
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => {
            const active = activeHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "text-sm font-semibold transition",
                  active ? "text-ink-900" : "text-ink-900/70 hover:text-ink-900"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href="/contact" variant="secondary">
            Enquire
          </ButtonLink>
          <ButtonLink href="/booking" variant="primary">
            Book
          </ButtonLink>
        </div>

        <button
          aria-label="Open menu"
          className="rounded-xl p-2 text-ink-900/80 ring-1 ring-ink-900/10 hover:bg-sand-50/70 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="block h-0.5 w-5 bg-ink-900/80" />
          <span className="mt-1 block h-0.5 w-5 bg-ink-900/80" />
          <span className="mt-1 block h-0.5 w-5 bg-ink-900/80" />
        </button>
      </div>

      {mobileOpen ? (
        <div className="lg:hidden">
          <div className="mx-4 mb-4 rounded-2xl bg-sand-50/95 p-3 shadow-glow ring-1 ring-ink-900/10 backdrop-blur-md">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const active = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      "rounded-xl px-3 py-2 text-sm font-semibold transition",
                      active ? "bg-sand-50 text-ink-900" : "text-ink-900/75 hover:bg-sand-50/70"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <ButtonLink href="/contact" variant="secondary" className="w-full">
                Enquire
              </ButtonLink>
              <ButtonLink href="/booking" variant="primary" className="w-full">
                Book
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}


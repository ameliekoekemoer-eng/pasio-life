import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50",
        variant === "primary" && "bg-ember-500 text-sand-50 shadow-glow hover:bg-ember-400 active:bg-ember-600",
        variant === "secondary" &&
          "bg-sand-50/70 text-ink-900 ring-1 ring-ink-900/10 hover:bg-sand-50 active:bg-sand-50",
        variant === "ghost" && "bg-transparent text-ink-900/80 hover:bg-sand-50/70 ring-1 ring-ink-900/10",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children
}: {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50",
        variant === "primary" && "bg-ember-500 text-sand-50 shadow-glow hover:bg-ember-400 active:bg-ember-600",
        variant === "secondary" &&
          "bg-sand-50/70 text-ink-900 ring-1 ring-ink-900/10 hover:bg-sand-50 active:bg-sand-50",
        variant === "ghost" && "bg-transparent text-ink-900/80 hover:bg-sand-50/70 ring-1 ring-ink-900/10",
        className
      )}
    >
      {children}
    </a>
  );
}


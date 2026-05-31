"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

type Mode = "login" | "signup";

export default function AuthForms({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowser();
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        if (error) throw error;
      }

      router.push("/school-of-life/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {mode === "signup" ? (
          <label className="block sm:col-span-2">
            <div className="mb-1 text-sm font-semibold text-ink-900/80">Full name</div>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
              placeholder="e.g. Amelie"
            />
          </label>
        ) : null}

        <label className="block sm:col-span-2">
          <div className="mb-1 text-sm font-semibold text-ink-900/80">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
            placeholder="you@example.com"
          />
        </label>

        <label className="block sm:col-span-2">
          <div className="mb-1 text-sm font-semibold text-ink-900/80">Password</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
            placeholder="At least 8 characters"
          />
        </label>
      </div>

      {error ? (
        <div className="rounded-xl bg-ember-50 px-4 py-3 text-sm font-semibold text-ember-900 ring-1 ring-ember-500/20">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-ember-500 px-4 py-3 text-sm font-semibold text-sand-50 shadow-glow transition hover:bg-ember-400 active:bg-ember-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
      </button>
    </form>
  );
}


"use client";

import { useEffect, useState } from "react";
import AdminCalendar from "@/components/admin/AdminCalendar";
import Container from "@/components/ui/Container";

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((j) => setAuthenticated(!!j.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Login failed.");
      setAuthenticated(true);
      setPassword("");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
  }

  if (authenticated === null) {
    return (
      <div className="py-20 text-center text-sm text-ink-900/70">Loading admin…</div>
    );
  }

  if (!authenticated) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-md rounded-3xl bg-sand-50/80 p-8 ring-1 ring-ink-900/10 shadow-glow">
          <h1 className="font-display text-3xl font-bold tracking-tight">Pasio Life Admin</h1>
          <p className="mt-2 text-sm text-ink-900/70">
            Sign in to manage available dates for trail rides and lessons.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-ink-900/80">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
              />
            </label>
            {loginError ? (
              <div className="rounded-xl bg-ember-50 px-4 py-3 text-sm font-semibold text-ember-900">
                {loginError}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-ember-500 px-4 py-3 text-sm font-semibold text-sand-50 hover:bg-ember-400 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Availability calendar</h1>
          <p className="mt-2 max-w-xl text-sm text-ink-900/70">
            Mark dates when you can take trail rides or lessons. Bookings on the public site only
            show these dates.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-ink-900/10 hover:bg-sand-50/80"
        >
          Sign out
        </button>
      </div>

      <div className="mt-10">
        <AdminCalendar />
      </div>
    </Container>
  );
}

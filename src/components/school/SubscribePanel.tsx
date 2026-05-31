"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/Button";

type Tier = "beginner" | "intermediate" | "advanced";

export default function SubscribePanel() {
  const [tier, setTier] = useState<Tier>("beginner");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubscribe() {
    setLoading(true);
    setMessage(null);
    try {
      const { data } = await getSupabaseBrowser().auth.getSession();
      const accessToken = data.session?.access_token;
      if (!accessToken) {
        setMessage("Please log in to start learning.");
        return;
      }

      const res = await fetch("/api/school/subscribe-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, tier })
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error ?? "Subscription failed.");
      }

      setMessage("Unlocked (demo). You can now access the dashboard.");
      window.location.href = "/school-of-life/dashboard";
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl bg-ink-900/5 p-6 ring-1 ring-ink-900/10">
      <div className="font-display text-2xl font-bold tracking-tight text-ink-900">
        Start Learning
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-900/70">
        For this demo, we unlock your School of Life dashboard instantly. In production,
        you’ll connect Stripe (or another checkout) to activate your subscription.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <div className="mb-1 text-sm font-semibold text-ink-900/80">Choose your level</div>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as Tier)}
            className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <div className="flex items-end">
          <Button
            type="button"
            variant="primary"
            onClick={onSubscribe}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Unlocking..." : "Start Learning"}
          </Button>
        </div>
      </div>

      {message ? (
        <div className="mt-4 rounded-xl bg-sand-50 px-4 py-3 text-sm font-semibold text-ink-900/70 ring-1 ring-ink-900/10">
          {message}
        </div>
      ) : null}
    </div>
  );
}


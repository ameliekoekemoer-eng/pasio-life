"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import type { SubscriptionStatus } from "@/lib/subscription";
import { getSubscriptionByUserId } from "@/lib/subscription";
import Container from "@/components/ui/Container";
import SubscribePanel from "@/components/school/SubscribePanel";
import { ButtonLink } from "@/components/ui/Button";

type Tier = "beginner" | "intermediate" | "advanced";

function tierRank(tier?: Tier) {
  if (!tier) return 0;
  if (tier === "beginner") return 1;
  if (tier === "intermediate") return 2;
  return 3;
}

function LevelCard({
  level,
  requiredTier,
  description,
  unlocked,
  modules
}: {
  level: string;
  requiredTier: Tier;
  description: string;
  unlocked: boolean;
  modules: string[];
}) {
  return (
    <div className="rounded-3xl bg-sand-50/60 p-6 ring-1 ring-ink-900/10 shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-display text-2xl font-bold tracking-tight">{level}</div>
          <div className="mt-2 text-sm leading-relaxed text-ink-900/70">{description}</div>
        </div>
        <div
          className={
            unlocked
              ? "rounded-full bg-pine-100 px-3 py-1 text-xs font-semibold text-pine-900 ring-1 ring-pine-500/20"
              : "rounded-full bg-ink-900/5 px-3 py-1 text-xs font-semibold text-ink-900/70 ring-1 ring-ink-900/10"
          }
        >
          {unlocked ? "Unlocked" : "Locked"}
        </div>
      </div>

      <div className="mt-5">
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-ink-900/55">
          What you’ll learn
        </div>
        <ul className="mt-3 space-y-2">
          {modules.map((m) => (
            <li key={m} className="flex items-start gap-3">
              <span
                className={
                  unlocked
                    ? "mt-0.5 h-5 w-5 rounded-full bg-pine-500/15 ring-1 ring-pine-500/25"
                    : "mt-0.5 h-5 w-5 rounded-full bg-ink-900/5 ring-1 ring-ink-900/10"
                }
              />
              <span className="text-sm leading-relaxed text-ink-900/75">
                {m}
              </span>
            </li>
          ))}
        </ul>

        {unlocked ? (
          <div className="mt-6 rounded-2xl bg-sand-50 px-4 py-3 ring-1 ring-ink-900/10">
            <div className="text-sm font-semibold text-ink-900/80">
              Lesson access is enabled (example)
            </div>
            <div className="mt-1 text-xs leading-relaxed text-ink-900/60">
              Wire this to real course content + video modules when you’re ready.
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-ember-50 px-4 py-3 ring-1 ring-ember-500/20">
            <div className="text-sm font-semibold text-ember-900/80">
              Subscribe to unlock {level}
            </div>
            <div className="mt-1 text-xs leading-relaxed text-ember-900/60">
              Your current tier isn’t high enough for this level yet.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CourseDashboard() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      try {
        const supabase = getSupabaseBrowser();
        const { data } = await supabase.auth.getUser();
        const id = data.user?.id ?? null;
        if (!alive) return;
        setUserId(id);

        if (!id) {
          setStatus({ active: false });
          return;
        }

        const s = await getSubscriptionByUserId(supabase, id);
        if (!alive) return;
        setStatus(s);
      } catch {
        if (!alive) return;
        setUserId(null);
        setStatus({ active: false });
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    try {
      authListener = getSupabaseBrowser().auth.onAuthStateChange(() => {
        load();
      }).data;
    } catch {
      // Supabase not configured.
    }
    return () => {
      alive = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const currentRank = tierRank(status?.tier as Tier);
  const active = !!status?.active;

  const modulesByTier: Record<Tier, string[]> = {
    beginner: ["Horse communication basics", "Safe approach routines", "Groundwork confidence"],
    intermediate: ["Reading signals & body language", "Riding balance and rhythm", "Trust-building practice"],
    advanced: ["Training principles for the long game", "Deep horse language interpretation", "Lifelong care & welfare mindset"]
  };

  if (loading) {
    return (
      <div className="py-10">
        <Container>
          <div className="rounded-3xl bg-sand-50/70 p-6 ring-1 ring-ink-900/10">
            <div className="h-4 w-1/2 animate-pulse rounded bg-ink-900/10" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-ink-900/10" />
          </div>
        </Container>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="py-10">
        <Container>
          <div className="rounded-3xl bg-ember-50 p-6 ring-1 ring-ember-500/20 shadow-glow">
            <div className="font-display text-2xl font-bold text-ember-900">Login required</div>
            <p className="mt-2 text-sm leading-relaxed text-ember-900/70">
              To access your course dashboard, create an account or log in.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/school-of-life/login" variant="secondary">
                Login
              </ButtonLink>
              <ButtonLink href="/school-of-life/signup" variant="primary">
                Create account
              </ButtonLink>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="py-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <div>
                <div className="font-display text-3xl font-bold tracking-tight">Your dashboard is ready</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-900/70">
                  Subscribe to unlock course levels, notes, and deeper horse theory.
                </p>
              </div>
              <div className="rounded-3xl bg-sand-50/60 p-6 ring-1 ring-ink-900/10">
                <div className="text-xs font-semibold tracking-[0.18em] uppercase text-ink-900/55">
                  What you get
                </div>
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink-900/75">
                  <div>• Progressive levels</div>
                  <div>• Locked content until subscribed</div>
                  <div>• A calm, guided learning path</div>
                </div>
              </div>
            </div>
            <SubscribePanel />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10">
      <Container>
        <div className="rounded-[2.5rem] bg-ink-900/5 p-6 ring-1 ring-ink-900/10 shadow-glow sm:p-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="font-display text-3xl font-bold tracking-tight">
                School of Life Dashboard
              </div>
              <div className="mt-2 text-sm leading-relaxed text-ink-900/70">
                Your current tier:{" "}
                <span className="font-semibold">{status?.tier ?? "beginner"}</span>
              </div>
            </div>
            <div className="text-xs font-semibold tracking-[0.18em] uppercase text-ink-900/55">
              Built for real horses and real life
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <LevelCard
              level="Beginner"
              requiredTier="beginner"
              description="Foundation theory that makes connection easier."
              unlocked={currentRank >= 1}
              modules={modulesByTier.beginner}
            />
            <LevelCard
              level="Intermediate"
              requiredTier="intermediate"
              description="Signals, riding balance, and trust through practice."
              unlocked={currentRank >= 2}
              modules={modulesByTier.intermediate}
            />
            <LevelCard
              level="Advanced"
              requiredTier="advanced"
              description="Training principles and lifelong welfare mindset."
              unlocked={currentRank >= 3}
              modules={modulesByTier.advanced}
            />
          </div>

          <div className="mt-8 rounded-3xl bg-sand-50/70 p-6 ring-1 ring-ink-900/10">
            <div className="text-sm font-semibold text-ink-900/80">Need help choosing a level?</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-900/70">
              Tell us what you’re working on with your horse—groundwork, riding, or confidence—and we’ll point you to the best path.
            </p>
            <div className="mt-4">
              <ButtonLink href="/contact?topic=School%20of%20Life%20Help" variant="secondary">
                Enquire
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}


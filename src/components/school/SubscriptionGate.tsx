"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/browser";
import type { SubscriptionStatus } from "@/lib/subscription";
import { getSubscriptionByUserId } from "@/lib/subscription";
import { ButtonLink } from "@/components/ui/Button";
import type { ReactNode } from "react";

type Tier = "beginner" | "intermediate" | "advanced";

function tierRank(tier?: Tier) {
  if (!tier) return 0;
  if (tier === "beginner") return 1;
  if (tier === "intermediate") return 2;
  return 3;
}

export default function SubscriptionGate({
  requiredTier,
  children
}: {
  requiredTier?: Tier;
  children: ReactNode;
}) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      try {
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
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const allowed = useMemo(() => {
    if (!status?.active) return false;
    if (!requiredTier) return true;
    return tierRank(status.tier as Tier) >= tierRank(requiredTier);
  }, [requiredTier, status?.active, status?.tier]);

  if (loading) {
    return (
      <div className="rounded-3xl bg-sand-50/70 p-6 ring-1 ring-ink-900/10">
        <div className="h-4 w-1/2 animate-pulse rounded bg-ink-900/10" />
        <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-ink-900/10" />
        <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-ink-900/10" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="rounded-3xl bg-ember-50 p-6 ring-1 ring-ember-500/20">
        <div className="font-display text-xl font-bold text-ember-900">Login required</div>
        <p className="mt-2 text-sm leading-relaxed text-ember-900/80">
          The School of Life dashboard is available to subscribed members.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href="/school-of-life/login" variant="secondary">
            Login
          </ButtonLink>
          <ButtonLink href="/school-of-life/signup" variant="primary">
            Create account
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="rounded-3xl bg-sand-50/70 p-6 ring-1 ring-ink-900/10">
        <div className="font-display text-xl font-bold text-ink-900">Content is locked</div>
        <p className="mt-2 text-sm leading-relaxed text-ink-900/70">
          Subscribe to unlock learning resources and deeper horse theory.
        </p>
        <Link
          href="/school-of-life"
          className="mt-4 inline-flex text-sm font-semibold text-ember-700 hover:text-ember-800"
        >
          Start Learning
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}


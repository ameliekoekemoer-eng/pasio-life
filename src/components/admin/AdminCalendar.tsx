"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  formatDateKey,
  getCalendarDays,
  monthRange
} from "@/lib/booking/calendar";
import { fetchAvailableDates } from "@/lib/booking/fetch-availability";
import { EXPERIENCE_LABELS, type ExperienceType } from "@/lib/booking/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminCalendar() {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [experienceType, setExperienceType] = useState<ExperienceType>("trail_ride");
  const [available, setAvailable] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busyDate, setBusyDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadMonth = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { from, to } = monthRange(viewYear, viewMonth);

    try {
      const res = await fetch(
        `/api/admin/availability?experience_type=${experienceType}&from=${from}&to=${to}`
      );
      const json = await res.json();

      if (res.ok) {
        const keys = new Set(
          (json.dates as { available_date: string }[]).map((row) => row.available_date)
        );
        setAvailable(keys);
        return;
      }

      const fallback = await fetchAvailableDates(experienceType, from);
      if (fallback.error && fallback.dates.length === 0) {
        throw new Error(json.error ?? fallback.error);
      }
      const keys = new Set(fallback.dates.map((row) => row.available_date));
      setAvailable(keys);
      if (fallback.error) {
        setError(`Showing dates from backup read. ${fallback.error}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [viewYear, viewMonth, experienceType]);

  useEffect(() => {
    loadMonth();
  }, [loadMonth]);

  const days = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-ZA", {
    month: "long",
    year: "numeric"
  });

  async function toggleDate(dateKey: string) {
    setBusyDate(dateKey);
    setError(null);
    const isAvailable = available.has(dateKey);

    try {
      const res = await fetch("/api/admin/availability", {
        method: isAvailable ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available_date: dateKey, experience_type: experienceType })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update date.");

      setAvailable((prev) => {
        const next = new Set(prev);
        if (isAvailable) next.delete(dateKey);
        else next.add(dateKey);
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update.");
    } finally {
      setBusyDate(null);
    }
  }

  function shiftMonth(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["trail_ride", "lesson"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setExperienceType(type)}
            className={clsx(
              "rounded-xl px-4 py-2 text-sm font-semibold transition ring-1",
              experienceType === type
                ? "bg-ember-500 text-sand-50 ring-ember-600 shadow-glow"
                : "bg-sand-50/80 text-ink-900/80 ring-ink-900/10 hover:bg-sand-50"
            )}
          >
            {EXPERIENCE_LABELS[type]}
          </button>
        ))}
      </div>

      <p className="text-sm text-ink-900/70">
        Click a day to mark it available or remove availability. Clients can only book on green
        dates for the selected experience type.
      </p>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="rounded-xl px-3 py-2 text-sm font-semibold ring-1 ring-ink-900/10 hover:bg-sand-50"
        >
          ← Previous
        </button>
        <div className="font-display text-xl font-bold">{monthLabel}</div>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="rounded-xl px-3 py-2 text-sm font-semibold ring-1 ring-ink-900/10 hover:bg-sand-50"
        >
          Next →
        </button>
      </div>

      {error ? (
        <div className="rounded-xl bg-ember-50 px-4 py-3 text-sm font-semibold text-ember-900 ring-1 ring-ember-500/20">
          {error}
        </div>
      ) : null}

      <div
        className={clsx(
          "rounded-3xl bg-sand-50/80 p-4 ring-1 ring-ink-900/10",
          loading && "opacity-60"
        )}
      >
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-ink-900/50">
          {WEEKDAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;

            const key = formatDateKey(day);
            const isPast = day < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isOpen = available.has(key);
            const isBusy = busyDate === key;

            return (
              <button
                key={key}
                type="button"
                disabled={isBusy}
                onClick={() => toggleDate(key)}
                className={clsx(
                  "aspect-square rounded-xl text-sm font-semibold transition ring-1",
                  isOpen
                    ? "bg-pine-500 text-sand-50 ring-pine-600 hover:bg-pine-400"
                    : "bg-white text-ink-900/80 ring-ink-900/10 hover:bg-sand-100",
                  isPast && !isOpen && "opacity-50",
                  isBusy && "cursor-wait opacity-70"
                )}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-ink-900/60">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-pine-500" /> Available
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-white ring-1 ring-ink-900/10" /> Not available
        </span>
      </div>
    </div>
  );
}

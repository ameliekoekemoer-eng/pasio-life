"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EXPERIENCE_TYPES, getExperienceType } from "@/lib/booking";

type Slot = { value: string; label: string };

function formatDateLabel(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Resolve an incoming ?experience= value (slug or label) to a known slug. */
function resolveExperienceSlug(raw: string): string {
  if (!raw) return "";
  if (getExperienceType(raw)) return raw;
  const byLabel = EXPERIENCE_TYPES.find(
    (e) => e.label.toLowerCase() === raw.toLowerCase()
  );
  return byLabel?.slug ?? "";
}

export default function BookingForm() {
  const searchParams = useSearchParams();

  const [experience, setExperience] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const [dates, setDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    partySize: "1",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fromUrl = resolveExperienceSlug(
      searchParams.get("experience") ?? searchParams.get("topic") ?? ""
    );
    if (fromUrl) setExperience(fromUrl);
  }, [searchParams]);

  // Load available dates whenever the experience changes.
  useEffect(() => {
    setDate("");
    setStartTime("");
    setSlots([]);
    setDates([]);
    if (!experience) return;

    let cancelled = false;
    setLoadingDates(true);
    fetch(`/api/booking/dates?experience=${encodeURIComponent(experience)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setDates(Array.isArray(data.dates) ? data.dates : []);
      })
      .catch(() => !cancelled && setDates([]))
      .finally(() => !cancelled && setLoadingDates(false));

    return () => {
      cancelled = true;
    };
  }, [experience]);

  // Load free start times whenever experience + date change.
  useEffect(() => {
    setStartTime("");
    setSlots([]);
    if (!experience || !date) return;

    let cancelled = false;
    setLoadingSlots(true);
    fetch(
      `/api/booking/slots?experience=${encodeURIComponent(
        experience
      )}&date=${encodeURIComponent(date)}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setSlots(Array.isArray(data.slots) ? data.slots : []);
      })
      .catch(() => !cancelled && setSlots([]))
      .finally(() => !cancelled && setLoadingSlots(false));

    return () => {
      cancelled = true;
    };
  }, [experience, date]);

  const experienceLabel = useMemo(
    () => getExperienceType(experience)?.label ?? "",
    [experience]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!experience || !date || !startTime) {
        setError("Please choose an experience, date, and start time.");
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch("/api/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_name: contact.name,
            email: contact.email,
            phone: contact.phone,
            party_size: Number(contact.partySize) || 1,
            experience_type: experience,
            chosen_date: date,
            start_time: startTime,
            notes: contact.message,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Could not submit your booking.");
          // The slot may have been taken — refresh the list.
          if (res.status === 409 && experience && date) {
            const refreshed = await fetch(
              `/api/booking/slots?experience=${encodeURIComponent(
                experience
              )}&date=${encodeURIComponent(date)}`
            ).then((r) => r.json());
            setSlots(Array.isArray(refreshed.slots) ? refreshed.slots : []);
            setStartTime("");
          }
          return;
        }
        setSuccess(true);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [contact, date, experience, startTime]
  );

  if (success) {
    const slotLabel = slots.find((s) => s.value === startTime)?.label ?? startTime;
    return (
      <div className="mx-auto max-w-2xl rounded-2xl bg-[#f9f9f9] p-8 text-center shadow-md">
        <h1 className="mb-3 text-3xl font-bold">Booking request received</h1>
        <p className="text-sm text-black/70">
          Thank you, {contact.name}. We&apos;ve recorded your request for{" "}
          <span className="font-semibold">{experienceLabel}</span> on{" "}
          <span className="font-semibold">{formatDateLabel(date)}</span> at{" "}
          <span className="font-semibold">{slotLabel}</span>. We&apos;ll be in
          touch to confirm.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-2 text-center text-4xl font-bold">
        Book Your Pasio Life Experience
      </h1>
      <p className="mb-6 text-center text-sm text-black/70">
        Choose an experience and date, then pick an available start time.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-3xl gap-6 rounded-2xl bg-[#f9f9f9] p-8 shadow-md"
      >
        {/* Experience */}
        <label className="grid gap-2 text-sm font-medium">
          Experience
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
            className="rounded-lg border p-3"
          >
            <option value="">Select an experience…</option>
            {EXPERIENCE_TYPES.map((e) => (
              <option key={e.slug} value={e.slug}>
                {e.label} ({e.durationMinutes} min)
              </option>
            ))}
          </select>
        </label>

        {/* Date */}
        <label className="grid gap-2 text-sm font-medium">
          Date
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={!experience || loadingDates}
            className="rounded-lg border p-3 disabled:opacity-50"
          >
            <option value="">
              {!experience
                ? "Select an experience first"
                : loadingDates
                  ? "Loading dates…"
                  : dates.length === 0
                    ? "No available dates"
                    : "Select a date…"}
            </option>
            {dates.map((d) => (
              <option key={d} value={d}>
                {formatDateLabel(d)}
              </option>
            ))}
          </select>
        </label>

        {/* Start times */}
        {experience && date ? (
          <div className="grid gap-2 text-sm font-medium">
            Available start times
            {loadingSlots ? (
              <p className="text-sm font-normal text-black/60">Loading times…</p>
            ) : slots.length === 0 ? (
              <p className="text-sm font-normal text-black/60">
                No available start times for this date. Please choose another date.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => {
                  const selected = slot.value === startTime;
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setStartTime(slot.value)}
                      aria-pressed={selected}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        selected
                          ? "border-[#C8A2C8] bg-[#C8A2C8] text-black"
                          : "border-black/20 bg-white text-black hover:border-[#C8A2C8]"
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}

        {/* Contact details */}
        <input
          type="text"
          placeholder="Your Full Name"
          value={contact.name}
          onChange={(e) => setContact({ ...contact, name: e.target.value })}
          required
          className="rounded-lg border p-3"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={contact.email}
          onChange={(e) => setContact({ ...contact, email: e.target.value })}
          required
          className="rounded-lg border p-3"
        />
        <input
          type="tel"
          placeholder="Your Phone (optional)"
          value={contact.phone}
          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          className="rounded-lg border p-3"
        />
        <label className="grid gap-2 text-sm font-medium">
          Party size
          <input
            type="number"
            min={1}
            value={contact.partySize}
            onChange={(e) => setContact({ ...contact, partySize: e.target.value })}
            className="rounded-lg border p-3"
          />
        </label>
        <textarea
          placeholder="Any special requests or notes"
          value={contact.message}
          onChange={(e) => setContact({ ...contact, message: e.target.value })}
          rows={4}
          className="rounded-lg border p-3"
        />

        {error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting || !experience || !date || !startTime}
          className="rounded-full bg-[#C8A2C8] px-6 py-3 font-semibold text-black transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Request this booking"}
        </button>
      </form>
    </>
  );
}

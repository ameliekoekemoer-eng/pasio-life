"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { formatDisplayDate } from "@/lib/booking/calendar";
import {
  EXPERIENCE_LABELS,
  experienceTypeFromParam,
  type AvailableDateRow,
  type ExperienceType
} from "@/lib/booking/types";
import {
  PASIO_EMAIL,
  PASIO_EMAIL_MAILTO,
  PASIO_PHONE_DISPLAY,
  PASIO_PHONE_TEL
} from "@/lib/contact";

export default function BookingForm() {
  const searchParams = useSearchParams();
  const topicFromUrl = searchParams.get("topic") ?? "";
  const experienceFromUrl = searchParams.get("experience") ?? "";

  const initialType = useMemo(() => {
    const fromTopic = experienceTypeFromParam(topicFromUrl);
    if (fromTopic) return fromTopic;
    const fromExp = experienceTypeFromParam(experienceFromUrl);
    if (fromExp) return fromExp;
    return "trail_ride" as ExperienceType;
  }, [topicFromUrl, experienceFromUrl]);

  const [experienceType, setExperienceType] = useState<ExperienceType>(initialType);
  const [availableDates, setAvailableDates] = useState<AvailableDateRow[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [datesError, setDatesError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [chosenDate, setChosenDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [emailNote, setEmailNote] = useState<string | null>(null);

  useEffect(() => {
    setExperienceType(initialType);
  }, [initialType]);

  useEffect(() => {
    let cancelled = false;
    setLoadingDates(true);
    setDatesError(null);
    setChosenDate("");

    const today = new Date();
    const from = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    fetch(`/api/availability?experience_type=${experienceType}&from=${from}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (!json.dates) throw new Error(json.error ?? "Could not load dates.");
        setAvailableDates(json.dates as AvailableDateRow[]);
      })
      .catch((err) => {
        if (!cancelled) {
          setDatesError(err instanceof Error ? err.message : "Could not load dates.");
          setAvailableDates([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDates(false);
      });

    return () => {
      cancelled = true;
    };
  }, [experienceType]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitted(false);
    setEmailNote(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: name,
          email,
          phone,
          party_size: partySize,
          experience_type: experienceType,
          chosen_date: chosenDate,
          notes
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Booking failed.");

      setSubmitted(true);
      if (!json.emailSent && json.emailNote) {
        setEmailNote(json.emailNote);
      }
      setName("");
      setEmail("");
      setPhone("");
      setPartySize(1);
      setChosenDate("");
      setNotes("");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="mb-2 text-center font-display text-4xl font-bold tracking-tight md:text-5xl">
        Book Your Pasio Life Experience
      </h1>
      <p className="mb-2 text-center text-sm leading-relaxed text-ink-900/70">
        Choose an experience and one of our available dates. We&apos;ll confirm your booking as soon
        as we can.
      </p>
      <p className="mb-8 text-center text-sm text-ink-900/70">
        Not sure? Contact us anytime at{" "}
        <a href={PASIO_EMAIL_MAILTO} className="font-semibold text-ember-700 hover:underline">
          {PASIO_EMAIL}
        </a>{" "}
        or{" "}
        <a href={PASIO_PHONE_TEL} className="font-semibold text-ember-700 hover:underline">
          {PASIO_PHONE_DISPLAY}
        </a>
        .
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-3xl gap-6 rounded-[2rem] bg-sand-50/80 p-8 ring-1 ring-ink-900/10 shadow-glow"
      >
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-ink-900/80">Experience type</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["trail_ride", "lesson"] as const).map((type) => (
              <label
                key={type}
                className={clsx(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ring-1 transition",
                  experienceType === type
                    ? "bg-[#C8A2C8]/40 ring-[#C8A2C8]"
                    : "bg-sand-50 ring-ink-900/10 hover:bg-sand-50/90"
                )}
              >
                <input
                  type="radio"
                  name="experience_type"
                  value={type}
                  checked={experienceType === type}
                  onChange={() => setExperienceType(type)}
                  className="accent-ember-500"
                />
                {EXPERIENCE_LABELS[type]}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink-900/80">Available date</span>
          {loadingDates ? (
            <div className="rounded-xl bg-sand-50 px-4 py-3 text-sm text-ink-900/60">
              Loading available dates…
            </div>
          ) : datesError ? (
            <div className="rounded-xl bg-ember-50 px-4 py-3 text-sm text-ember-900">{datesError}</div>
          ) : availableDates.length === 0 ? (
            <div className="rounded-xl bg-sand-50 px-4 py-3 text-sm text-ink-900/70 ring-1 ring-ink-900/10">
              No dates are open for {EXPERIENCE_LABELS[experienceType].toLowerCase()}s yet. Please{" "}
              <Link href="/contact" className="font-semibold text-ember-700 hover:underline">
                contact us
              </Link>{" "}
              or check back soon.
            </div>
          ) : (
            <select
              value={chosenDate}
              onChange={(e) => setChosenDate(e.target.value)}
              required
              className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
            >
              <option value="">Select a date</option>
              {availableDates.map((row) => (
                <option key={row.id} value={row.available_date}>
                  {formatDisplayDate(row.available_date)}
                </option>
              ))}
            </select>
          )}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink-900/80">Full name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
              placeholder="Your name"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink-900/80">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
              placeholder="you@example.com"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink-900/80">Phone number</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
              placeholder="+27 ..."
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink-900/80">Number of people</span>
            <input
              type="number"
              min={1}
              max={20}
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              required
              className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink-900/80">
            Notes (optional)
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
            placeholder="Riding experience, special requests…"
          />
        </label>

        {submitError ? (
          <div className="rounded-xl bg-ember-50 px-4 py-3 text-sm font-semibold text-ember-900 ring-1 ring-ember-500/20">
            {submitError}
          </div>
        ) : null}

        {submitted ? (
          <div className="rounded-xl bg-pine-50 px-4 py-3 text-sm font-semibold text-pine-900 ring-1 ring-pine-500/20">
            Booking request received — thank you! We&apos;ll be in touch soon to confirm.
            {emailNote ? (
              <span className="mt-2 block font-normal text-pine-900/80">{emailNote}</span>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={
            submitting || loadingDates || availableDates.length === 0 || !chosenDate
          }
          className="rounded-full bg-[#C8A2C8] px-6 py-3 font-semibold text-ink-900 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Sending request…" : "Submit booking request"}
        </button>
      </form>
    </>
  );
}

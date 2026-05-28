"use client";

import type { FormEvent } from "react";
import { useState } from "react";

export default function ContactForm({
  initialTopic,
  initialExperience
}: {
  initialTopic?: string;
  initialExperience?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState(initialTopic ?? "General enquiry");
  const [experience, setExperience] = useState(initialExperience ?? "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitted(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          topic,
          experience,
          message
        })
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error ?? "Failed to send message.");
      }

      setSubmitted(true);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <div className="mb-1 text-sm font-semibold text-ink-900/80">Full name</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
            placeholder="Your name"
          />
        </label>
        <label className="block">
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
      </div>

      <label className="block">
        <div className="mb-1 text-sm font-semibold text-ink-900/80">Phone (optional)</div>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
          placeholder="+27 ..."
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <div className="mb-1 text-sm font-semibold text-ink-900/80">Topic</div>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
            placeholder="e.g. Pony Camp"
          />
        </label>
        <label className="block">
          <div className="mb-1 text-sm font-semibold text-ink-900/80">Experience (optional)</div>
          <input
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
            placeholder="e.g. Sunset Trail Ride"
          />
        </label>
      </div>

      <label className="block">
        <div className="mb-1 text-sm font-semibold text-ink-900/80">Message</div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          className="w-full resize-none rounded-xl bg-sand-50 px-4 py-3 text-sm ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-ember-500"
          placeholder="Tell us about your dream day with horses..."
        />
      </label>

      {error ? <div className="rounded-xl bg-ember-50 px-4 py-3 text-sm font-semibold text-ember-900 ring-1 ring-ember-500/20">{error}</div> : null}
      {submitted ? (
        <div className="rounded-xl bg-pine-50 px-4 py-3 text-sm font-semibold text-pine-900 ring-1 ring-pine-500/20">
          Message sent. We’ll get back to you soon.
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-ember-500 px-4 py-3 text-sm font-semibold text-sand-50 shadow-glow transition hover:bg-ember-400 active:bg-ember-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}


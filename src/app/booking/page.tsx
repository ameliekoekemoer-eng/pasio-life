"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const topicFromUrl = searchParams.get("topic") ?? "";
  const experienceFromUrl = searchParams.get("experience") ?? "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: ""
  });

  const experienceLabel = useMemo(() => {
    if (experienceFromUrl) return experienceFromUrl;
    if (topicFromUrl) return topicFromUrl;
    return "";
  }, [experienceFromUrl, topicFromUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lines = [
      "Hi Pasio Life, I'd like to request a booking.",
      "",
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      formData.phone ? `Phone: ${formData.phone}` : null,
      `Preferred date: ${formData.date}`,
      experienceLabel ? `Experience: ${experienceLabel}` : null,
      topicFromUrl && topicFromUrl !== experienceLabel ? `Topic: ${topicFromUrl}` : null,
      formData.message ? `Notes: ${formData.message}` : null
    ].filter(Boolean);

    window.open(buildWhatsAppUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black">
      <h1 className="mb-2 text-center text-4xl font-bold">Book Your Pasio Life Experience</h1>
      <p className="mb-6 text-center text-sm text-black/70">
        Submit your request and we&apos;ll open WhatsApp so you can send it directly to Pasio Life.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-3xl gap-6 rounded-2xl bg-[#f9f9f9] p-8 shadow-md"
      >
        {experienceLabel ? (
          <div className="rounded-lg border border-[#C8A2C8]/40 bg-[#C8A2C8]/15 px-4 py-3 text-sm">
            <span className="font-semibold">Selected experience:</span> {experienceLabel}
          </div>
        ) : null}

        <input
          type="text"
          name="name"
          placeholder="Your Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="rounded-lg border p-3"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="rounded-lg border p-3"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Your Phone (optional)"
          value={formData.phone}
          onChange={handleChange}
          className="rounded-lg border p-3"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="rounded-lg border p-3"
        />
        <textarea
          name="message"
          placeholder="Any special requests or notes"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="rounded-lg border p-3"
        />
        <button
          type="submit"
          className="rounded-full bg-[#C8A2C8] px-6 py-3 font-semibold text-black transition hover:opacity-80"
        >
          Send booking request on WhatsApp
        </button>
      </form>
    </main>
  );
}

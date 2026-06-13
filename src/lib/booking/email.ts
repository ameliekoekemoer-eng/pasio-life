import { EXPERIENCE_LABELS, type ExperienceType } from "@/lib/booking/types";

type BookingEmailPayload = {
  clientName: string;
  email: string;
  phone?: string;
  partySize: number;
  experienceType: ExperienceType;
  chosenDate: string;
  notes?: string;
};

export async function sendBookingNotificationEmail(
  payload: BookingEmailPayload
): Promise<{ sent: boolean; reason?: string }> {
  const serviceId = process.env.EMAILJS_SERVICE_ID?.trim();
  const templateId = process.env.EMAILJS_TEMPLATE_ID?.trim();
  const publicKey = process.env.EMAILJS_PUBLIC_KEY?.trim();
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();

  if (!serviceId || !templateId || !publicKey) {
    return { sent: false, reason: "EmailJS not configured (saved to database only)." };
  }

  const ownerEmail =
    process.env.BOOKING_NOTIFY_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_PASIO_EMAIL?.trim() ||
    "amelie.koekemoer@gmail.com";
  const experienceLabel = EXPERIENCE_LABELS[payload.experienceType];

  const templateParams: Record<string, string> = {
    to_email: ownerEmail ?? "",
    reply_to: payload.email,
    from_name: payload.clientName,
    from_email: payload.email,
    phone: payload.phone ?? "—",
    party_size: String(payload.partySize),
    experience_type: experienceLabel,
    chosen_date: payload.chosenDate,
    notes: payload.notes ?? "—",
    message: [
      `New Pasio Life booking request`,
      ``,
      `Name: ${payload.clientName}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone ?? "—"}`,
      `People: ${payload.partySize}`,
      `Experience: ${experienceLabel}`,
      `Date: ${payload.chosenDate}`,
      payload.notes ? `Notes: ${payload.notes}` : null
    ]
      .filter(Boolean)
      .join("\n")
  };

  const body: Record<string, unknown> = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: templateParams
  };

  if (privateKey) {
    body.accessToken = privateKey;
  }

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { sent: false, reason: text || `EmailJS error (${res.status})` };
  }

  return { sent: true };
}

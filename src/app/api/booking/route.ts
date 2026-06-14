import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  computeAvailableSlots,
  getExperienceType,
  type ExistingBooking,
} from "@/lib/booking";

export const dynamic = "force-dynamic";

const INACTIVE_STATUSES = new Set(["cancelled", "canceled", "declined", "rejected"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}(?::\d{2})?$/;

type BookingBody = {
  client_name?: string;
  email?: string;
  phone?: string;
  party_size?: number;
  experience_type?: string;
  chosen_date?: string;
  start_time?: string;
  notes?: string;
};

/** POST /api/booking -> create a booking_request after re-validating the slot. */
export async function POST(req: Request) {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { error: "Server env missing: Supabase is not configured." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as BookingBody;

    const clientName = body.client_name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const experience = body.experience_type?.trim() ?? "";
    const date = body.chosen_date?.trim() ?? "";
    const startTime = body.start_time?.trim() ?? "";

    if (!clientName || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }
    if (!getExperienceType(experience)) {
      return NextResponse.json({ error: "Unknown experience type." }, { status: 400 });
    }
    if (!DATE_RE.test(date)) {
      return NextResponse.json({ error: "Invalid date." }, { status: 400 });
    }
    if (!TIME_RE.test(startTime)) {
      return NextResponse.json({ error: "Invalid start time." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Re-validate: date must be available for this experience.
    const { data: availability, error: availabilityError } = await supabase
      .from("available_dates")
      .select("id")
      .eq("experience_type", experience)
      .eq("available_date", date)
      .limit(1);

    if (availabilityError) {
      return NextResponse.json({ error: availabilityError.message }, { status: 500 });
    }
    if (!availability || availability.length === 0) {
      return NextResponse.json(
        { error: "That date is no longer available for this experience." },
        { status: 409 }
      );
    }

    // Re-validate: the chosen start time must still be free.
    const { data: bookings, error: bookingsError } = await supabase
      .from("booking_requests")
      .select("start_time, experience_type, status")
      .eq("chosen_date", date);

    if (bookingsError) {
      return NextResponse.json({ error: bookingsError.message }, { status: 500 });
    }

    const existing: ExistingBooking[] = (bookings ?? [])
      .filter((b) => {
        const status = (b.status as string | null)?.toLowerCase() ?? "";
        return !INACTIVE_STATUSES.has(status);
      })
      .filter((b) => b.start_time)
      .map((b) => ({
        startTime: b.start_time as string,
        experienceSlug: b.experience_type as string,
      }));

    const normalizedStart = startTime.slice(0, 5);
    const stillFree = computeAvailableSlots(experience, existing).some(
      (slot) => slot.value === normalizedStart
    );
    if (!stillFree) {
      return NextResponse.json(
        { error: "That time slot was just taken. Please pick another." },
        { status: 409 }
      );
    }

    const partySize =
      typeof body.party_size === "number" && Number.isFinite(body.party_size)
        ? body.party_size
        : null;

    const { error: insertError } = await supabase.from("booking_requests").insert({
      client_name: clientName,
      email,
      phone: body.phone?.trim() || null,
      party_size: partySize,
      experience_type: experience,
      chosen_date: date,
      start_time: normalizedStart,
      notes: body.notes?.trim() || null,
      status: "pending",
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error." },
      { status: 500 }
    );
  }
}

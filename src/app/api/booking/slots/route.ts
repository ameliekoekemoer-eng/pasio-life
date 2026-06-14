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

/**
 * GET /api/booking/slots?experience=<slug>&date=<YYYY-MM-DD>
 * -> { slots: [{ value, label }] } free start times for that day.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const experience = searchParams.get("experience")?.trim() ?? "";
    const date = searchParams.get("date")?.trim() ?? "";

    if (!experience || !getExperienceType(experience)) {
      return NextResponse.json(
        { error: "Unknown or missing experience type." },
        { status: 400 }
      );
    }
    if (!DATE_RE.test(date)) {
      return NextResponse.json(
        { error: "Missing or invalid date (expected YYYY-MM-DD)." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // The selected date must be available for this experience.
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
      return NextResponse.json({ slots: [] });
    }

    // All bookings that day share one timeline, regardless of experience type.
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

    const slots = computeAvailableSlots(experience, existing);
    return NextResponse.json({ slots });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error." },
      { status: 500 }
    );
  }
}

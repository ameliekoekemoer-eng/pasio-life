import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendBookingNotificationEmail } from "@/lib/booking/email";
import type { ExperienceType } from "@/lib/booking/types";

export async function POST(req: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Server env missing: Supabase is not configured." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as {
      client_name: string;
      email: string;
      phone?: string;
      party_size: number;
      experience_type: ExperienceType;
      chosen_date: string;
      notes?: string;
    };

    const {
      client_name,
      email,
      phone,
      party_size,
      experience_type,
      chosen_date,
      notes
    } = body;

    if (!client_name?.trim() || !email?.trim() || !chosen_date) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (experience_type !== "trail_ride" && experience_type !== "lesson") {
      return NextResponse.json({ error: "Invalid experience type." }, { status: 400 });
    }

    if (!Number.isFinite(party_size) || party_size < 1 || party_size > 20) {
      return NextResponse.json({ error: "Invalid party size." }, { status: 400 });
    }

    const admin = getSupabaseAdmin();

    const { data: slot, error: slotError } = await admin
      .from("available_dates")
      .select("id")
      .eq("available_date", chosen_date)
      .eq("experience_type", experience_type)
      .maybeSingle();

    if (slotError) {
      return NextResponse.json({ error: slotError.message }, { status: 500 });
    }

    if (!slot) {
      return NextResponse.json(
        { error: "That date is no longer available. Please choose another date." },
        { status: 400 }
      );
    }

    const { error: insertError } = await admin.from("booking_requests").insert({
      client_name: client_name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      party_size,
      experience_type,
      chosen_date,
      notes: notes?.trim() || null,
      status: "pending"
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const emailResult = await sendBookingNotificationEmail({
      clientName: client_name.trim(),
      email: email.trim(),
      phone: phone?.trim(),
      partySize: party_size,
      experienceType: experience_type,
      chosenDate: chosen_date,
      notes: notes?.trim()
    });

    return NextResponse.json({
      ok: true,
      emailSent: emailResult.sent,
      emailNote: emailResult.reason
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error." },
      { status: 500 }
    );
  }
}

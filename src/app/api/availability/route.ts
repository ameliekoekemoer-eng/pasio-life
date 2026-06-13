import { NextResponse } from "next/server";
import { getSupabaseForRead } from "@/lib/supabase/server";
import type { ExperienceType } from "@/lib/booking/types";
import type { PostgrestError } from "@supabase/supabase-js";

function friendlyDbError(error: PostgrestError): string {
  if (error.code === "42P01" || error.message.includes("available_dates")) {
    return "Database table missing. Run supabase/booking-schema.sql in your Supabase SQL Editor.";
  }
  return error.message;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const experienceType = searchParams.get("experience_type") as ExperienceType | null;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (experienceType && experienceType !== "trail_ride" && experienceType !== "lesson") {
      return NextResponse.json({ error: "Invalid experience_type." }, { status: 400 });
    }

    let query = getSupabaseForRead()
      .from("available_dates")
      .select("id, available_date, experience_type, created_at")
      .order("available_date", { ascending: true });

    if (experienceType) {
      query = query.eq("experience_type", experienceType);
    }
    if (from) {
      query = query.gte("available_date", from);
    }
    if (to) {
      query = query.lte("available_date", to);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: friendlyDbError(error) }, { status: 500 });
    }

    return NextResponse.json({ dates: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    const hint =
      message.includes("not configured") || message.includes("Supabase")
        ? " Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
        : "";
    return NextResponse.json({ error: message + hint }, { status: 500 });
  }
}

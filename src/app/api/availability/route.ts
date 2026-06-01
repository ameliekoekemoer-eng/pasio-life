import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { ExperienceType } from "@/lib/booking/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const experienceType = searchParams.get("experience_type") as ExperienceType | null;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (experienceType && experienceType !== "trail_ride" && experienceType !== "lesson") {
      return NextResponse.json({ error: "Invalid experience_type." }, { status: 400 });
    }

    let query = getSupabaseAdmin()
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ dates: data ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error." },
      { status: 500 }
    );
  }
}

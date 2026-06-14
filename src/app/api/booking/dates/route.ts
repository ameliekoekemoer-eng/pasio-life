import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getExperienceType } from "@/lib/booking";

export const dynamic = "force-dynamic";

/** GET /api/booking/dates?experience=<slug> -> list of available dates (YYYY-MM-DD). */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const experience = searchParams.get("experience")?.trim() ?? "";

    if (!experience || !getExperienceType(experience)) {
      return NextResponse.json(
        { error: "Unknown or missing experience type." },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().slice(0, 10);

    const { data, error } = await getSupabaseAdmin()
      .from("available_dates")
      .select("available_date")
      .eq("experience_type", experience)
      .gte("available_date", today)
      .order("available_date", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const dates = Array.from(
      new Set((data ?? []).map((row) => row.available_date as string))
    );

    return NextResponse.json({ dates });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error." },
      { status: 500 }
    );
  }
}

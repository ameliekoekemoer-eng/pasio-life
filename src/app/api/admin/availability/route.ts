import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/booking/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { ExperienceType } from "@/lib/booking/types";

export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const experienceType = searchParams.get("experience_type") as ExperienceType | null;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let query = getSupabaseAdmin()
      .from("available_dates")
      .select("id, available_date, experience_type, created_at")
      .order("available_date", { ascending: true });

    if (experienceType) {
      query = query.eq("experience_type", experienceType);
    }
    if (from) query = query.gte("available_date", from);
    if (to) query = query.lte("available_date", to);

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

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      available_date: string;
      experience_type: ExperienceType;
    };

    if (!body.available_date || !body.experience_type) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    if (body.experience_type !== "trail_ride" && body.experience_type !== "lesson") {
      return NextResponse.json({ error: "Invalid experience type." }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("available_dates")
      .insert({
        available_date: body.available_date,
        experience_type: body.experience_type
      })
      .select("id, available_date, experience_type, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Date already marked available." }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ date: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      available_date: string;
      experience_type: ExperienceType;
    };

    if (!body.available_date || !body.experience_type) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
      .from("available_dates")
      .delete()
      .eq("available_date", body.available_date)
      .eq("experience_type", body.experience_type);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error." },
      { status: 500 }
    );
  }
}

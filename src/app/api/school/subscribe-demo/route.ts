import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type Tier = "beginner" | "intermediate" | "advanced";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { accessToken?: string; tier?: Tier };
    const accessToken = body.accessToken;
    const tier = body.tier ?? "beginner";

    if (!accessToken) {
      return NextResponse.json({ error: "Missing access token." }, { status: 400 });
    }

    // Requires SUPABASE_SERVICE_ROLE_KEY to be set.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Server env missing: Supabase is not configured." },
        { status: 500 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: userData, error: userError } = await (supabaseAdmin.auth as any).getUser(accessToken);
    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: userError?.message ?? "Invalid access token." },
        { status: 401 }
      );
    }

    const userId = userData.user.id as string;

    const { error: upsertError } = await supabaseAdmin
      .from("subscriptions")
      .upsert(
        {
          user_id: userId,
          status: "active",
          tier
        },
        { onConflict: "user_id" }
      );

    if (upsertError) {
      return NextResponse.json(
        { error: upsertError.message ?? "Failed to activate subscription." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error." },
      { status: 500 }
    );
  }
}


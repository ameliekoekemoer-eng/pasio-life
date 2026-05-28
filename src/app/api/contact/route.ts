import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name: string;
      email: string;
      phone?: string;
      topic: string;
      experience?: string;
      message: string;
    };

    if (!body?.name || !body?.email || !body?.message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      topic: body.topic ?? null,
      experience: body.experience ?? null,
      message: body.message
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to save message." },
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


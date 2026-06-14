import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  getAdminSessionToken,
  isValidAdminPassword
} from "@/lib/booking/admin-auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { password?: string };
    const password = body.password ?? "";

    if (!isValidAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE_NAME, getAdminSessionToken(), adminCookieOptions());
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, adminCookieOptions } from "@/lib/booking/admin-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, "", { ...adminCookieOptions(), maxAge: 0 });
  return res;
}

import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "pasio_admin_session";

const DEFAULT_ADMIN_PASSWORD = "pasio-life-admin";
const DEFAULT_SESSION_TOKEN = "pasio-admin-authenticated";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
}

export function getAdminSessionToken(): string {
  return process.env.ADMIN_SESSION_TOKEN?.trim() || DEFAULT_SESSION_TOKEN;
}

export function isValidAdminPassword(password: string): boolean {
  return password === getAdminPassword();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return token === getAdminSessionToken();
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  };
}

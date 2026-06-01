import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url || !/^https?:\/\//.test(url)) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }
  return url;
}

/** Anon client — use for public reads protected by RLS (e.g. available_dates SELECT). */
export function getSupabaseAnonServer(): SupabaseClient {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured.");
  }
  return createClient(getSupabaseUrl(), key, {
    auth: { persistSession: false }
  });
}

/** Prefer service role when present; otherwise anon (reads only). */
export function getSupabaseForRead(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (serviceKey) {
    return createClient(getSupabaseUrl(), serviceKey, {
      auth: { persistSession: false }
    });
  }
  return getSupabaseAnonServer();
}

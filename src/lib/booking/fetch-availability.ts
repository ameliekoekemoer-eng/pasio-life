import { getSupabaseBrowser } from "@/lib/supabase/browser";
import type { AvailableDateRow, ExperienceType } from "@/lib/booking/types";

export async function fetchAvailableDates(
  experienceType: ExperienceType,
  from?: string
): Promise<{ dates: AvailableDateRow[]; error?: string }> {
  const params = new URLSearchParams({ experience_type: experienceType });
  if (from) params.set("from", from);

  try {
    const res = await fetch(`/api/availability?${params.toString()}`);
    const json = (await res.json()) as { dates?: AvailableDateRow[]; error?: string };

    if (res.ok) {
      return { dates: json.dates ?? [] };
    }

    // Fallback: read directly from Supabase (anon RLS) when API fails
    try {
      const supabase = getSupabaseBrowser();
      let query = supabase
        .from("available_dates")
        .select("id, available_date, experience_type, created_at")
        .eq("experience_type", experienceType)
        .order("available_date", { ascending: true });

      if (from) {
        query = query.gte("available_date", from);
      }

      const { data, error } = await query;
      if (error) {
        return {
          dates: [],
          error: json.error ?? error.message
        };
      }
      return { dates: (data as AvailableDateRow[]) ?? [] };
    } catch {
      return {
        dates: [],
        error:
          json.error ??
          "Could not load available dates. Check Supabase setup and run supabase/booking-schema.sql."
      };
    }
  } catch {
    return {
      dates: [],
      error: "Could not reach the server. Check your connection and try again."
    };
  }
}

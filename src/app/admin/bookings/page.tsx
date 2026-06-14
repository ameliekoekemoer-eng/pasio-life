import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/booking/admin-auth";
import AdminTabs from "@/components/admin/AdminTabs";
import {
  formatTimeLabel,
  getExperienceType,
  parseTimeToMinutes,
  BUFFER_MINUTES,
} from "@/lib/booking";

export const dynamic = "force-dynamic";

type AvailableDateRow = { available_date: string; experience_type: string };
type BookingRow = {
  id: string;
  client_name: string | null;
  email: string | null;
  phone: string | null;
  party_size: number | null;
  experience_type: string;
  chosen_date: string;
  start_time: string | null;
  status: string | null;
  notes: string | null;
};

type DaySummary = {
  date: string;
  experiences: string[];
  bookings: BookingRow[];
};

function Unauthorized() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="mb-3 text-2xl font-bold">Admin bookings</h1>
      <p className="text-sm text-black/70">
        This page is protected.{" "}
        <Link href="/admin" className="underline">
          Sign in on the admin page
        </Link>{" "}
        to view bookings, or open{" "}
        <code>/admin/bookings?token=YOUR_TOKEN</code> with the{" "}
        <code>BOOKING_ADMIN_TOKEN</code> environment variable set.
      </p>
    </div>
  );
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const expectedToken = process.env.BOOKING_ADMIN_TOKEN;
  const { token } = await searchParams;
  const tokenOk = Boolean(expectedToken) && token === expectedToken;
  const sessionOk = await isAdminAuthenticated();

  if (!tokenOk && !sessionOk) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 text-black">
        <Unauthorized />
      </main>
    );
  }

  const supabase = getSupabaseAdmin();
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: availableDates }, { data: bookings }] = await Promise.all([
    supabase
      .from("available_dates")
      .select("available_date, experience_type")
      .gte("available_date", today)
      .order("available_date", { ascending: true }),
    supabase
      .from("booking_requests")
      .select(
        "id, client_name, email, phone, party_size, experience_type, chosen_date, start_time, status, notes"
      )
      .gte("chosen_date", today)
      .order("chosen_date", { ascending: true }),
  ]);

  const byDate = new Map<string, DaySummary>();

  for (const row of (availableDates ?? []) as AvailableDateRow[]) {
    const day = byDate.get(row.available_date) ?? {
      date: row.available_date,
      experiences: [],
      bookings: [],
    };
    if (!day.experiences.includes(row.experience_type)) {
      day.experiences.push(row.experience_type);
    }
    byDate.set(row.available_date, day);
  }

  for (const row of (bookings ?? []) as BookingRow[]) {
    const day = byDate.get(row.chosen_date) ?? {
      date: row.chosen_date,
      experiences: [],
      bookings: [],
    };
    day.bookings.push(row);
    byDate.set(row.chosen_date, day);
  }

  const days = Array.from(byDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  for (const day of days) {
    day.bookings.sort((a, b) =>
      (a.start_time ?? "").localeCompare(b.start_time ?? "")
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <AdminTabs active="bookings" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Admin bookings</h1>
        <p className="mb-8 text-sm text-black/60">
          Upcoming available dates and the time slots booked on each. Mark which
          dates are available on the{" "}
          <Link href="/admin" className="underline">
            availability calendar
          </Link>
          .
        </p>

        {days.length === 0 ? (
          <p className="text-sm text-black/60">No upcoming dates.</p>
        ) : (
          <div className="grid gap-6">
            {days.map((day) => (
              <section
                key={day.date}
                className="rounded-2xl border border-black/10 bg-[#f9f9f9] p-6"
              >
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold">
                    {new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>
                  <span className="text-xs text-black/50">
                    Available for:{" "}
                    {day.experiences.length === 0
                      ? "—"
                      : day.experiences
                          .map((s) => getExperienceType(s)?.label ?? s)
                          .join(", ")}
                  </span>
                </div>

                {day.bookings.length === 0 ? (
                  <p className="text-sm text-black/50">No bookings yet.</p>
                ) : (
                  <ul className="grid gap-2">
                    {day.bookings.map((b) => {
                      const exp = getExperienceType(b.experience_type);
                      const startMin = parseTimeToMinutes(b.start_time);
                      const duration = exp?.durationMinutes ?? 0;
                      const range =
                        startMin === null
                          ? b.start_time ?? "—"
                          : `${formatTimeLabel(startMin)} – ${formatTimeLabel(
                              startMin + duration
                            )} (+${BUFFER_MINUTES}m buffer)`;
                      return (
                        <li
                          key={b.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-4 py-3 text-sm"
                        >
                          <span className="font-medium">{range}</span>
                          <span className="text-black/70">
                            {exp?.label ?? b.experience_type}
                          </span>
                          <span className="text-black/70">
                            {b.client_name ?? "—"}
                            {b.party_size ? ` · party of ${b.party_size}` : ""}
                          </span>
                          <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs uppercase tracking-wide text-black/60">
                            {b.status ?? "pending"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

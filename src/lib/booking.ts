/**
 * Time-slot booking domain logic for Pasio Life.
 *
 * Experience types and their durations are the single source of truth here.
 * Availability is read from the `available_dates` table and free start times
 * are computed against existing rows in `booking_requests`.
 */

export type ExperienceType = {
  /** Stored in `available_dates.experience_type` and `booking_requests.experience_type`. */
  slug: string;
  label: string;
  durationMinutes: number;
};

/** Canonical experience types from the Pasio Life price list. */
export const EXPERIENCE_TYPES: ExperienceType[] = [
  { slug: "pony_ride", label: "Pony Ride", durationMinutes: 10 },
  { slug: "long_pony_ride", label: "Long Pony Ride", durationMinutes: 30 },
  { slug: "one_hour_trail", label: "1 Hour Trail", durationMinutes: 60 },
  { slug: "two_hour_trail", label: "2 Hour Trail", durationMinutes: 120 },
  { slug: "koedoe_trail", label: "Koedoe Trail", durationMinutes: 240 },
  { slug: "old_farm_road_trail", label: "Old Farm Road Trail", durationMinutes: 240 },
  { slug: "family_picnic", label: "Family Picnic", durationMinutes: 60 },
  { slug: "formal_picnic", label: "Formal Picnic", durationMinutes: 60 },
  { slug: "thirty_min_lesson", label: "30 min Lesson", durationMinutes: 30 },
  { slug: "one_hour_lesson", label: "1 hour Lesson", durationMinutes: 60 },
];

const EXPERIENCE_BY_SLUG = new Map(EXPERIENCE_TYPES.map((e) => [e.slug, e]));

export function getExperienceType(slug: string): ExperienceType | undefined {
  return EXPERIENCE_BY_SLUG.get(slug);
}

/** Booking window (minutes from midnight). 09:00 to 15:00. */
export const DAY_START_MINUTES = 9 * 60;
export const DAY_END_MINUTES = 15 * 60;

/** Buffer added after every booking before the next one can start. */
export const BUFFER_MINUTES = 30;

/** Granularity (minutes) used when scanning for candidate start times. */
export const SLOT_STEP_MINUTES = 30;

export type ExistingBooking = {
  /** "HH:MM" or "HH:MM:SS" start time. */
  startTime: string;
  /** Slug of the booked experience (used to look up its duration). */
  experienceSlug: string;
};

/** Parse "HH:MM" / "HH:MM:SS" into minutes from midnight. Returns null if invalid. */
export function parseTimeToMinutes(time: string | null | undefined): number | null {
  if (!time) return null;
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(time.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/** Format minutes from midnight as a 24h "HH:MM" string. */
export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Format minutes from midnight as a 12h label, e.g. "9:00 AM", "1:30 PM". */
export function formatTimeLabel(minutes: number): string {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

type Interval = { start: number; end: number };

/**
 * Build the list of occupied intervals (start .. start + duration + buffer) for a
 * day from existing bookings. Bookings of any experience type share one timeline.
 */
function buildOccupiedIntervals(existing: ExistingBooking[]): Interval[] {
  const intervals: Interval[] = [];
  for (const booking of existing) {
    const start = parseTimeToMinutes(booking.startTime);
    if (start === null) continue;
    const experience = getExperienceType(booking.experienceSlug);
    const duration = experience?.durationMinutes ?? 0;
    intervals.push({ start, end: start + duration + BUFFER_MINUTES });
  }
  return intervals;
}

/**
 * Compute the free start times (minutes from midnight) for a new booking of the
 * given duration on a day with the provided existing bookings.
 *
 * Rules:
 *  - Start times are scanned on a 30-minute grid from 09:00.
 *  - The booking itself (duration only) must finish by 15:00.
 *  - The candidate [start, start + duration + buffer) must not overlap any
 *    existing occupied interval, EXCEPT that the trailing buffer is allowed to
 *    run past 15:00 (no buffer required after the last booking of the day).
 */
export function computeAvailableStartMinutes(
  durationMinutes: number,
  existing: ExistingBooking[]
): number[] {
  if (durationMinutes <= 0) return [];
  const occupied = buildOccupiedIntervals(existing);
  const result: number[] = [];

  for (
    let start = DAY_START_MINUTES;
    start + durationMinutes <= DAY_END_MINUTES;
    start += SLOT_STEP_MINUTES
  ) {
    const candidate: Interval = {
      start,
      end: start + durationMinutes + BUFFER_MINUTES,
    };
    const conflicts = occupied.some(
      (o) => candidate.start < o.end && o.start < candidate.end
    );
    if (!conflicts) result.push(start);
  }

  return result;
}

export type AvailableSlot = {
  /** "HH:MM" 24h value to persist in `booking_requests.start_time`. */
  value: string;
  /** Human label, e.g. "9:00 AM". */
  label: string;
};

/** Convenience wrapper returning {value,label} slots for an experience slug. */
export function computeAvailableSlots(
  experienceSlug: string,
  existing: ExistingBooking[]
): AvailableSlot[] {
  const experience = getExperienceType(experienceSlug);
  if (!experience) return [];
  return computeAvailableStartMinutes(experience.durationMinutes, existing).map(
    (minutes) => ({
      value: formatMinutes(minutes),
      label: formatTimeLabel(minutes),
    })
  );
}

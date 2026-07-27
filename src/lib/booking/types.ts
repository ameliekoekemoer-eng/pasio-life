export type ExperienceType = "trail_ride" | "lesson";

export type AvailableDateRow = {
  id: string;
  available_date: string;
  experience_type: ExperienceType;
  created_at: string;
};

export type BookingRequestRow = {
  id: string;
  client_name: string;
  email: string;
  phone: string | null;
  party_size: number;
  experience_type: ExperienceType;
  chosen_date: string;
  notes: string | null;
  status: string;
  created_at: string;
};

export const EXPERIENCE_LABELS: Record<ExperienceType, string> = {
  trail_ride: "Trail ride",
  lesson: "Riding lesson"
};

export function experienceTypeFromParam(value: string | null | undefined): ExperienceType | null {
  if (!value) return null;
  const v = value.toLowerCase().replace(/[_-]+/g, " ");
  if (v === "trail_ride" || v === "trail ride" || v.includes("trail")) return "trail_ride";
  if (v === "lesson" || v === "lessons" || v.includes("lesson") || v.includes("riding lesson")) {
    return "lesson";
  }
  return null;
}

export function enquiryTopicFromParams(
  topic: string | null | undefined,
  experience: string | null | undefined
): string | null {
  const trimmedTopic = topic?.trim();
  if (trimmedTopic) return trimmedTopic;
  const trimmedExperience = experience?.trim();
  if (trimmedExperience && !experienceTypeFromParam(trimmedExperience)) {
    return trimmedExperience;
  }
  return null;
}

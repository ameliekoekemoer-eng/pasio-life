export type SubscriptionStatus = {
  active: boolean;
  tier?: "beginner" | "intermediate" | "advanced";
  status?: string;
};

export async function getSubscriptionByUserId(
  supabase: any,
  userId: string
): Promise<SubscriptionStatus> {
  // Expects a `subscriptions` table with columns:
  // - user_id (uuid, foreign key to auth.users)
  // - status (text) e.g. "active"
  // - tier (text) e.g. "beginner" | "intermediate" | "advanced"
  const { data, error } = await supabase
    .from("subscriptions")
    .select("status,tier")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return { active: false, status: "error" };
  }

  if (!data) return { active: false };
  return {
    active: data.status === "active",
    tier: data.tier,
    status: data.status
  };
}


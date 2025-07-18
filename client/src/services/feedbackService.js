import { supabase } from "./supabaseClient";

// Store user feedback in table
export async function submitFeedback(userId, catalogId, feedback) {
  const { data, error } = await supabase.from("recommendation_feedback").upsert(
    [
      {
        user_id: userId,
        catalog_id: catalogId,
        feedback, // "up" or "down"
      },
    ],
    { onConflict: ["user_id", "catlog_id"] }
  );

  return { data, error };
}

export async function fetchUserFeedback(userId) {
  const { data, error } = await supabase
    .from("recommendation_feedback")
    .select("catalog_id, feedback")
    .eq("user_id", userId);
  if (error) {
    return [];
  }
  return data;
}

export async function saveRecommendationFeedback(userId, catalogId, feedback) {
  const { error } = await supabase.from("recommendation_feedback").insert({
    user_id: userId,
    catalog_id: catalogId,
    feedback,
  });
}

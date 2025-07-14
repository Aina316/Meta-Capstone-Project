import { supabase } from "./supabaseClient";

// Store user feedback in table
export async function submitFeedback(userId, gameId, feedback) {
  const { data, error } = await supabase.from("recommendation_feedback").upsert(
    [
      {
        user_id: userId,
        game_id: gameId,
        feedback, // "up" or "down"
      },
    ],
    { onConflict: ["user_id", "game_id"] }
  );

  return { data, error };
}

export async function fetchUserFeedback(userId) {
  const { data, error } = await supabase
    .from("recommendation_feedback")
    .select("game_id, feedback")
    .eq("user_id", userId);
  if (error) {
    return [];
  }
  return data;
}

export async function saveRecommendationFeedback(userId, gameId, feedback) {
  const { error } = await supabase.from("recommendation_feedback").upsert(
    [
      {
        user_id: userId,
        game_id: gameId,
        feedback,
      },
    ],
    { onConflict: ["user_id", "game_id"] }
  );

  if (error) throw error;
}

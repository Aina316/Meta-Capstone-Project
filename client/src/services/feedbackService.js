import { supabase } from "./supabaseClient";
import { fetchCatalogGameById } from "./catalogService";
import { buildUserVector } from "./userVectorService";
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
  if (!error && (feedback === "up" || feedback === "down")) {
    await buildUserVector(userId); //rebuilds user vector when user makes feedback to adjust future recommendations
  }

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
  if (error) {
    throw error;
  }
}

export async function fetchLikedGames(userId) {
  const { data, error } = await supabase
    .from("recommendation_feedback")
    .select("catalog_id")
    .eq("user_id", userId)
    .eq("feedback", "up");

  if (error) {
    return [];
  }

  const uniqueIds = [...new Set(data.map((row) => row.catalog_id))];

  const gameFetches = await Promise.all(
    uniqueIds.map((id) => fetchCatalogGameById(id))
  );

  return gameFetches.map((res) => res.data).filter(Boolean);
}

export async function submitBorrowerFeedback(requestId, borrowerId, feedback) {
  return await supabase.from("borrower_feedback").insert([
    {
      request_id: requestId,
      borrower_id: borrowerId,
      feedback,
      created_at: new Date(),
    },
  ]);
}

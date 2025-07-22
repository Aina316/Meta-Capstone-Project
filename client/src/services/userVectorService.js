import { supabase } from "./supabaseClient";
import { fetchBorrowHistoryCatalogs } from "./gameService";
import { fetchCatalogGameById } from "./catalogService";
import { fetchLikedGames } from "./feedbackService";

export async function buildUserVector(userId) {
  const borrowedIds = await fetchBorrowHistoryCatalogs(userId);
  const likedGames = await fetchLikedGames(userId); // returns full catalog games
  const likedIds = likedGames.map((g) => g?.id).filter(Boolean);

  const allIds = Array.from(new Set([...borrowedIds, ...likedIds]));

  const genreCounts = {};
  const platformCounts = {};

  for (const id of allIds) {
    const { data } = await fetchCatalogGameById(id);
    if (!data) continue;

    const genres =
      data.genre?.split(",").map((g) => g.trim().toLowerCase()) || [];
    const platforms =
      data.platform?.split(",").map((p) => p.trim().toLowerCase()) || [];

    genres.forEach((g) => (genreCounts[g] = (genreCounts[g] || 0) + 1));
    platforms.forEach(
      (p) => (platformCounts[p] = (platformCounts[p] || 0) + 1)
    );
  }

  const totalGenres =
    Object.values(genreCounts).reduce((a, b) => a + b, 0) || 1;
  const totalPlatforms =
    Object.values(platformCounts).reduce((a, b) => a + b, 0) || 1;

  const genreVector = {};
  const platformVector = {};

  for (const g in genreCounts) {
    genreVector[g] = genreCounts[g] / totalGenres;
  }

  for (const p in platformCounts) {
    platformVector[p] = platformCounts[p] / totalPlatforms;
  }

  await supabase.from("user_vectors").upsert([
    {
      user_id: userId,
      genre_vector: genreVector,
      platform_vector: platformVector,
    },
  ]);
}

export const getUserVector = async (userId) => {
  const { data, error } = await supabase
    .from("user_vectors")
    .select("genre_vector, platform_vector")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Error fetching user vector: " + error.message);
  }

  if (!data) {
    return {
      genreVector: {},
      platformVector: {},
    };
  }

  return {
    genreVector: data.genre_vector || {},
    platformVector: data.platform_vector || {},
  };
};

export function buildGameVector(str) {
  const vector = {};
  (str || "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .forEach((val) => {
      vector[val] = 1;
    });
  return vector;
}

export function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

  keys.forEach((key) => {
    const a = vecA[key] || 0;
    const b = vecB[key] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  });

  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

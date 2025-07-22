import { supabase } from "./supabaseClient";

const buildGameVector = (field) => {
  const counts = {};
  const items = field?.split(",").map((i) => i.trim().toLowerCase()) || [];
  items.forEach((item) => (counts[item] = 1));
  const total = items.length || 1;
  const vector = {};
  for (const item in counts) {
    vector[item] = counts[item] / total;
  }
  return vector;
};

const main = async () => {
  const { data: games, error } = await supabase
    .from("catalog")
    .select("id, genre, platform");

  if (error) throw new Error("Failed to fetch catalog: " + error.message);

  const inserts = games.map((game) => ({
    catalog_id: game.id,
    genre_vector: buildGameVector(game.genre),
    platform_vector: buildGameVector(game.platform),
  }));

  const { error: insertError } = await supabase
    .from("game_vectors")
    .upsert(inserts);

  if (insertError)
    throw new Error("Failed to insert vectors: " + insertError.message);

  console.log("Game vectors precomputed and stored.");
};

main();

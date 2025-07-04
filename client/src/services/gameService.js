import { supabase } from "./supabaseClient";

export const fetchAllGames = async () => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("available", true);
  return { data, error };
};
export const fetchGamesByID = async (gameId) => {
  const { data, error } = await supabase
    .from("games")
    .select("*, owner: owner_id(id, username, image)")
    .eq("id", gameId)
    .single();
  return { data, error };
};
export const fetchOwnersForGame = async (catalogId) => {
  const { data, error } = await supabase
    .from("games")
    .select("*, owner: owner_id(id, username, image)")
    .eq("catalog_id", catalogId)
    .eq("available", true);

  return { data, error };
};
export const addGame = async (Game) => {
  const { data, error } = await supabase.from("games").insert(Game);
  return { data, error };
};

export const deleteGame = async (id) => {
  const { error } = await supabase.from("games").delete().eq("id", id);
  return { error };
};

export const fetchAvailableCopiesByCatalogId = async (catalogId) => {
  const { data, error } = await supabase
    .from("games")
    .select(
      `
      id,
      owner_id,
      available,
      condition,
      platform,
      owner:owner_id (
        id,
        username,
        image,
        borrower_score
      )
    `
    )
    .eq("catalog_id", catalogId)
    .eq("available", true);

  return { data, error };
};

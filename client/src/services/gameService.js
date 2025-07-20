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
        borrower_score,
        lender_score,
        min_borrower_score
      )
    `
    )
    .eq("catalog_id", catalogId)
    .eq("available", true);

  return { data, error };
};

export async function fetchAvailableGames() {
  const { data, error } = await supabase
    .from("games")
    .select(
      `
      id,
      available,
      owner:owner_id (
        id,
        username,
        image,
        latitude,
        longitude,
        borrower_score
      ),
      catalog:catalog_id (
        id,
        title,
        platform,
        genre,
        cover_image
      )
    `
    )
    .eq("available", true);

  if (error) throw error;
  return data || [];
}

export async function fetchUserOwnedGameIds(userId) {
  const { data, error } = await supabase
    .from("games")
    .select("catalog_id")
    .eq("owner_id", userId);

  if (error) throw error;

  const ids = data.map((g) => g.catalog_id);
  return [...new Set(ids)];
}

export async function fetchBorrowHistoryCatalogs(userId) {
  const { data: requests, error } = await supabase
    .from("requests")
    .select(
      `
      game_id,
      game:games(id, catalog_id)
    `
    )
    .eq("borrower_id", userId)
    .eq("status", "Accepted");

  if (error) throw error;

  const catalogIds = requests.map((r) => r.game?.catalog_id).filter(Boolean);
  return [...new Set(catalogIds)];
}

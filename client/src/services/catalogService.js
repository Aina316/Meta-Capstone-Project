import { supabase } from "./supabaseClient";

export const fetchGamesCatalog = async () => {
  const { data, error } = await supabase
    .from("catalog")
    .select("*")
    .order("title", { ascending: true });
  return { data, error };
};

export const fetchCatalogGameById = async (catalogId) => {
  const { data, error } = await supabase
    .from("catalog")
    .select("*")
    .eq("id", catalogId)
    .single();
  return { data, error };
};

//Function to extract all possible genres for games in catalog table
export const fetchAllGenres = async () => {
  const { data } = await supabase.from("catalog").select("genre");
  const allGenres = data
    .flatMap((row) =>
      row.genre ? row.genre.split(",").map((g) => g.trim()) : []
    )
    .filter(Boolean);

  const uniqueGenres = Array.from(new Set(allGenres));
  return uniqueGenres.sort();
};
//Function to fetch all possible platforms in catalog
export const fetchAllPlatforms = async () => {
  const { data } = await supabase
    .from("catalog")
    .select("platform")
    .neq("platform", "")
    .order("platform", { ascending: true });

  const platformSet = new Set();
  data.forEach((item) => {
    if (item.platform) {
      item.platform.split(",").forEach((p) => platformSet.add(p.trim()));
    }
  });
  return Array.from(platformSet).sort();
};

//function to fetch all games available for borrowing and lending in catalog.
export const fetchAvailableCatalogIds = async () => {
  const { data } = await supabase
    .from("games")
    .select("catalog_id")
    .eq("available", true);

  return [...new Set(data.map((item) => item.catalog_id))];
};

export const fetchAllCatalogGames = async () => {
  const { data, error } = await supabase.from("catalog").select("*");
  if (error) {
    return [];
  }
  return data;
};

export const fetchCatalogIdsWithAvailableCopies = async () => {
  const { data, error } = await supabase
    .from("games")
    .select("catalog_id")
    .eq("available", true);

  if (error) {
    return [];
  }
  const ids = data.map((row) => row.catalog_id);
  return Array.from(new Set(ids));
};

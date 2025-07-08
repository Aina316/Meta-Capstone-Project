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
  const { data, error } = await supabase.from("catalog").select("genre");

  if (error) {
    console.error("Error fetching genres: ", error);
    return [];
  }

  const allGenres = data
    .flatMap((row) =>
      row.genre ? row.genre.split(",").map((g) => g.trim()) : []
    )
    .filter(Boolean);

  const uniqueGenres = Array.from(new Set(allGenres));
  return uniqueGenres.sort();
};

export const fetchAllPlatforms = async () => {
  const { data, error } = await supabase
    .from("catalog")
    .select("platform")
    .neq("platform", "")
    .order("platform", { ascending: true });

  if (error) {
    console.error("Error fetching platforms:", error);
    return [];
  }
  const platformSet = new Set();
  data.forEach((item) => {
    if (item.platform) {
      item.platform.split(",").forEach((p) => platformSet.add(p.trim()));
    }
  });
  return Array.from(platformSet).sort();
};

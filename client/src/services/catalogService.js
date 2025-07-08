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

//function to extract all possible genres for games in catalog table
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

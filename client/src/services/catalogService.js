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

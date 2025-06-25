export const fetchUsers = async () => {
  const { data, error } = await supabase.from("users").select();
};
export const fetchGames = async () => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("available", true);
  return { data, error };
};

export const addGame = async (Game) => {
  const { data, error } = await supabase.from("games").insert(Game);
  return { data, error };
};

export const deleteGAme = async (id) => {
  const { error } = await supabase.from("games").delete().eq("id", id);
  return { error };
};

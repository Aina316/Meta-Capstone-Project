import { supabase } from "./supabaseClient";

export const createRequest = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: userError || "Not authenticated" };
  }

  const { error } = await supabase.from("transactions").insert([
    {
      game_id: gameid,
      borrower_id: user.id,
    },
  ]);
  return error;
};

import { supabase } from "./supabaseClient";

export async function getUserProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not logged in");

  const { data, error } = await supabase
    .from("profiles")
    .select("username, bio, image")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(updates) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  return { error };
}

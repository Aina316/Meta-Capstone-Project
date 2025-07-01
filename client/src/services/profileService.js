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

export async function updateUserProfile({ username, bio, image }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const updates = {};
  if (username !== undefined) updates.username = username;
  if (bio !== undefined) updates.bio = bio;
  if (image !== undefined) updates.image = image;

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .single();

  return { data, error };
}

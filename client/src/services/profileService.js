import { supabase } from "./supabaseClient";

//This gets profile of user that's currently logged in
export async function getUserProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not logged in");

  const { data, error } = await supabase
    .from("profiles")
    .select("username, bio, image, location")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
}

//This gets any user profile for recommendations
export async function fetchUserProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}
export async function updateUserProfile({
  username,
  bio,
  image,
  location,
  latitude,
  longitude,
  previousUser,
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const updates = { updated_at: new Date() };
  if (username !== undefined) updates.username = username;
  if (bio !== undefined) updates.bio = bio;
  if (image !== undefined) updates.image = image;
  if (location !== undefined) updates.location = location;
  if (latitude !== undefined) updates.latitude = latitude;
  if (longitude !== undefined) updates.longitude = longitude;
  if (previousUser !== undefined) updates.previousUser = previousUser;

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .single();

  return { data, error };
}

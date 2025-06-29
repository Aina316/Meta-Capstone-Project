import { supabase } from "./supabaseClient";

export async function uploadAvatar(file, userId) {
  if (!file || !userId) {
    return { error: new Error("Missing File or userId") };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) return { error: uploadError };

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ image: publicUrl })
    .eq("id", userId);

  if (updateError) return { error: updateError };
  return { error: null, url: publicUrl };
}

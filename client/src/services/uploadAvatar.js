import { supabase } from "./supabaseClient";

export async function uploadAvatar(file, userId) {
  console.log("File: ", file);
  console.log("User Id: ", userId);
  if (!file || !userId) {
    return { error: new Error("Missing File or userId") };
  }
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${userId}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) return { error: uploadError };

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ image: publicUrl })
    .eq("id", userId);

  return { error: updateError, url: publicUrl };
}

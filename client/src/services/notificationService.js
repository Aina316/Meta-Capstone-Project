import { supabase } from "./supabaseClient";

export const createNotification = async ({ userId, message, type }) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) {
    console.error("Error getting current user:", authError);
    return { error: authError };
  }

  if (!userId || !message) {
    console.error("Missing userId or message for notification");
    return { error: new Error("Invalid notification payload") };
  }

  if (userId === user.id) {
    console.log("Skipping notification to self");
    return { error: null };
  }

  const { error } = await supabase.from("notifications").insert([
    {
      user_id: userId,
      message,
      type,
      read: false,
    },
  ]);
  return { error };
};

export const fetchNotificationsForUser = async (userId) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const markNotificationAsRead = async (notificationId) => {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  return { error };
};

export const markAllNotificationsAsRead = async (userId) => {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);

  return { error };
};

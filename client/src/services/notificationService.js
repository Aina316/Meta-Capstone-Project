import { supabase } from "./supabaseClient";

export const createNotification = async ({
  userId,
  message,
  type,
  requestId,
  borrowerId,
  catalogId,
}) => {
  if (!userId || !message || !type) {
    return { error: new Error("Invalid notification payload") };
  }

  const { error } = await supabase.from("notifications").insert([
    {
      user_id: userId,
      request_id: requestId ?? null,
      borrower_id: borrowerId ?? null,
      catalog_id: catalogId ?? null,
      message,
      type,
      read: false,
      created_at: new Date().toISOString(),
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

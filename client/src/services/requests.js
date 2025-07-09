import { supabase } from "./supabaseClient";
import { createNotification } from "./notificationService";

export const fetchRequestsForLender = async (lenderId) => {
  const { data, error } = await supabase
    .from("requests")
    .select(
      `
      *,
      borrower: profiles!requests_borrower_id_fkey(id, username, image, borrower_score), 
      game: games(id, title)
    `
    )
    .eq("lender_id", lenderId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const fetchRequestsForBorrower = async (borrowerId) => {
  const { data, error } = await supabase
    .from("requests")
    .select(
      `
        *,
        lender: profiles!requests_lender_id_fkey(id, username, image, lender_score),
        game: games(id, title)
      `
    )
    .eq("borrower_id", borrowerId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const createBorrowRequest = async ({ lenderId, gameId, gameTitle }) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return { error: authError };
  }

  const { error } = await supabase.from("requests").insert([
    {
      borrower_id: user.id,
      lender_id: lenderId,
      game_id: gameId,
      status: "Pending",
    },
  ]);

  if (error) return { error };

  await createNotification({
    userId: lenderId,
    message: `You have a new borrow request for "${gameTitle}".`,
    type: "new_request",
  });

  return { error: null };
};

export const makeGameUnavailable = async (gameId) => {
  const { error } = await supabase
    .from("games")
    .update({ available: false })
    .eq("id", gameId);
  return { error };
};

export const updateApprovalStatus = async (
  requestId,
  newStatus,
  instructions,
  borrowerId,
  gameTitle
) => {
  const { error } = await supabase
    .from("requests")
    .update({ status: newStatus, share_instructions: instructions })
    .eq("id", requestId);

  if (error) return { error };

  await createNotification({
    userId: borrowerId,
    message: `Your borrow request for "${gameTitle}" was accepted.`,
    type: "accepted",
  });

  return { error: null };
};

export const updateDenialStatus = async (
  requestId,
  newStatus,
  borrowerId,
  gameTitle
) => {
  const { error } = await supabase
    .from("requests")
    .update({ status: newStatus })
    .eq("id", requestId);

  if (error) return { error };

  await createNotification({
    userId: borrowerId,
    message: `Your borrow request for "${gameTitle}" was declined.`,
    type: "declined",
  });

  return { error: null };
};

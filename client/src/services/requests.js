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

export const createBorrowRequest = async ({
  lenderId,
  gameId,
  gameTitle,
  startDate,
  returnDate,
}) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) return { error: authError };

  // Insert the request and RETURN the new row
  const { data: newRequest, error } = await supabase
    .from("requests")
    .insert([
      {
        borrower_id: user.id,
        lender_id: lenderId,
        game_id: gameId,
        status: "Pending",
        start_date: startDate,
        return_date: returnDate,
      },
    ])
    .select("id") // fetch the new request's ID
    .single();

  if (error) return { error };

  // Create the notification, linking to the new request
  await createNotification({
    userId: lenderId,
    message: `You have a new borrow request for "${gameTitle}".`,
    type: "new_request",
    requestId: newRequest.id,
    borrowerId: user.id,
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
  gameId,
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
    requestId,
  });

  const { error: declineError } = await supabase
    .from("requests")
    .update({ status: "Declined" })
    .neq("id", requestId)
    .eq("game_id", gameId)
    .eq("status", "Pending");

  if (declineError) return;
  const { data: declinedRequests, error: fetchDeclinedError } = await supabase
    .from("requests")
    .select("borrower_id")
    .eq("game_id", gameId)
    .eq("status", "Declined");

  if (fetchDeclinedError) {
    return;
  } else {
    for (const req of declinedRequests) {
      await createNotification({
        userId: req.borrower_id,
        message: `Your borrow request for "${gameTitle}" was declined.`,
        type: "declined",
        requestId,
      });
    }
  }

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
    message: `Your Request for ${gameTitle} got declined. However, we can recommend you games similar to ${gameTitle}. Do you want to see?`,
    type: "declined",
    requestId,
  });

  return { error: null };
};

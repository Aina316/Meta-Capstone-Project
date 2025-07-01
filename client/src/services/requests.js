import { supabase } from "./supabaseClient";

export const fetchRequestsForLender = async (lenderId) => {
  const { data, error } = await supabase
    .from("requests")
    .select(
      `
      *,
      borrower: profiles!requests_borrower_id_fkey(id, username, image, borrower_score)
    `
    )
    .eq("lender_id", lenderId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const createBorrowRequest = async ({ borrowerId, lenderId, gameId }) => {
  const { error } = await supabase.from("requests").insert([
    {
      borrower_id: borrowerId,
      lender_id: lenderId,
      game_id: gameId,
      status: "Pending",
    },
  ]);
  return error;
};

export const makeGameUnavailable = async (gameId) => {
  const { error } = await supabase
    .from("games")
    .update({ available: false })
    .eq("id", gameId);
  return { error };
};

export const updateRequestStatusWithInstructions = async (
  requestId,
  newStatus,
  instructions
) => {
  const { error } = await supabase
    .from("requests")
    .update({ status: newStatus, share_instructions: instructions })
    .eq("id", requestId);
  return { error };
};

export const updateRequestStatus = async (requestId, newStatus) => {
  const { error } = await supabase
    .from("requests")
    .update({ status: newStatus })
    .eq("id", requestId);

  return { error };
};

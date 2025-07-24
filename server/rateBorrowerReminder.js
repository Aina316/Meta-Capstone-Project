import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function main() {
  const { data: pendingRequests, error } = await supabase.rpc(
    "get_pending_feedback"
  );
  if (error) {
    return;
  }

  for (const req of pendingRequests) {
    const { data: existing, error: checkError } = await supabase
      .from("notifications")
      .select("id")
      .eq("request_id", req.id)
      .eq("type", "rate_borrower")
      .maybeSingle();

    if (checkError || existing) continue;

    const message = "Please rate your recent borrower.";
    await supabase.from("notifications").insert([
      {
        user_id: req.lender_id,
        request_id: req.id,
        borrower_id: req.borrower_id,
        type: "rate_borrower",
        message,
        read: false,
        created_at: new Date().toISOString(),
      },
    ]);
  }
}

main();

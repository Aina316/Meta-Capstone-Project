import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function main() {
  const now = new Date();
  const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const today = now.toISOString().split("T")[0];
  const dateIn48Hours = in48Hours.toISOString().split("T")[0];
  // Get all requests with a return date within next 48 hours
  const { data: requests, error } = await supabase
    .from("requests")
    .select("id, borrower_id, return_date,game:game_id(title)")
    .eq("status", "Accepted")
    .lte("return_date", dateIn48Hours)
    .gte("return_date", today);
  if (error) {
    return;
  }
  if (!requests.length) {
    return;
  }
  if (error) {
    return;
  }

  if (!requests.length) {
    return;
  }

  for (const req of requests) {
    const message = `Reminder: Your borrowed game "${req.game?.title}" is due by ${req.return_date}.`;

    const { error: notifError } = await supabase.from("notifications").upsert(
      {
        user_id: req.borrower_id,
        type: "deadline",
        request_id: req.id,
        message,
        read: false,
        created_at: new Date().toISOString(),
      },
      { onConflict: "request_id,type" }
    );

    if (notifError) {
      throw notifError;
    }
  }
}

main();

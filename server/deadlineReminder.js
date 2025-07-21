import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function main() {
  const now = new Date();
  const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  // Get all requests with a return date within next 48 hours
  const { data: requests, error } = await supabase
    .from("requests")
    .select("id, borrower_id, return_date, game_id, game: title(title)")
    .eq("status", "Accepted")
    .lt("return_date", in48Hours.toISOString())
    .gt("return_date", now.toISOString());

  if (error) {
    alert("Error querying requests:", error);
    return;
  }

  if (!requests.length) {
    return;
  }

  for (const req of requests) {
    const message = `Reminder: Your borrowed game "${req.game?.title}" is due by ${req.return_date}.`;

    // Insert deadline notification into notifications table
    const { error: notifError } = await supabase.from("notifications").insert([
      {
        user_id: req.borrower_id,
        type: "deadline",
        message,
        read: false,
        created_at: new Date().toISOString(),
      },
    ]);

    if (notifError) {
      alert(`Error inserting notification for user ${req.borrower_id}:`);
    }
  }
}

main();

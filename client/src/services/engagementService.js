import { supabase } from "./supabaseClient";
import { buildUserVector } from "./userVectorService";

export async function logEngagement(userId, catalogId, action) {
  if (!["click", "borrow"].includes(action)) {
    throw new Error("Invalid engagement type");
  }

  const { data, error: fetchError } = await supabase
    .from("recommendation_engagements")
    .select("*")
    .eq("user_id", userId)
    .eq("catalog_id", catalogId)
    .maybeSingle();

  if (fetchError) return;

  const now = new Date().toISOString();

  if (data) {
    const updateFields = {
      updated_at: now,
    };

    if (action === "click") {
      updateFields.click_count = (data.click_count || 0) + 1;
      updateFields.last_click_at = now;
    } else if (action === "borrow") {
      updateFields.borrow_count = (data.borrow_count || 0) + 1;
      updateFields.last_borrow_at = now;
    }

    const { error: updateError } = await supabase
      .from("recommendation_engagements")
      .update(updateFields)
      .eq("user_id", userId)
      .eq("catalog_id", catalogId);

    if (updateError) {
      alert("Failed to update engagement: " + updateError.message);
    }
    if (action === "borrow") {
      await buildUserVector(userId); // When game is borrowed rebuild user's vector to reflect new preference
    }
  } else {
    const insertData = {
      user_id: userId,
      catalog_id: catalogId,
      click_count: action === "click" ? 1 : 0,
      borrow_count: action === "borrow" ? 1 : 0,
      last_click_at: action === "click" ? now : null,
      last_borrow_at: action === "borrow" ? now : null,
      updated_at: now,
      created_at: now,
    };

    const { error: insertError } = await supabase
      .from("recommendation_engagements")
      .insert([insertData]);

    if (insertError) {
      alert("Failed to insert engagement: " + insertError.message);
    }
  }
}

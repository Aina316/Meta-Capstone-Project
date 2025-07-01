import fetch from "node-fetch";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getIGDBAccessToken() {
  const res = await fetch(`https://id.twitch.tv/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  const data = await res.json();
  return data.access_token;
}

async function fetchIGDBGames(accessToken) {
  const IGDB_URL = "https://api.igdb.com/v4/games";
  const query = `
    fields id, name, cover.url, genres.name, platforms.name;
    where cover != null & genres != null & platforms != null;
    sort popularity desc;
    limit 50;
  `;

  const res = await fetch(IGDB_URL, {
    method: "POST",
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    body: query,
  });

  const data = await res.json();
  return data;
}

async function insertIntoSupabase(games) {
  const formatted = games.map((game) => ({
    igdb_id: game.id,
    title: game.name,
    cover_image: game.cover ? `https:${game.cover.url}` : null,
    platform: game.platforms?.map((p) => p.name).join(", ") || "",
    genre: game.genres?.map((g) => g.name).join(", ") || "",
  }));

  console.log(`Prepared ${formatted.length} games to insert.`);

  const { error } = await supabase.from("catalog").insert(formatted);

  if (error) {
    console.error("Error inserting to Supabase:", error);
  } else {
    console.log("Successfully inserted games!");
  }
}

(async () => {
  try {
    console.log("Getting IGDB access token...");
    const token = await getIGDBAccessToken();

    console.log("Fetching games from IGDB...");
    const games = await fetchIGDBGames(token);
    console.log(`Fetched ${games.length} games.`);

    console.log("Inserting into Supabase...");
    await insertIntoSupabase(games);

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding failed:", err);
  }
})();

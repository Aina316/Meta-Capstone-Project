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
    fields id, name, cover.url, genres.name, platforms.name, summary, release_dates.y;
    where cover != null & genres != null & platforms != null;
    sort popularity desc;
    limit 500;
  `;

  const res = await fetch(IGDB_URL, {
    method: "POST",
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    body: query,
  });

  return await res.json();
}
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function extractEarliestReleaseYear(release_dates) {
  if (!release_dates || !Array.isArray(release_dates)) return null;

  const years = release_dates
    .map((date) => date.y)
    .filter((y) => typeof y === "number" && y > 1970 && y < 2100);

  if (years.length === 0) return null;

  return Math.min(...years);
}

async function insertGamesIntoSupabase(games) {
  const formatted = games.map((game) => ({
    igdb_id: game.id,
    title: game.name,
    cover_image: game.cover
      ? `https:${game.cover.url.replace("t_thumb", "t_original")}`
      : null,
    platform: game.platforms?.map((p) => p.name).join(", ") || "",
    genre: game.genres?.map((g) => g.name).join(", ") || "",
    synopsis: game.summary || "No synopsis",
    rating: getRandomFloat(1, 10).toFixed(1),
    release_year: extractEarliestReleaseYear(game.release_dates) || 2020,
  }));

  await supabase.from("catalog").delete().neq("genre", "");

  await supabase.from("catalog").insert(formatted);
}

(async () => {
  try {
    const token = await getIGDBAccessToken();
    const games = await fetchIGDBGames(token);
    await insertGamesIntoSupabase(games);
  } catch {}
})();

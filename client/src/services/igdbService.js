export const fetchGame = async (searchTitle) => {
  const CLIENT_ID = import.meta.env.VITE_IGDB_CLIENT_ID;
  const BEARER_TOKEN = import.meta.env.VITE_IGDB_BEARER_TOKEN;

  if (!CLIENT_ID || !BEARER_TOKEN) {
    throw new Error("Missing IGDB credentials in .env");
  }

  const endpoint = "https://api.igdb.com/v4/games";

  const body = `
    search "${searchTitle}";
    fields name,cover.image_id,platforms.name,summary;
    limit 1;
  `;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "text/plain",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`IGDB API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    // Transform result
    const game = data[0];
    const imageUrl = game.cover
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
      : null;

    return {
      title: game.name,
      imageUrl,
      platform: game.platforms?.[0]?.name || "Unknown",
      summary: game.summary || "",
    };
  } catch (error) {
    return null;
  }
};

import { fetchUserProfile } from "./profileService";
import { fetchAvailableGames } from "./gameService";

//This is the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function scoreGame({ userLat, userLon, userGenres, game }) {
  const distanceWeight = 0.6;
  const genreWeight = 0.4;

  const distKm = calculateDistance(
    userLat,
    userLon,
    game.latitude,
    game.longitude
  );
  let distanceScore =
    distKm <= 5 ? 1 : distKm <= 20 ? 0.75 : distKm <= 50 ? 0.5 : 0.2;

  let genreScore = 0;
  const gameGenres = (game.catalog?.genre || "")
    .split(",")
    .map((g) => g.trim().toLowerCase());
  userGenres.forEach((g, index) => {
    const weight = (5 - index) / 5;
    if (gameGenres.includes(g.toLowerCase())) {
      genreScore += weight;
    }
  });
  genreScore = Math.min(genreScore / userGenres.length, 1);

  return distanceWeight * distanceScore + genreWeight * genreScore;
}

export async function recommendGamesForUser(userId, limit = 10) {
  const profile = await fetchUserProfile(userId);
  if (!profile.latitude || !profile.longitude || !profile.favorite_genres) {
    throw new Error("User must have location and favorite genres set");
  }
  const userGenres = Array.isArray(profile.favorite_genres)
    ? profile.favorite_genres
    : [];

  // Fetch all available games
  const games = await fetchAvailableGames();

  // Exclude any games owned by the user themselves
  const filteredGames = games.filter((game) => game.owner_id !== userId);

  const scoredGames = filteredGames
    .map((game) => ({
      ...game,
      score: scoreGame({
        userLat: profile.latitude,
        userLon: profile.longitude,
        userGenres,
        game,
      }),
    }))
    .filter((g) => g.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scoredGames;
}

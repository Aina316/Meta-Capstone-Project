import { fetchUserProfile } from "./profileService";
import { fetchAvailableGames, fetchUserOwnedGameIds } from "./gameService";
import { fetchUserFeedback } from "./feedbackService";

//Caluclate Distance using the Haversine Formula
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

function scoreGame({ userLat, userLon, userGenres, game, feedbackMap }) {
  const distanceWeight = 0.5;
  const genreWeight = 0.3;
  const releaseWeight = 0.2;

  // Distance Score
  let distanceScore = 0;
  if (
    game.owner?.latitude != null &&
    game.owner?.longitude != null &&
    userLat != null &&
    userLon != null
  ) {
    const distKm = calculateDistance(
      userLat,
      userLon,
      game.owner.latitude,
      game.owner.longitude
    );
    distanceScore =
      distKm <= 5 ? 1 : distKm <= 20 ? 0.75 : distKm <= 50 ? 0.5 : 0.2;
  } else {
    alert("Missing Location");
  }

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

  let releaseScore = 0.5;
  if (game.catalog?.release_year) {
    const now = new Date().getFullYear();
    const age = now - game.catalog.release_year;
    releaseScore = age < 3 ? 1 : age < 6 ? 0.75 : age < 10 ? 0.5 : 0.2;
  }

  let feedbackBoost = 0;
  if (feedbackMap[game.id] === "up") feedbackBoost = 0.15;
  else if (feedbackMap[game.id] === "down") feedbackBoost = -1;

  let score =
    distanceWeight * distanceScore +
    genreWeight * genreScore +
    releaseWeight * releaseScore +
    feedbackBoost;

  return Math.max(0, Math.min(score, 1));
}

export async function recommendGamesForUser(userId, limit = 10) {
  const profile = await fetchUserProfile(userId);
  if (!profile.latitude || !profile.longitude || !profile.favorite_genres) {
    throw new Error("User must have location and favorite genres set");
  }
  const userGenres = Array.isArray(profile.favorite_genres)
    ? profile.favorite_genres
    : [];

  const ownedCatalogIds = await fetchUserOwnedGameIds(userId);
  const feedback = await fetchUserFeedback(userId);
  const feedbackMap = {};
  feedback.forEach((f) => {
    feedbackMap[f.game_id] = f.feedback;
  });

  const games = await fetchAvailableGames();

  const filteredGames = games.filter(
    (game) =>
      game.owner?.id !== userId &&
      !ownedCatalogIds.includes(game.catalog?.id) &&
      feedbackMap[game.id] !== "down"
  );

  const scoredGames = filteredGames
    .map((game) => {
      return {
        ...game,
        score: scoreGame({
          userLat: profile.latitude,
          userLon: profile.longitude,
          userGenres,
          game,
          feedbackMap,
        }),
      };
    })
    .filter((g) => g.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scoredGames;
}

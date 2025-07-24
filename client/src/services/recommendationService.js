import { supabase } from "./supabaseClient";
import { fetchUserProfile } from "./profileService";
import {
  fetchUserOwnedGameIds,
  fetchBorrowHistoryCatalogs,
} from "./gameService";
import {
  fetchCatalogGameById,
  fetchAllCatalogGames,
  fetchCatalogIdsWithAvailableCopies,
} from "./catalogService";
import { fetchUserFeedback } from "./feedbackService";
import {
  getUserVector,
  buildGameVector,
  cosineSimilarity,
} from "./userVectorService";

//Caluclate Distance using the Haversine Formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getAdaptiveWeights = ({
  totalBorrows = 0,
  totalClicks = 0,
  totalUpvotes = 0,
  totalDownvotes = 0,
}) => {
  const totalEngagement = totalBorrows + totalClicks + 1;
  const clickInfluence = totalClicks / totalEngagement;
  const borrowInfluence = totalBorrows / totalEngagement;
  const feedbackScore =
    (totalUpvotes - totalDownvotes) / (totalUpvotes + totalDownvotes + 1);

  return {
    distance: 0,
    genre: 200 + 100 * borrowInfluence,
    platform: 300 + 100 * clickInfluence,
    release: 0,
    condition: 0,
    feedback: 1 + 1 * feedbackScore,
    engagement: 0.5 + 1 * borrowInfluence,
    borrowPattern: 1 + 2 * borrowInfluence,
    availability: 1 + 0.5 * clickInfluence,
    upvoteSimilarity: 1 + 0.25 * feedbackScore,
  };
};

const getDecayMultiplier = (timestamp) => {
  const now = new Date();
  const created = new Date(timestamp);
  const diffDays = (now - created) / (1000 * 60 * 60 * 24);
  return Math.max(0.2, 1 - diffDays / 30);
};

const getUserBorrowPatterns = async (catalogIds) => {
  const genreCount = {};
  const platformCount = {};

  for (const id of catalogIds) {
    const { data } = await fetchCatalogGameById(id);
    if (!data) continue;
    (data.genre || "")
      .split(",")
      .map((g) => g.trim().toLowerCase())
      .forEach((g) => (genreCount[g] = (genreCount[g] || 0) + 1));

    (data.platform || "")
      .split(",")
      .map((p) => p.trim().toLowerCase())
      .forEach((p) => (platformCount[p] = (platformCount[p] || 0) + 1));
  }

  const topGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .map(([g]) => g);

  const topPlatforms = Object.entries(platformCount)
    .sort((a, b) => b[1] - a[1])
    .map(([p]) => p);
  return { topGenres, topPlatforms };
};

const fetchEngagementScores = async (userId) => {
  const { data, error } = await supabase
    .from("recommendation_engagements")
    .select(
      "catalog_id, click_count, borrow_count, last_click_at, last_borrow_at"
    )
    .eq("user_id", userId);

  const engagementMap = {};

  if (data && !error) {
    for (const row of data) {
      const clickBoost =
        (row.click_count || 0) * getDecayMultiplier(row.last_click_at);
      const borrowBoost =
        (row.borrow_count || 0) * 2 * getDecayMultiplier(row.last_borrow_at);

      engagementMap[row.catalog_id] =
        (engagementMap[row.catalog_id] || 0) + clickBoost + borrowBoost;
    }
  } else if (error) {
    throw error.message;
  }

  return engagementMap;
};

const logRecommendationEvents = async (userId, games) => {
  const events = games.map((g) => ({
    user_id: userId,
    catalog_id: g.catalog?.id ?? g.catalog_id,
    action: "recommend",
    explanation: g.explanation || null,
  }));

  const { error } = await supabase.from("recommendation_events").insert(events);
  if (error) {
    throw error;
  }
};

const scoreGame = ({
  userLat,
  userLon,
  game,
  feedbackMap,
  engagementMap = {},
  borrowedGenres = [],
  borrowedPlatforms = [],
  isAvailable = false,
  upvotedReferenceGenres = [],
  upvotedReferencePlatform = "",
  genreScore = 0,
  platformScore = 0,
  weights,
}) => {
  const distanceScore = (() => {
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
      return distKm <= 5 ? 1 : distKm <= 20 ? 0.75 : distKm <= 50 ? 0.5 : 0.2;
    }
    return 0;
  })();

  const gameGenres = (game.genre || "")
    .split(",")
    .map((g) => g.trim().toLowerCase());

  const releaseScore = (() => {
    if (game.release_year) {
      const age = new Date().getFullYear() - game.release_year;
      return age < 3 ? 1 : age < 6 ? 0.75 : age < 10 ? 0.5 : 0.2;
    }
    return 0.5;
  })();

  const conditionScore = (() => {
    const condition = (game.condition || "").toLowerCase();
    return condition === "Good" ? 1 : condition === "Fair" ? 0.5 : 0.2;
  })();

  const feedbackBoost =
    feedbackMap[game.id] === "up"
      ? 0.15
      : feedbackMap[game.id] === "down"
      ? -2.5
      : 0;

  const engagementBoost = engagementMap[game.id] || 0;
  const availabilityBoost = isAvailable ? 1 : 0;

  const borrowPatternScore = (() => {
    let score = 0;
    gameGenres.forEach((g) => {
      if (borrowedGenres.includes(g)) score += 0.5;
    });
    const platform = (game.catalog?.platform || "").toLowerCase();
    if (borrowedPlatforms.includes(platform)) score += 0.5;
    return Math.min(score, 1);
  })();

  const upvoteSimilarityScore = (() => {
    let genreScore = 0;
    gameGenres.forEach((g) => {
      if (upvotedReferenceGenres.includes(g)) genreScore += 1;
    });
    const genreSimilarity = genreScore / (upvotedReferenceGenres.length || 1);

    const gamePlatform = (game.catalog?.platform || "").toLowerCase();
    const platformSimilarity =
      gamePlatform === upvotedReferencePlatform ? 1 : 0;
    return (genreSimilarity + platformSimilarity) / 2;
  })();

  const weightedScore =
    weights.distance * distanceScore +
    weights.genre * genreScore +
    weights.platform * platformScore +
    weights.release * releaseScore +
    weights.condition * conditionScore +
    weights.feedback * feedbackBoost +
    weights.engagement * engagementBoost +
    weights.borrowPattern * borrowPatternScore +
    weights.availability * availabilityBoost +
    weights.upvoteSimilarity * upvoteSimilarityScore;

  return {
    score: Math.max(0, Math.min(weightedScore, 1)),
    explanation: {
      distanceScore,
      genreScore,
      platformScore,
      releaseScore,
      conditionScore,
      feedbackBoost,
      engagementBoost,
      borrowPatternScore,
      availabilityBoost,
      upvoteSimilarityScore,
    },
  };
};

export const recommendGamesForUser = async (
  userId,
  limit = 300,
  referenceGame = null,
  excludeCatalogIds = []
) => {
  const profile = await fetchUserProfile(userId);
  const { genreVector: userGenreVector, platformVector: userPlatformVector } =
    await getUserVector(userId);

  const { latitude, longitude, favorite_genres, favorite_platforms } = profile;

  if (!latitude || !longitude || !favorite_genres || !favorite_platforms) {
    throw new Error("User must have location and favorite genres set");
  }

  const userGenres = Array.isArray(favorite_genres)
    ? favorite_genres
    : favorite_genres.split(",").map((g) => g.trim().toLowerCase());
  const userPlatforms = Array.isArray(favorite_platforms)
    ? favorite_platforms
    : favorite_platforms.split(",").map((g) => g.trim().toLowerCase());

  const ownedCatalogIds = await fetchUserOwnedGameIds(userId);
  const feedback = await fetchUserFeedback(userId);
  const feedbackMap = {};
  feedback.forEach((f) => {
    feedbackMap[f.catalog_id || f.game_id] = f.feedback;
  });

  const totalUpvotes = feedback.filter((f) => f.feedback === "up").length;
  const totalDownvotes = feedback.filter((f) => f.feedback === "down").length;

  let upvotedReferenceGenres = [];
  let upvotedReferencePlatform = "";
  if (referenceGame?.catalog) {
    upvotedReferenceGenres = (referenceGame.catalog.genre || "")
      .split(",")
      .map((g) => g.trim().toLowerCase());
    upvotedReferencePlatform = (
      referenceGame.catalog.platform || ""
    ).toLowerCase();
  }

  const downvotedCatalogIds = Object.keys(feedbackMap).filter(
    (id) => feedbackMap[id] === "down"
  );
  const borrowedCatalogIds = await fetchBorrowHistoryCatalogs(userId);
  const { topGenres: borrowedGenres, topPlatforms: borrowedPlatforms } =
    await getUserBorrowPatterns(borrowedCatalogIds);

  const engagementMap = await fetchEngagementScores(userId);
  let totalClicks = 0;
  let totalBorrows = 0;

  Object.values(engagementMap).forEach((score) => {
    totalClicks += score / 3;
  });

  const adaptiveWeights = getAdaptiveWeights({
    totalBorrows,
    totalClicks,
    totalUpvotes,
    totalDownvotes,
  });

  const availableCatalogIds = await fetchCatalogIdsWithAvailableCopies();
  const games = await fetchAllCatalogGames();
  const filtered = games.filter(
    (g) =>
      !ownedCatalogIds.includes(g.id) &&
      !downvotedCatalogIds.includes(g.id) &&
      !excludeCatalogIds.includes(g.id)
  );

  const scored = filtered.map((game) => {
    const dummyGame = {
      id: game.id,
      catalog: game,
      owner: null,
      condition: null,
    };

    const isAvailable = availableCatalogIds.includes(game.id);
    const gameGenreVector = buildGameVector(game.genre);
    const gamePlatformVector = buildGameVector(game.platform);

    const genreScore = cosineSimilarity(userGenreVector, gameGenreVector);
    const platformScore = cosineSimilarity(
      userPlatformVector,
      gamePlatformVector
    );

    const result = scoreGame({
      userLat: latitude,
      userLon: longitude,
      userGenres,
      userPlatforms,
      topPlatforms: borrowedPlatforms,
      borrowedGenres,
      borrowedPlatforms,
      game,
      feedbackMap,
      engagementMap,
      isAvailable,
      upvotedReferenceGenres,
      upvotedReferencePlatform,
      genreScore,
      platformScore,
      weights: adaptiveWeights,
    });

    return {
      ...dummyGame,
      score: result.score,
      explanation: result.explanation,
    };
  });

  let sorted = scored
    .filter((g) => g.score > 0)
    .sort((a, b) => {
      const aAvailable = availableCatalogIds.includes(a.id) ? 1 : 0;
      const bAvailable = availableCatalogIds.includes(b.id) ? 1 : 0;

      if (aAvailable !== bAvailable) return bAvailable - aAvailable;
      const aDown = feedbackMap[a.id] === "down" ? 1 : 0;
      const bDown = feedbackMap[b.id] === "down" ? 1 : 0;
      if (aDown !== bDown) return aDown - bDown;
      return b.score - a.score;
    });

  if (sorted.length === 0) {
    sorted = scored.sort((a, b) => b.score - a.score).slice(0, limit);
  } else {
    sorted = sorted.slice(0, limit);
  }

  await logRecommendationEvents(userId, sorted);
  return sorted;
};

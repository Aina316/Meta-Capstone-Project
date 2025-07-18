import { useEffect, useState } from "react";
import GameList from "../Game/GameList";
import "./HomePage.css";
import Header from "../../../components/Header";
import RequestBoard from "../Request/RequestBoard";
import GameDetails from "../../../components/GameDetails";
import { useAuth } from "../../../context/authContext";
import { recommendGamesForUser } from "../../../services/recommendationService";
import { saveRecommendationFeedback } from "../../../services/feedbackService";
import { logEngagement } from "../../../services/engagementService";

const HomePage = () => {
  const { user } = useAuth();
  const [allRecommendations, setAllRecommendations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [recError, setRecError] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState({});
  const [selectedGame, setSelectedGame] = useState(null);

  const loadRecommendations = async (referenceGame = null) => {
    if (!user) {
      setLoadingRecs(false);
      return;
    }
    try {
      const recs = await recommendGamesForUser(user.id, 50);
      setAllRecommendations(recs);
      setRecommendations(recs.slice(0, 3));
    } catch (err) {
      setRecError("Failed to load recommendations.");
    } finally {
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const handleFeedback = async (gameId, feedback) => {
    try {
      await saveRecommendationFeedback(user.id, gameId, feedback);
      setFeedbackStatus((prev) => ({ ...prev, [gameId]: feedback }));

      // Remove the game that was just rated
      const updated = allRecommendations.filter((g) => g.id !== gameId);

      setAllRecommendations(updated);
      setRecommendations(updated.slice(0, 3));
    } catch (err) {
      alert("Failed to save feedback.");
    }
  };

  return (
    <div className="home-component">
      <Header />
      <h1>Welcome to the Gamers Den!</h1>

      <main className="home-content">
        <div className="game-list-section">
          <section className="recommendation-section">
            <h2>Recommended for You</h2>
            {loadingRecs && <p>Loading recommendations...</p>}
            {recError && <p style={{ color: "red" }}>{recError}</p>}
            {!loadingRecs && !recError && recommendations.length === 0 && (
              <p>No recommendations yet. Complete your profile!</p>
            )}
            {!loadingRecs && recommendations.length > 0 && (
              <div className="recommendations-grid">
                {recommendations.map((game) => (
                  <div
                    key={game.id}
                    className="recommendation-card"
                    onClick={async () => {
                      await logEngagement(user.id, game.id, "click");
                      setSelectedGame(game);
                    }}
                  >
                    <div className="recommendation-content">
                      {game.catalog?.cover_image && (
                        <img
                          src={game.catalog.cover_image}
                          alt={game.catalog?.title}
                          className="game-image"
                        />
                      )}
                      <h3>{game.catalog?.title}</h3>
                      <p>
                        <strong>Platform:</strong> {game.catalog?.platform}
                      </p>
                      <p>
                        <strong>Genres:</strong> {game.catalog?.genre}
                      </p>
                    </div>
                    <div className="feedback-buttons">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await handleFeedback(game.id, "up", game);
                        }}
                        disabled={feedbackStatus[game.id] === "up"}
                        className={
                          feedbackStatus[game.id] === "up" ? "thumb-active" : ""
                        }
                      >
                        👍
                      </button>

                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await handleFeedback(game.id, "down");
                        }}
                        disabled={feedbackStatus[game.id] === "down"}
                        className={
                          feedbackStatus[game.id] === "down"
                            ? "thumb-active"
                            : ""
                        }
                      >
                        👎
                      </button>
                    </div>
                  </div>
                ))}
                {selectedGame && (
                  <GameDetails
                    catalogGame={selectedGame.catalog}
                    onClose={() => setSelectedGame(null)}
                  />
                )}
              </div>
            )}
          </section>

          <GameList />
        </div>

        <div className="requests-section">
          <RequestBoard />
        </div>
      </main>
    </div>
  );
};

export default HomePage;

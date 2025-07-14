import { useEffect, useState } from "react";
import GameList from "../Game/GameList";
import "./HomePage.css";
import Header from "../../../components/Header";
import RequestBoard from "../Request/RequestBoard";
import { useAuth } from "../../../context/authContext";
import { recommendGamesForUser } from "../../../services/recommendationService";
import { saveRecommendationFeedback } from "../../../services/feedbackService";

const HomePage = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [recError, setRecError] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState({});

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user) {
        setLoadingRecs(false);
        return;
      }
      try {
        const recs = await recommendGamesForUser(user.id);
        setRecommendations(recs.slice(0, 3));
      } catch (err) {
        setRecError("Failed to load recommendations.");
      } finally {
        setLoadingRecs(false);
      }
    };

    loadRecommendations();
  }, [user]);

  const handleFeedback = async (gameId, feedback) => {
    try {
      await saveRecommendationFeedback(user.id, gameId, feedback);
      setFeedbackStatus((prev) => ({ ...prev, [gameId]: feedback }));
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
                  <div key={game.id} className="recommendation-card">
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
                        onClick={() => handleFeedback(game.id, "up")}
                        disabled={feedbackStatus[game.id] === "up"}
                        className={
                          feedbackStatus[game.id] === "up" ? "thumb-active" : ""
                        }
                      >
                        👍
                      </button>
                      <button
                        onClick={() => handleFeedback(game.id, "down")}
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

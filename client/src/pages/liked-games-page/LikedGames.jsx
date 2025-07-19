import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { fetchLikedGames } from "../../services/feedbackService";
import Header from "../../components/Header";
import "./LikedGames.css";

const LikedGames = () => {
  const { user } = useAuth();
  const [likedGames, setLikedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLikedGames = async () => {
      if (!user) return;
      const games = await fetchLikedGames(user.id);
      setLikedGames(games);
      setLoading(false);
    };

    loadLikedGames();
  }, [user]);

  return (
    <div className="liked-games-page">
      <Header />

      <div className="liked-games-content">
        <h2>Liked Games</h2>

        {loading ? (
          <p>Loading your liked games...</p>
        ) : likedGames.length === 0 ? (
          <div className="liked-games-empty">
            You haven't liked any games yet.
          </div>
        ) : (
          <div className="liked-games-grid">
            {likedGames.map((game) => (
              <div key={game.id} className="liked-game-card">
                <div className="liked-game-info">
                  <h3>{game.title}</h3>
                  <p>
                    <strong>Genre:</strong> {game.genre}
                  </p>
                  <p>
                    <strong>Platform:</strong> {game.platform}
                  </p>
                  <p>
                    <strong>Year:</strong> {game.release_year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedGames;

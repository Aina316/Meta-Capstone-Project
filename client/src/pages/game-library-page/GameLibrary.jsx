import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/authContext";
import Header from "../../components/Header";
import AddGameModal from "./AddGameModal";
import "./GameLibrary.css";

const GameLibrary = () => {
  const { user } = useAuth();
  const [ownedGames, setOwnedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadLibrary = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("owner_id", user.id);

    if (error) {
      console.error("Error fetching games:", error);
      setOwnedGames([]);
    } else {
      setOwnedGames(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadLibrary();
  }, [user]);

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("games")
      .delete()
      .eq("id", id)
      .eq("owner_id", user.id);

    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete game from your library.");
    } else {
      loadLibrary();
    }
  };

  return (
    <div className="game-library-page">
      <Header />

      <div className="game-library-content">
        <h2>My Game Library</h2>

        {loading ? (
          <p>Loading your games...</p>
        ) : ownedGames.length === 0 ? (
          <div className="game-library-empty">
            No games in your library yet.
          </div>
        ) : (
          <div className="game-library-grid">
            {ownedGames.map((game) => (
              <div key={game.id} className="owned-game-card">
                <div className="owned-game-info">
                  <h3>{game.title}</h3>
                  <p>
                    <strong>Platform:</strong> {game.platform}
                  </p>
                  <p>
                    <strong>Condition:</strong> {game.condition}
                  </p>
                  <p>
                    <strong>Available:</strong> {game.available ? "Yes" : "No"}
                  </p>
                </div>
                <button
                  className="delete-game-btn"
                  onClick={() => handleDelete(game.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <button className="add-game-btn" onClick={() => setShowAddModal(true)}>
          Add Game to library
        </button>
      </div>

      {showAddModal && (
        <AddGameModal
          userId={user.id}
          onClose={() => setShowAddModal(false)}
          onGameAdded={loadLibrary}
        />
      )}
    </div>
  );
};

export default GameLibrary;

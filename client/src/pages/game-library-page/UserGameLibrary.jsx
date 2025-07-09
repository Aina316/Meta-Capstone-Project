import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import Header from "../../components/Header";
import image from "../../assets/images/default_avatar.jpg";
import "./GameLibrary.css";

const UserGameLibrary = () => {
  const { userId } = useParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownerProfile, setOwnerProfile] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username, image")
        .eq("id", userId)
        .single();

      if (profileError) console.error("Error loading profile:", profileError);
      else setOwnerProfile(profile);

      const { data: userGames, error } = await supabase
        .from("games")
        .select("*")
        .eq("owner_id", userId);

      if (error) {
        console.error("Error loading games:", error);
        setGames([]);
      } else {
        setGames(userGames);
      }
      setLoading(false);
    };

    loadData();
  }, [userId]);

  if (loading) return <p>Loading library...</p>;

  return (
    <div className="game-library-page">
      <Header />
      <div className="game-library-content">
        <h2>{ownerProfile?.username}'s Game Library</h2>
        <img
          src={ownerProfile?.image || image}
          alt={ownerProfile?.username}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            marginBottom: "20px",
          }}
        />

        {games.length === 0 ? (
          <p className="game-library-empty">
            This user has no games in their library yet.
          </p>
        ) : (
          <div className="game-library-grid">
            {games.map((game) => (
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserGameLibrary;

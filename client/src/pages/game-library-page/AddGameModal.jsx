import { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import "./GameLibrary.css";

const AddGameModal = ({ userId, onClose, onGameAdded }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("catalog")
        .select("*")
        .ilike("title", `%${searchQuery}%`)
        .limit(20);

      if (error) {
        console.error("Catalog search error:", error);
        alert("Error searching catalog.");
      } else {
        setResults(data);
      }

      setLoading(false);
    };

    fetchCatalog();
  }, [searchQuery]);

  const handleAddGame = async (item) => {
    const { error } = await supabase.from("games").insert([
      {
        owner_id: userId,
        catalog_id: item.id,
        title: item.title,
        platform: item.platform,
        condition: "Good",
        available: true,
      },
    ]);

    if (error) {
      console.error("Add game error:", error);
      alert("Failed to add game.");
    } else {
      alert(`${item.title} added to your library!`);
      onGameAdded();
      onClose();
    }
  };

  return (
    <div className="game-library-page-modal-overlay">
      <div className="game-library-page-modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>Add a Game from Catalog</h2>

        <input
          type="text"
          className="search-bar"
          placeholder="Search for games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading && <p>Searching catalog...</p>}

        {!loading && searchQuery && results.length === 0 && (
          <p>No matching games found.</p>
        )}

        <div className="game-library-grid">
          {results.map((item) => (
            <div key={item.id} className="owned-game-card">
              {item.cover_image && (
                <img
                  src={item.cover_image}
                  alt={item.title}
                  className="cover-image"
                />
              )}
              <div className="owned-game-info">
                <h3>{item.title}</h3>
                <p>
                  <strong>Platform:</strong> {item.platform}
                </p>
              </div>
              <button
                className="add-game-btn"
                onClick={() => handleAddGame(item)}
              >
                Add to My Library
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddGameModal;

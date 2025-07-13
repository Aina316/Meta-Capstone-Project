import { useState, useEffect } from "react";
import { fetchAllGenres } from "../../services/catalogService";
import "./FavoriteGenresModal.css";

export default function FavoriteGenresModal({ onSave, onClose }) {
  const [genres, setGenres] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function loadGenres() {
      const result = await fetchAllGenres();
      setGenres(result);
    }
    loadGenres();
  }, []);

  const toggleGenre = (genre) => {
    if (selected.includes(genre)) {
      setSelected(selected.filter((g) => g !== genre));
    } else if (selected.length < 5) {
      setSelected([...selected, genre]);
    }
  };

  const handleSubmit = () => {
    if (selected.length !== 5) {
      alert("Please select exactly 5 genres.");
      return;
    }
    onSave(selected);
  };

  return (
    <div className="genre-modal-overlay">
      <div className="genre-modal-content">
        <h2>Pick Your Top 5 Genres From Most to Least Liked</h2>
        <div className="genre-grid">
          {genres.map((genre) => (
            <button
              key={genre}
              className={selected.includes(genre) ? "selected" : ""}
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
        <div className="genre-modal-actions">
          <button onClick={handleSubmit}>Save Genres</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

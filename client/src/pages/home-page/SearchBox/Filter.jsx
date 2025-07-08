import { useState, useEffect } from "react";
import { fetchAllGenres } from "../../../services/catalogService";
import "./Filter.css";

const Filter = ({ onClose, onApply }) => {
  const [allAvailableGenres, setAllAvailableGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    const loadGenres = async () => {
      const genres = await fetchAllGenres();
      setAllAvailableGenres(genres);
    };
    loadGenres();
  }, []); // This loads the genre options into filter modal

  const handleApply = () => {
    onApply({ genre: selectedGenre });
    onClose();
  };
  return (
    <div className="filter-modal-overlay">
      <div className="filter-modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>Filter Games</h2>

        <label>
          Genre:{" "}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All</option>
            {allAvailableGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>

        <button className="apply-btn" onClick={handleApply}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;

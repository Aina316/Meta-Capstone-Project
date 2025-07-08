import { useState, useEffect } from "react";
import {
  fetchAllGenres,
  fetchAllPlatforms,
} from "../../../services/catalogService";
import "./Filter.css";

const Filter = ({
  onClose,
  onApply,
  selectedGenre,
  setSelectedGenre,
  selectedPlatform,
  setSelectedPlatform,
}) => {
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    const loadFilters = async () => {
      const genresList = await fetchAllGenres();
      const platfromsList = await fetchAllPlatforms();
      setGenres(genresList);
      setPlatforms(platfromsList);
    };
    loadFilters();
  }, []); // This loads the genre and platforms options into the filter modal options for user choice.

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
        <div className="filter-section">
          <label>
            Genre:
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map((genre, idx) => (
                <option key={idx} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="filter-section">
          <label>
            Platforms:
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option value="">All Platforms</option>
              {platforms.map((platform, idx) => (
                <option key={idx} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="apply-btn" onClick={handleApply}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;

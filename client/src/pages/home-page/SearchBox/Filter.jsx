import { useState } from "react";
import "./Filter.css";

const Filter = ({ currentFilters, onClose, onApply }) => {
  const [availability, setAvailability] = useState(currentFilters.availability);
  const [platform, setPlatform] = useState(currentFilters.platform);
  const [genre, setGenre] = useState(currentFilters.genre);

  const handleApply = () => {
    onApply({ availability, platform, genre });
  };

  return (
    <div className="filter-modal-overlay">
      <div className="filter-modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>Filter Games</h2>

        <div className="filter-section">
          <label>Availability:</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="all">All</option>
            <option value="available">Available only</option>
          </select>
        </div>

        <div className="filter-section">
          <label>Platform:</label>
          <input
            type="text"
            value={platform}
            placeholder="e.g. PC, Xbox"
            onChange={(e) => setPlatform(e.target.value)}
          />
        </div>

        <div className="filter-section">
          <label>Genre:</label>
          <input
            type="text"
            value={genre}
            placeholder="e.g. , Strategy"
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>

        <button className="apply-btn" onClick={handleApply}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;

import { useState, useEffect } from "react";
import { fetchAllPlatforms } from "../../services/catalogService";
import "./FavoritePlatformsModal.css";

export default function FavoritePlatformsModal({ onSave, onClose }) {
  const [platforms, setPlatforms] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function loadPlatforms() {
      const result = await fetchAllPlatforms();
      setPlatforms(result);
    }
    loadPlatforms();
  }, []);

  const togglePlatform = (platform) => {
    if (selected.includes(platform)) {
      setSelected(selected.filter((p) => p !== platform));
    } else if (selected.length < 3) {
      setSelected([...selected, platform]);
    }
  };

  const handleSubmit = () => {
    if (selected.length !== 3) {
      alert("Please select exactly 3 platforms.");
      return;
    }
    onSave(selected);
  };

  return (
    <div className="platform-modal-overlay">
      <div className="platform-modal-content">
        <h2>Select Your Top 3 Platforms</h2>
        <div className="platform-grid">
          {platforms.map((platform) => (
            <button
              key={platform}
              className={selected.includes(platform) ? "selected" : ""}
              onClick={() => togglePlatform(platform)}
            >
              {platform}
            </button>
          ))}
        </div>
        <div className="platform-modal-actions">
          <button onClick={handleSubmit}>Save Platforms</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

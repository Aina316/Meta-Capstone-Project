import { useState } from "react";
import { fetchGame } from "../services/igdbService";

const GameForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAutofill = async () => {
    if (!title) return;
    setLoading(true);
    const data = await fetchGame(title);
    if (data) {
      setPlatform(data.platform);
      setImageUrl(data.imageUrl);
    } else {
      alert("No game found!");
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      platform,
      image_url: imageUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Game title"
        required
      />
      <button type="button" onClick={handleAutofill} disabled={loading}>
        {loading ? "Loading..." : "Autofill via IGDB"}
      </button>

      <input
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        placeholder="Platform"
        required
      />

      {imageUrl && <img src={imageUrl} alt="Cover" style={{ width: 100 }} />}

      <button type="submit">Save Game</button>
    </form>
  );
};

export default GameForm;

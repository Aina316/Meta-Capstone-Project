import { useState, useEffect } from "react";
import { updateUserProfile } from "../../services/profileService";
import AvatarUpdate from "./AvatarUpdate";
import "./EditProfile.css";
import { useNavigate } from "react-router-dom";
import {
  fetchAllGenres,
  fetchAllPlatforms,
} from "../../services/catalogService";

const EditProfile = ({ profile, onClose, onUpdatedProfile }) => {
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [image, setImage] = useState(profile?.image);
  const [location, setLocation] = useState(profile?.location || "Unknown");
  const [saving, setSaving] = useState(false);
  const [favoriteGenres, setFavoriteGenres] = useState(
    profile?.favorite_genres || []
  );
  const [favoritePlatforms, setFavoritePlatforms] = useState(
    profile?.favorite_platforms || []
  );

  const [allGenres, setAllGenres] = useState([]);
  const [allPlatforms, setAllPlatforms] = useState([]);
  const [minBorrowerScore, setMinBorrowerScore] = useState(
    profile?.min_borrower_score ?? 5
  );
  const navigate = useNavigate();

  useEffect(() => {
    async function loadOptions() {
      setAllGenres(await fetchAllGenres());
      setAllPlatforms(await fetchAllPlatforms());
    }
    loadOptions();
  }, []);

  const handleSave = async () => {
    if (favoriteGenres.length !== 5) {
      alert("Please select exactly 5 favorite genres.");
      return;
    }
    if (favoritePlatforms.length !== 3) {
      alert("Please select exactly 3 favorite platforms.");
      return;
    }

    setSaving(true);
    const { error, data } = await updateUserProfile({
      username,
      bio,
      image,
      location,
      favorite_genres: favoriteGenres,
      favorite_platforms: favoritePlatforms,
      min_borrower_score: minBorrowerScore,
    });
    setSaving(false);

    if (error) {
      alert("Failed to save profile");
    } else {
      alert("Profile Updated!");
      onUpdatedProfile(data);
      navigate("/profile");
    }
  };

  return (
    <div className="profile-update-backdrop" onClick={onClose}>
      <div
        className="profile-update-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>
          X
        </button>

        <h3>Edit Profile</h3>

        <AvatarUpdate currentImage={image} onUpload={(url) => setImage(url)} />

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
        />
        <textarea
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Your New City or Region"
        />
        <h4>Minimum Borrower Score Required: </h4>
        <input
          type="number"
          min="0"
          max="10"
          step="1"
          value={minBorrowerScore}
          onChange={(e) => setMinBorrowerScore(parseFloat(e.target.value))}
        />
        <h4>Favorite Genres (Select 5):</h4>
        <div className="multi-select-grid">
          {allGenres.map((genre) => (
            <button
              key={genre}
              className={favoriteGenres.includes(genre) ? "selected" : ""}
              onClick={() => {
                if (favoriteGenres.includes(genre)) {
                  setFavoriteGenres(favoriteGenres.filter((g) => g !== genre));
                } else if (favoriteGenres.length < 5) {
                  setFavoriteGenres([...favoriteGenres, genre]);
                }
              }}
            >
              {genre}
            </button>
          ))}
        </div>

        <h4>Favorite Platforms (Select 3):</h4>
        <div className="multi-select-grid">
          {allPlatforms.map((platform) => (
            <button
              key={platform}
              className={favoritePlatforms.includes(platform) ? "selected" : ""}
              onClick={() => {
                if (favoritePlatforms.includes(platform)) {
                  setFavoritePlatforms(
                    favoritePlatforms.filter((p) => p !== platform)
                  );
                } else if (favoritePlatforms.length < 3) {
                  setFavoritePlatforms([...favoritePlatforms, platform]);
                }
              }}
            >
              {platform}
            </button>
          ))}
        </div>

        <button className="save-button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
export default EditProfile;

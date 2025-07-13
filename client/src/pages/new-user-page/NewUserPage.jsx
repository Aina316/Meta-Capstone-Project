import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { uploadAvatar } from "../../services/uploadAvatar";
import { useAuth } from "../../context/authContext";
import LocationAutocomplete from "../../components/LocationAutocomplete";
import FavoriteGenresModal from "./FavoriteGenresModal";
import "./NewUserPage.css";

const NewUserPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showGenreModal, setShowGenreModal] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      supabase
        .from("profiles")
        .select("username, bio, location, latitude, longitude, image")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setUsername(data.username || "");
            setBio(data.bio || "");
            setAvatarUrl(data.image || "");

            if (data.location && data.latitude && data.longitude) {
              setLocation({
                short_label: data.location,
                latitude: data.latitude,
                longitude: data.longitude,
              });
            }
          }
        });
    }
  }, [user, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    let publicUrl = avatarUrl;
    if (avatarFile) {
      const { error: uploadError, url } = await uploadAvatar(
        avatarFile,
        user.id
      );
      if (uploadError) {
        alert("Error uploading avatar");
        setSaving(false);
        return;
      }
      publicUrl = url;
    }

    const updates = {
      username,
      bio,
      location: location?.short_label || "",
      latitude: location?.latitude || null,
      longitude: location?.longitude || null,
      image: publicUrl,
      previousUser: true,
    };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) {
      alert("Failed to save profile");
    } else {
      setShowGenreModal(true);
    }
    setSaving(false);
  };

  const handleFavoriteGenreSave = async (selectedGenres) => {
    const { error } = await supabase
      .from("profiles")
      .update({ favorite_genres: selectedGenres })
      .eq("id", user.id);

    if (error) {
      alert("Failed to save favorite genres");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="new-user-page">
      <div className="new-user-card">
        <h2>Complete Your Profile</h2>
        <form className="new-user-page-form" onSubmit={handleSubmit}>
          <div>
            <label className="input-label">Username</label>
            <input
              type="text"
              className="input-field"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="input-label">Bio</label>
            <textarea
              className="textarea-field"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <label className="input-label">Location</label>
            <LocationAutocomplete value={location} onChange={setLocation} />
          </div>

          <div>
            <label className="input-label">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={handleFileChange}
            />
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="avatar-preview"
              />
            )}
          </div>
          <button className="submit-btn" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>
      {showGenreModal && (
        <FavoriteGenresModal
          onSave={handleFavoriteGenreSave}
          onClose={() => setShowGenreModal(false)}
        />
      )}
    </div>
  );
};

export default NewUserPage;

import { useState } from "react";
import { updateUserProfile } from "../../services/profileService";
import AvatarUpdate from "./AvatarUpdate";
import "./EditProfile.css";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ profile, onClose, onUpdatedProfile }) => {
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [image, setImage] = useState(profile?.image);
  const [location, setLocation] = useState(profile?.location || "Unknown");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const handleSave = async () => {
    setSaving(true);
    const { error, data } = await updateUserProfile({
      username,
      bio,
      image,
      location,
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
        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
export default EditProfile;

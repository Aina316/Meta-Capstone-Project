import { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
} from "../../services/profileService";
import AvatarUpdate from "./AvatarUpdate";
import image from "/src/assets/images/default_avatar.jpg";
import Header from "../../components/Header";
import "./ProfilePage.css";
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => alert("Error fetching profile"));
  }, []);

  const handleSave = async () => {
    const { error } = await updateUserProfile({
      username: profile.username,
      bio: profile.bio,
    });
    if (!error) alert("Profile updated!");
    else alert("Update failed.");
  };

  const handleAvatarUpdate = (url) => {
    setProfile((prev) => ({ ...prev, image: url }));
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profilepage-component">
      <Header />

      <div className="profilepage-content">
        <h2>My Profile</h2>
        <img src={profile.image || image} alt="Avatar" />
        <AvatarUpdate onUpload={handleAvatarUpdate} />

        <input
          value={profile.username || ""}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          placeholder="Username"
        />
        <textarea
          value={profile.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Bio"
        />
        <button onClick={handleSave}>Save Changes</button>

        <hr />
        <p>
          <strong>Lender Score:</strong> {profile.lender_score}
        </p>
        <p>
          <strong>Borrower Score:</strong> {profile.borrower_score}
        </p>
        <p>
          <strong>Reputation:</strong> ⭐ {profile.reputation?.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
